-- 1. Add history arrays to track the move queues
ALTER TABLE xo_matches 
ADD COLUMN IF NOT EXISTS history_x JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS history_o JSONB DEFAULT '[]'::jsonb;

-- 2. Create the backend RPC function to handle moves securely
CREATE OR REPLACE FUNCTION make_xo_move(
    p_match_id UUID, 
    p_role TEXT, 
    p_index INT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_match xo_matches%ROWTYPE;
    v_board JSONB;
    v_history JSONB;
    v_popped_index INT;
    v_winner TEXT := NULL;
    v_winning_cells JSONB := NULL;
    v_status TEXT;
    
    -- Variables for win checking
    v_lines INT[][] := ARRAY[
        [0,1,2], [3,4,5], [6,7,8], -- Rows
        [0,3,6], [1,4,7], [2,5,8], -- Cols
        [0,4,8], [2,4,6]           -- Diagonals
    ];
    i INT;
    v_a TEXT; v_b TEXT; v_c TEXT;
BEGIN
    -- 1. Fetch match and validate
    SELECT * INTO v_match FROM xo_matches WHERE id = p_match_id FOR UPDATE;
    
    IF v_match.id IS NULL THEN
        RAISE EXCEPTION 'Match not found';
    END IF;
    
    IF v_match.status != 'playing' THEN
        RAISE EXCEPTION 'Match is not in playing state';
    END IF;
    
    IF v_match.turn != p_role THEN
        RAISE EXCEPTION 'Not your turn';
    END IF;
    
    -- In JSONB, check if cell is not empty string
    IF (v_match.board->>p_index) != '' THEN
        RAISE EXCEPTION 'Cell is already occupied';
    END IF;

    -- Initialize variables based on current state
    v_board := v_match.board;
    
    -- 2. Handle Queue Logic (FIFO)
    IF p_role = 'X' THEN
        v_history := COALESCE(v_match.history_x, '[]'::jsonb);
        v_history := v_history || to_jsonb(p_index);
        
        -- If queue length > 3, pop oldest and clear board
        IF jsonb_array_length(v_history) > 3 THEN
            v_popped_index := (v_history->0)::INT;
            v_history := v_history - 0; -- Remove 0th element
            v_board := jsonb_set(v_board, ARRAY[v_popped_index::text], '""'::jsonb);
        END IF;
        
        -- Update the specific queue
        UPDATE xo_matches SET history_x = v_history WHERE id = p_match_id;
    ELSE
        v_history := COALESCE(v_match.history_o, '[]'::jsonb);
        v_history := v_history || to_jsonb(p_index);
        
        -- If queue length > 3, pop oldest and clear board
        IF jsonb_array_length(v_history) > 3 THEN
            v_popped_index := (v_history->0)::INT;
            v_history := v_history - 0; -- Remove 0th element
            v_board := jsonb_set(v_board, ARRAY[v_popped_index::text], '""'::jsonb);
        END IF;
        
        -- Update the specific queue
        UPDATE xo_matches SET history_o = v_history WHERE id = p_match_id;
    END IF;

    -- 3. State Mutation
    v_board := jsonb_set(v_board, ARRAY[p_index::text], to_jsonb(p_role));
    
    -- 4. Win Condition Check
    FOR i IN 1..8 LOOP
        v_a := v_board->>(v_lines[i][1]);
        v_b := v_board->>(v_lines[i][2]);
        v_c := v_board->>(v_lines[i][3]);
        
        IF v_a != '' AND v_a = v_b AND v_a = v_c THEN
            v_winner := v_a;
            v_winning_cells := to_jsonb(ARRAY[v_lines[i][1], v_lines[i][2], v_lines[i][3]]);
            EXIT;
        END IF;
    END LOOP;
    
    -- Check draw
    IF v_winner IS NULL AND NOT (v_board @> '""'::jsonb) THEN
        -- Though rare, if no empty string is found
        v_winner := 'draw';
        v_winning_cells := '[]'::jsonb;
    END IF;
    
    -- 5. Final Update
    IF v_winner IS NOT NULL THEN
        UPDATE xo_matches 
        SET board = v_board, 
            status = 'completed', 
            winner = v_winner, 
            winning_cells = v_winning_cells
        WHERE id = p_match_id
        RETURNING status INTO v_status;
    ELSE
        UPDATE xo_matches 
        SET board = v_board, 
            turn = CASE WHEN p_role = 'X' THEN 'O' ELSE 'X' END
        WHERE id = p_match_id
        RETURNING status INTO v_status;
    END IF;

    RETURN jsonb_build_object('success', true, 'status', v_status);
END;
$$;

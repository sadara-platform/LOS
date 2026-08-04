const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const GameStore = require('./repositories/GameStore');
const DatabaseService = require('./repositories/DatabaseService');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*', // For local development MVP
        methods: ['GET', 'POST']
    }
});

const TURN_TIME_LIMIT_MS = 10000; // 10 seconds sudden death timer

// Winning combinations for a 3x3 grid
const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWin(board) {
    for (let combo of WINNING_COMBINATIONS) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return { winner: board[a], winningCells: combo };
        }
    }
    if (!board.includes('')) {
        return { winner: 'draw', winningCells: [] };
    }
    return null;
}

function handleTimeout(matchId) {
    const match = GameStore.getMatch(matchId);
    if (!match || match.status !== 'playing') return;

    // The current player timed out, so the other player wins
    const winner = match.turn === 'X' ? 'O' : 'X';
    
    match.status = 'completed';
    match.winner = winner;
    match.winMethod = 'timeout';

    GameStore.updateMatch(matchId, match);

    // Save to DB
    DatabaseService.saveMatch({
        matchId,
        playerX: match.players.X,
        playerO: match.players.O,
        winner,
        method: 'timeout'
    });

    io.to(matchId).emit('match_state', match);
    GameStore.deleteMatch(matchId); // Cleanup
}

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('join_match', (matchId) => {
        let match = GameStore.getMatch(matchId);

        if (!match) {
            // Initialize new match
            match = {
                id: matchId,
                board: Array(9).fill(''),
                turn: 'X',
                players: { X: socket.id, O: null },
                spectators: [],
                status: 'waiting',
                winner: null,
                winMethod: null,
                winningCells: [],
                lastMoveTime: null,
                timeoutTimer: null
            };
            GameStore.createMatch(matchId, match);
        } else if (!match.players.O && match.players.X !== socket.id) {
            // Assign player O
            match.players.O = socket.id;
            match.status = 'playing';
            match.lastMoveTime = Date.now();
            
            // Start the sudden death timer for player X's first move
            match.timeoutTimer = setTimeout(() => handleTimeout(matchId), TURN_TIME_LIMIT_MS);
            
            GameStore.updateMatch(matchId, match);
        } else if (match.players.X !== socket.id && match.players.O !== socket.id) {
            // Assign as spectator
            match.spectators.push(socket.id);
            GameStore.updateMatch(matchId, match);
        }

        socket.join(matchId);
        
        // Strip the timeoutTimer object before sending to clients
        const safeMatchState = { ...match };
        delete safeMatchState.timeoutTimer;
        
        io.to(matchId).emit('match_state', safeMatchState);
        console.log(`Socket ${socket.id} joined match ${matchId}`);
    });

    socket.on('make_move', ({ matchId, index }) => {
        const match = GameStore.getMatch(matchId);
        
        // Validation
        if (!match || match.status !== 'playing') return;
        if (match.board[index] !== '') return; // Cell occupied

        const currentPlayerSocket = match.players[match.turn];
        if (socket.id !== currentPlayerSocket) return; // Not their turn

        // Clear previous timer
        if (match.timeoutTimer) {
            clearTimeout(match.timeoutTimer);
        }

        // Apply move
        match.board[index] = match.turn;
        
        // Check win/draw
        const winResult = checkWin(match.board);
        if (winResult) {
            match.status = 'completed';
            match.winner = winResult.winner;
            match.winningCells = winResult.winningCells;
            match.winMethod = winResult.winner === 'draw' ? 'draw' : 'win';

            // Save to DB
            DatabaseService.saveMatch({
                matchId,
                playerX: match.players.X,
                playerO: match.players.O,
                winner: match.winner,
                method: match.winMethod
            });
        } else {
            // Switch turn and start timer
            match.turn = match.turn === 'X' ? 'O' : 'X';
            match.lastMoveTime = Date.now();
            match.timeoutTimer = setTimeout(() => handleTimeout(matchId), TURN_TIME_LIMIT_MS);
        }

        GameStore.updateMatch(matchId, match);

        // Broadcast safe state
        const safeMatchState = { ...match };
        delete safeMatchState.timeoutTimer;
        io.to(matchId).emit('match_state', safeMatchState);

        // If game over, cleanup store
        if (match.status === 'completed') {
            GameStore.deleteMatch(matchId);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
        // For a full production MVP, we could handle forfeit on disconnect here.
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

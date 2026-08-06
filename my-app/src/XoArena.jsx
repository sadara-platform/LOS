import React, { useEffect, useState, useRef } from 'react';
import { Swords, Users, Clock, Trophy } from 'lucide-react';
import { supabase } from './SupabaseClient';

export default function XoArena() {
  const [matchId, setMatchId] = useState('');
  const [inputMatchId, setInputMatchId] = useState('');
  const [matchState, setMatchState] = useState(null);
  const [sessionUser, setSessionUser] = useState('');
  
  // Create a unique session ID for this browser tab
  useEffect(() => {
    let sid = localStorage.getItem('xo_session_id');
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem('xo_session_id', sid);
    }
    setSessionUser(sid);
  }, []);

  // Sync URL logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room && sessionUser) {
      setMatchId(room);
      joinMatchById(room);
    }
  }, [sessionUser]);

  // Realtime Subscription
  useEffect(() => {
    if (!matchId) return;

    // Fetch initial state
    const fetchMatch = async () => {
      const { data, error } = await supabase
        .from('xo_matches')
        .select('*')
        .eq('id', matchId)
        .single();
      
      if (data) setMatchState(data);
    };
    
    fetchMatch();

    const channel = supabase.channel(`match:${matchId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'xo_matches', filter: `id=eq.${matchId}` },
        (payload) => {
          setMatchState(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [matchId]);

  const createMatch = async (e) => {
    e.preventDefault();
    if (!sessionUser) return;

    const { data, error } = await supabase
      .from('xo_matches')
      .insert([
        { 
          player_x: sessionUser, 
          status: 'waiting',
          board: Array(9).fill(''),
          turn: 'X'
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating match", error);
      return;
    }

    const url = new URL(window.location);
    url.searchParams.set('room', data.id);
    window.history.pushState({}, '', url);
    setMatchId(data.id);
  };

  const joinMatchById = async (idToJoin) => {
    const { data: currentMatch } = await supabase
      .from('xo_matches')
      .select('*')
      .eq('id', idToJoin)
      .single();

    if (!currentMatch) return;

    // If it's waiting and we are not X, we join as O
    if (currentMatch.status === 'waiting' && currentMatch.player_x !== sessionUser) {
      await supabase
        .from('xo_matches')
        .update({ player_o: sessionUser, status: 'playing' })
        .eq('id', idToJoin);
    }
    
    setMatchId(idToJoin);
  };

  const handleJoinForm = (e) => {
    e.preventDefault();
    if (!inputMatchId.trim()) return;
    
    const url = new URL(window.location);
    url.searchParams.set('room', inputMatchId);
    window.history.pushState({}, '', url);
    
    joinMatchById(inputMatchId);
  };

  const checkWin = (board) => {
    const WINNING_COMBINATIONS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

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
  };

  const makeMove = async (index) => {
    if (!matchState || matchState.status !== 'playing') return;
    if (matchState.board[index] !== '') return; // Cell occupied

    const role = getMyRole();
    if (role !== matchState.turn) return; // Not their turn

    const newBoard = [...matchState.board];
    newBoard[index] = role;

    const winResult = checkWin(newBoard);
    
    let updates = { board: newBoard };
    
    if (winResult) {
      updates.status = 'completed';
      updates.winner = winResult.winner;
      updates.winning_cells = winResult.winningCells;
    } else {
      updates.turn = role === 'X' ? 'O' : 'X';
    }

    // Optimistically update local state to avoid UI lag
    setMatchState({ ...matchState, ...updates });

    // Send to Supabase
    await supabase
      .from('xo_matches')
      .update(updates)
      .eq('id', matchId);
  };

  const getMyRole = () => {
    if (!matchState || !sessionUser) return null;
    if (matchState.player_x === sessionUser) return 'X';
    if (matchState.player_o === sessionUser) return 'O';
    return 'Spectator';
  };

  if (!matchId || !matchState) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
        {/* Cinematic LOS Ambient Lighting */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="bg-[#0A0A0A] border border-white/5 p-8 md:p-12 rounded-[32px] max-w-md w-full shadow-2xl text-center relative z-10">
          <div className="flex justify-center mb-8 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-cyan-500/20 blur-xl rounded-full" />
            <Swords className="w-16 h-16 text-white relative z-10" />
          </div>
          
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] font-bold uppercase text-white/70 font-mono">
              XO ENGINE v2.0
            </span>
          </div>

          <h1 className="text-4xl font-black tracking-widest mb-2 uppercase text-white">LOS Arena</h1>
          <p className="text-white/40 mb-10 text-sm font-medium tracking-wide">Serverless Matchmaking Protocol</p>
          
          <button 
            onClick={createMatch}
            className="w-full bg-white text-black font-black uppercase tracking-widest text-sm py-4 rounded-xl hover:scale-[1.02] transition-all duration-300 mb-4"
          >
            CREATE NEW MATCH
          </button>

          <div className="flex items-center gap-4 my-6 opacity-30">
            <div className="flex-1 h-px bg-white/20"></div>
            <span className="text-xs font-mono uppercase tracking-widest text-white">OR</span>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <form onSubmit={handleJoinForm} className="space-y-4">
            <input 
              type="text" 
              value={inputMatchId}
              onChange={(e) => setInputMatchId(e.target.value)}
              placeholder="ENTER MATCH UUID..."
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-center text-sm font-mono tracking-widest text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-colors uppercase"
            />
            <button 
              type="submit"
              className="w-full bg-transparent border border-white/10 hover:border-white/30 text-white font-bold text-sm tracking-widest py-4 rounded-xl uppercase transition-all duration-300"
            >
              JOIN MATCH
            </button>
          </form>
        </div>
      </div>
    );
  }

  const role = getMyRole();
  const isMyTurn = role && role === matchState.turn && matchState.status === 'playing';

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-900/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Header Info */}
      <div className="z-10 w-full max-w-2xl flex justify-between items-center mb-12 bg-black/50 backdrop-blur-xl border border-white/5 px-8 py-4 rounded-full shadow-2xl">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${matchState.turn === 'X' ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}>
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)] animate-pulse" />
          <span className="font-black text-lg tracking-widest text-white">PLAYER X</span>
          {role === 'X' && <span className="text-[9px] bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded uppercase tracking-wider font-bold">YOU</span>}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-white/40 text-xs font-mono uppercase tracking-widest">
            <span>VS</span>
          </div>
        </div>

        <div className={`flex items-center gap-3 transition-opacity duration-300 ${matchState.turn === 'O' ? 'opacity-100 scale-105' : 'opacity-40 grayscale'}`}>
          {role === 'O' && <span className="text-[9px] bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 px-2 py-0.5 rounded uppercase tracking-wider font-bold">YOU</span>}
          <span className="font-black text-lg tracking-widest text-white">PLAYER O</span>
          <div className={`w-2.5 h-2.5 rounded-full ${matchState.player_o ? 'bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.8)] animate-pulse' : 'bg-white/10'}`} />
        </div>
      </div>

      {/* Grid */}
      <div className="z-10 relative">
        {matchState.status === 'waiting' && (
          <div className="absolute inset-0 bg-[#050505]/80 backdrop-blur-md z-20 flex flex-col items-center justify-center rounded-[32px] border border-white/5">
            <div className="w-12 h-12 border-[3px] border-white/10 border-t-red-500 rounded-full animate-spin mb-6" />
            <h2 className="text-xl font-black text-white tracking-widest uppercase">Waiting for Opponent</h2>
            <p className="text-white/40 mt-3 text-xs font-mono tracking-widest">Share Match UUID to invite</p>
          </div>
        )}

        {matchState.status === 'completed' && (
          <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl z-30 flex flex-col items-center justify-center rounded-[32px] border border-white/10 animate-in fade-in duration-500 shadow-2xl">
            <Trophy className={`w-20 h-20 mb-8 ${
              matchState.winner === 'X' ? 'text-red-500 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 
              matchState.winner === 'O' ? 'text-cyan-400 drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 
              'text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]'
            }`} />
            
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 text-white drop-shadow-2xl">
              {matchState.winner === 'draw' ? 'DRAW!' : `PLAYER ${matchState.winner} WINS`}
            </h2>
            <button 
              onClick={() => {
                setMatchId('');
                setMatchState(null);
                window.history.pushState({}, '', window.location.pathname);
              }}
              className="mt-6 text-[10px] font-bold text-white/50 hover:text-white uppercase tracking-widest underline transition-colors"
            >
              EXIT ARENA
            </button>
          </div>
        )}

        <div className="grid grid-cols-3 gap-2 sm:gap-3 bg-white/[0.02] p-3 sm:p-4 rounded-[32px] shadow-2xl border border-white/5">
          {matchState.board.map((cell, index) => {
            const isWinningCell = matchState.winning_cells?.includes(index);
            const isHoverable = matchState.status === 'playing' && isMyTurn && !cell;
            
            return (
              <div 
                key={index}
                onClick={() => makeMove(index)}
                className={`
                  w-24 h-24 sm:w-32 sm:h-32 bg-[#0A0A0A] rounded-2xl flex items-center justify-center text-6xl sm:text-7xl font-black transition-all duration-300 border border-white/5 relative overflow-hidden
                  ${isHoverable ? 'cursor-pointer hover:bg-white/5 hover:border-white/10 hover:scale-[1.02] z-10 shadow-lg' : 'cursor-default'}
                  ${isWinningCell ? (matchState.winner === 'X' ? 'bg-red-500/10 border-red-500/50' : 'bg-cyan-500/10 border-cyan-500/50') : ''}
                `}
              >
                {cell === 'X' && (
                  <span className="text-red-500 animate-in zoom-in-50 duration-300 drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
                    X
                  </span>
                )}
                {cell === 'O' && (
                  <span className="text-cyan-400 animate-in zoom-in-50 duration-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.6)]">
                    O
                  </span>
                )}
                
                {/* Ghost Hover */}
                {isHoverable && (
                  <span className={`opacity-0 hover:opacity-10 transition-opacity duration-300 absolute text-6xl sm:text-7xl font-black ${role === 'X' ? 'text-red-500' : 'text-cyan-400'}`}>
                    {role}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Game Status */}
      <div className="mt-16 text-center z-10 flex flex-col items-center gap-4">
         <p className="text-white/30 uppercase tracking-[0.2em] text-[10px] font-bold">
           MATCH UUID
         </p>
         <div className="bg-black/50 border border-white/10 px-4 py-2 rounded-lg font-mono text-xs text-white/70 select-all cursor-pointer hover:bg-white/5 hover:text-white transition-colors">
            {matchId}
         </div>
      </div>
    </div>
  );
}

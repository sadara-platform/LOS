import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Swords, Users, Clock, Trophy } from 'lucide-react';

const SOCKET_URL = 'http://localhost:3001';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [matchId, setMatchId] = useState('');
  const [inputMatchId, setInputMatchId] = useState('');
  const [matchState, setMatchState] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  
  // Timer calculation
  useEffect(() => {
    if (!matchState || matchState.status !== 'playing') return;
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - matchState.lastMoveTime;
      const remaining = Math.max(0, 10000 - elapsed);
      setTimeLeft(Math.ceil(remaining / 1000));
    }, 100);
    
    return () => clearInterval(interval);
  }, [matchState]);

  // Socket Connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('match_state', (state) => {
      console.log('Received state:', state);
      setMatchState(state);
    });

    return () => newSocket.close();
  }, []);

  // Sync URL logic
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const room = params.get('room');
    if (room && socket) {
      setMatchId(room);
      socket.emit('join_match', room);
    }
  }, [socket]);

  const joinMatch = (e) => {
    e.preventDefault();
    if (!inputMatchId.trim()) return;
    
    const url = new URL(window.location);
    url.searchParams.set('room', inputMatchId);
    window.history.pushState({}, '', url);
    
    setMatchId(inputMatchId);
    socket.emit('join_match', inputMatchId);
  };

  const makeMove = (index) => {
    if (!socket || !matchState || matchState.status !== 'playing') return;
    socket.emit('make_move', { matchId, index });
  };

  const getMyRole = () => {
    if (!socket || !matchState) return null;
    if (matchState.players.X === socket.id) return 'X';
    if (matchState.players.O === socket.id) return 'O';
    return 'Spectator';
  };

  if (!matchId || !matchState) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="bg-glass p-8 rounded-2xl max-w-md w-full shadow-glass text-center">
          <div className="flex justify-center mb-6">
            <Swords className="w-16 h-16 text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
          </div>
          <h1 className="text-3xl font-black italic tracking-wider mb-2 uppercase text-glow-x text-cyan-400">LOS Arena</h1>
          <p className="text-gray-400 mb-8 font-medium">Real-Time XO Match Engine</p>
          
          <form onSubmit={joinMatch} className="space-y-4">
            <input 
              type="text" 
              value={inputMatchId}
              onChange={(e) => setInputMatchId(e.target.value)}
              placeholder="Enter Match Code..."
              className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button 
              type="submit"
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-bold py-3 rounded-lg shadow-neon-x transition-all duration-300 transform hover:scale-[1.02]"
            >
              ENTER ARENA
            </button>
          </form>
        </div>
      </div>
    );
  }

  const role = getMyRole();
  const isMyTurn = role && role === matchState.turn && matchState.status === 'playing';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Header Info */}
      <div className="z-10 w-full max-w-2xl flex justify-between items-center mb-12 bg-glass px-8 py-4 rounded-full">
        <div className={`flex items-center gap-3 ${matchState.turn === 'X' ? 'opacity-100' : 'opacity-50 transition-opacity'}`}>
          <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-pulse" />
          <span className="font-bold text-xl text-cyan-400 text-glow-x">PLAYER X</span>
          {role === 'X' && <span className="text-xs bg-white/10 px-2 py-1 rounded">YOU</span>}
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-white/50 text-sm font-medium">
            <Users size={16} />
            <span>{matchState.spectators.length} Spectators</span>
          </div>
          {matchState.status === 'playing' && (
            <div className={`flex items-center gap-2 font-mono text-2xl font-black ${timeLeft <= 3 ? 'text-red-500 animate-bounce' : 'text-white'}`}>
              <Clock size={24} />
              00:{timeLeft.toString().padStart(2, '0')}
            </div>
          )}
        </div>

        <div className={`flex items-center gap-3 ${matchState.turn === 'O' ? 'opacity-100' : 'opacity-50 transition-opacity'}`}>
          {role === 'O' && <span className="text-xs bg-white/10 px-2 py-1 rounded">YOU</span>}
          <span className="font-bold text-xl text-fuchsia-500 text-glow-o">PLAYER O</span>
          <div className={`w-3 h-3 rounded-full ${matchState.players.O ? 'bg-fuchsia-500 shadow-[0_0_10px_#d946ef] animate-pulse' : 'bg-gray-600'}`} />
        </div>
      </div>

      {/* Grid */}
      <div className="z-10 relative">
        {matchState.status === 'waiting' && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-2xl">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
            <h2 className="text-xl font-bold text-white tracking-widest uppercase">Waiting for Player O...</h2>
            <p className="text-white/50 mt-2 text-sm">Share URL to invite</p>
          </div>
        )}

        {matchState.status === 'completed' && (
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md z-30 flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-500">
            <Trophy className={`w-24 h-24 mb-6 ${
              matchState.winner === 'X' ? 'text-cyan-400 drop-shadow-[0_0_20px_#22d3ee]' : 
              matchState.winner === 'O' ? 'text-fuchsia-500 drop-shadow-[0_0_20px_#d946ef]' : 
              'text-white drop-shadow-[0_0_20px_#ffffff]'
            }`} />
            
            <h2 className="text-4xl font-black uppercase tracking-wider mb-2">
              {matchState.winner === 'draw' ? 'DRAW!' : `PLAYER ${matchState.winner} WINS!`}
            </h2>
            <p className="text-xl text-white/70 uppercase tracking-widest font-medium">
              By {matchState.winMethod}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 bg-white/5 p-3 rounded-2xl shadow-glass border border-white/10">
          {matchState.board.map((cell, index) => {
            const isWinningCell = matchState.winningCells?.includes(index);
            const isHoverable = matchState.status === 'playing' && isMyTurn && !cell;
            
            return (
              <div 
                key={index}
                onClick={() => makeMove(index)}
                className={`
                  w-28 h-28 sm:w-32 sm:h-32 bg-black/40 rounded-xl flex items-center justify-center text-7xl font-black transition-all duration-200
                  ${isHoverable ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}
                  ${isWinningCell ? (matchState.winner === 'X' ? 'bg-cyan-900/50 shadow-[inset_0_0_20px_#22d3ee]' : 'bg-fuchsia-900/50 shadow-[inset_0_0_20px_#d946ef]') : ''}
                `}
              >
                {cell === 'X' && <span className="text-cyan-400 text-glow-x animate-in zoom-in duration-200">X</span>}
                {cell === 'O' && <span className="text-fuchsia-500 text-glow-o animate-in zoom-in duration-200">O</span>}
                
                {/* Ghost Hover */}
                {isHoverable && (
                  <span className={`opacity-0 hover:opacity-20 transition-opacity absolute text-7xl font-black ${role === 'X' ? 'text-cyan-400 text-glow-x' : 'text-fuchsia-500 text-glow-o'}`}>
                    {role}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Footer Game Status */}
      <div className="mt-12 text-center z-10">
         <p className="text-white/40 uppercase tracking-widest text-sm font-bold">
           MATCH CODE: <span className="text-white bg-white/10 px-2 py-1 rounded ml-1">{matchId}</span>
         </p>
      </div>
    </div>
  );
}

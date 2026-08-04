import React, { useState, useEffect, useRef } from 'react';

// Icons using simple SVGs
const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const ServerIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
  </svg>
);
const TerminalIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const MOCK_LOGS_POOL = [
  "> [AUTH] Code LOS-992 activated by user_891",
  "> [AUTH] Code LOS-142 activated by user_402",
  "> [MATCH] Room #8812 created. X vs O",
  "> [MATCH] Room #8813 created. Spectator joined.",
  "> [MATCH] Match #7721 concluded. Winner: X",
  "> [ENGINE] Sudden Death timeout in Room #441",
  "> [ENGINE] State synced across 12 nodes.",
  "> [WARN] High latency detected on Node 2 (Retrying...)",
  "> [SYSTEM] Allocated 500 new QR blocks to memory."
];

export default function TournamentController() {
  // Stats State
  const [stats, setStats] = useState({
    totalPlayers: 1245,
    onlinePlayers: 838,
    activeMatches: 110,
    ping: 42
  });

  // Tournament State
  const [tournamentStatus, setTournamentStatus] = useState('WAITING'); // WAITING, ACTIVE, HALTED
  const [emergencyConfirm, setEmergencyConfirm] = useState(false);

  // Terminal State
  const [logs, setLogs] = useState([
    "> [SYSTEM] Boot sequence initiated...",
    "> [SYSTEM] Connected to LOS Match Engine.",
    "> [SYSTEM] Awaiting commands."
  ]);
  const logsEndRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Mock Real-Time Stats Interval
  useEffect(() => {
    const statsInterval = setInterval(() => {
      setStats(prev => {
        // Random slight fluctuations
        const onlineDelta = Math.floor(Math.random() * 7) - 3; // -3 to +3
        const matchesDelta = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const pingDelta = Math.floor(Math.random() * 5) - 2;
        
        // Occasionally someone registers
        const newRegistration = Math.random() > 0.8 ? 1 : 0;

        return {
          totalPlayers: prev.totalPlayers + newRegistration,
          onlinePlayers: Math.max(0, prev.onlinePlayers + onlineDelta),
          activeMatches: Math.max(0, prev.activeMatches + matchesDelta),
          ping: Math.max(10, prev.ping + pingDelta)
        };
      });
    }, 2000);

    return () => clearInterval(statsInterval);
  }, []);

  // Mock Real-Time Terminal Logs
  useEffect(() => {
    if (tournamentStatus === 'HALTED') return; // Stop logs if halted

    const logInterval = setInterval(() => {
      const randomLog = MOCK_LOGS_POOL[Math.floor(Math.random() * MOCK_LOGS_POOL.length)];
      const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric", second: "numeric" });
      
      setLogs(prev => {
        const newLogs = [...prev, `[${timestamp}] ${randomLog}`];
        // Keep only last 50 logs to prevent memory leak
        return newLogs.slice(-50);
      });
    }, Math.random() * 2000 + 1000); // Random interval between 1s and 3s

    return () => clearInterval(logInterval);
  }, [tournamentStatus]);

  // Handlers
  const handleStartTournament = () => {
    setTournamentStatus('ACTIVE');
    setEmergencyConfirm(false);
    setLogs(prev => [...prev, `> [SYSTEM] TOURNAMENT BATCH LAUNCHED. MATCHMAKING OPEN.`]);
  };

  const handleEmergencyPause = () => {
    if (!emergencyConfirm) {
      setEmergencyConfirm(true);
      setTimeout(() => setEmergencyConfirm(false), 3000); // Reset confirm after 3s
    } else {
      setTournamentStatus('HALTED');
      setEmergencyConfirm(false);
      setLogs(prev => [...prev, `> [CRITICAL] EMERGENCY HALT TRIGGERED. ALL MATCHES PAUSED.`]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-6 relative overflow-hidden flex flex-col">
      
      {/* Background Tech Grid (Subtle) */}
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center mb-8 bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div>
          <h2 className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-1 flex items-center gap-2">
            <ServerIcon /> Mission Control
          </h2>
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider">Tournament Controller</h1>
        </div>
        <div className="mt-4 md:mt-0 px-6 py-2 rounded-full border border-white/20 bg-black/50">
          <span className="text-gray-400 font-mono text-sm mr-2">SYSTEM STATUS:</span>
          <span className={`font-black tracking-widest ${
            tournamentStatus === 'ACTIVE' ? 'text-green-400 animate-pulse' : 
            tournamentStatus === 'HALTED' ? 'text-red-500' : 'text-yellow-400'
          }`}>
            {tournamentStatus}
          </span>
        </div>
      </div>

      {/* Real-Time Stats Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Registered" value={stats.totalPlayers} icon={<UsersIcon />} color="text-blue-400" />
        <StatCard title="Players Online" value={stats.onlinePlayers} icon={<ActivityIcon />} color="text-green-400" glow="shadow-[0_0_15px_rgba(74,222,128,0.3)]" />
        <StatCard title="Active Matches" value={stats.activeMatches} icon={<ServerIcon />} color="text-purple-400" />
        <StatCard title="Server Ping" value={`${stats.ping} ms`} icon={<ActivityIcon />} color={stats.ping > 50 ? "text-yellow-400" : "text-green-400"} />
      </div>

      {/* MAIN CONTROLS: The Danger Zone */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-8 mb-10">
        
        {/* START BUTTON */}
        <button 
          onClick={handleStartTournament}
          disabled={tournamentStatus === 'ACTIVE'}
          className={`relative group overflow-hidden w-full max-w-lg p-6 rounded-2xl border-2 transition-all duration-300
            ${tournamentStatus === 'ACTIVE' 
              ? 'bg-green-900/20 border-green-900/50 text-green-700 cursor-not-allowed' 
              : 'bg-green-500/10 border-green-400 text-green-400 hover:bg-green-400 hover:text-black hover:shadow-[0_0_40px_rgba(74,222,128,0.6)] hover:-translate-y-1'
            }
          `}
        >
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <ActivityIcon />
            <span className="text-2xl md:text-3xl font-black uppercase tracking-widest">
              {tournamentStatus === 'ACTIVE' ? 'Tournament Running' : 'Start Tournament Batch'}
            </span>
            <span className="text-sm font-mono opacity-70">Initializes Matchmaking Servers</span>
          </div>
        </button>

        {/* EMERGENCY PAUSE BUTTON */}
        <button 
          onClick={handleEmergencyPause}
          disabled={tournamentStatus === 'HALTED'}
          className={`relative overflow-hidden w-full max-w-lg p-6 rounded-2xl transition-all duration-300
            ${tournamentStatus === 'HALTED'
              ? 'bg-red-900/20 border-2 border-red-900/50 text-red-900 cursor-not-allowed'
              : emergencyConfirm
                ? 'bg-red-600 text-white border-2 border-red-400 shadow-[0_0_30px_rgba(220,38,38,0.8)] animate-pulse'
                : 'bg-transparent border-2 border-red-600 text-red-500 hover:bg-red-900/30'
            }
          `}
          style={!emergencyConfirm && tournamentStatus !== 'HALTED' ? {
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(220, 38, 38, 0.1) 10px, rgba(220, 38, 38, 0.1) 20px)'
          } : {}}
        >
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            <span className="text-xl md:text-2xl font-black uppercase tracking-widest">
              {tournamentStatus === 'HALTED' ? 'System Halted' : emergencyConfirm ? 'CLICK AGAIN TO CONFIRM HALT' : 'Emergency Pause'}
            </span>
            <span className="text-sm font-mono opacity-80">Sever all active socket connections</span>
          </div>
        </button>
      </div>

      {/* LIVE SERVER LOGS (The Terminal) */}
      <div className="relative z-10 w-full max-w-6xl mx-auto h-64 bg-black border border-white/10 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)] flex flex-col">
        <div className="bg-white/5 border-b border-white/10 px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400 text-sm font-mono">
            <TerminalIcon />
            <span>server-node-01.los.internal</span>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto font-mono text-sm md:text-base space-y-1">
          {logs.map((log, i) => (
            <div key={i} className={`
              ${log.includes('[CRITICAL]') || log.includes('[WARN]') ? 'text-red-400' : 
                log.includes('[SYSTEM]') ? 'text-gray-400' : 'text-cyan-400'}
            `}>
              {log}
            </div>
          ))}
          <div ref={logsEndRef} />
        </div>
      </div>

    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value, icon, color, glow = '' }) {
  return (
    <div className={`bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl flex flex-col items-center justify-center text-center transition-all ${glow}`}>
      <div className={`${color} mb-3 opacity-80`}>
        {icon}
      </div>
      <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-1">{title}</h3>
      <div className={`text-4xl font-black ${color}`}>
        {value}
      </div>
    </div>
  );
}

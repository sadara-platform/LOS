import React, { useEffect, useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { Swords, Trophy, History, Clock, ArrowRight } from 'lucide-react';

export default function ArenaDashboard() {
  const { session } = useOutletContext();
  const [tournament, setTournament] = useState(null);
  const [playerStatus, setPlayerStatus] = useState('Not Registered');
  const [activeMatchId, setActiveMatchId] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const fetchData = async () => {
      try {
        // 1. Fetch Active Tournament
        const { data: tourneyData } = await supabase
          .from('tournaments')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        setTournament(tourneyData);

        if (tourneyData) {
          // 2. Fetch Player Status
          const { data: playerData } = await supabase
            .from('players')
            .select('*')
            .eq('user_id', userId)
            .eq('tournament_id', tourneyData.id)
            .single();

          if (playerData) {
            setPlayerStatus(playerData.status);
            setActiveMatchId(playerData.current_match_id);
          } else {
            setPlayerStatus('Not Registered');
          }
        }

        // 3. Fetch Match History
        const { data: historyData } = await supabase
          .from('xo_matches')
          .select('*')
          .or(`player_x.eq.${userId},player_o.eq.${userId}`)
          .in('status', ['completed', 'draw'])
          .order('created_at', { ascending: false })
          .limit(5);

        if (historyData) setMatchHistory(historyData);

      } catch (err) {
        console.error("Error fetching arena data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up Realtime Subscription for Player Status changes (e.g. Admin starts match)
    const channel = supabase
      .channel('public:players')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'players',
        filter: `user_id=eq.${userId}`
      }, (payload) => {
        setPlayerStatus(payload.new.status);
        setActiveMatchId(payload.new.current_match_id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleEnterMatch = () => {
    if (activeMatchId) {
      navigate(`/match/${activeMatchId}`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      {/* Tournament Header */}
      <div className="bg-[#1A1A1A] border border-white/5 p-6 rounded-3xl relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-10 -mt-10"></div>
        <div className="flex items-start justify-between relative z-10">
          <div>
            <span className="text-[10px] tracking-widest text-red-500 font-bold uppercase mb-1 block">Active Tournament</span>
            <h1 className="text-2xl font-black uppercase tracking-tighter">{tournament?.name || 'No Active Event'}</h1>
          </div>
          <Trophy className="w-8 h-8 text-yellow-500 opacity-80" />
        </div>
        
        {tournament && (
          <div className="mt-6 flex gap-4">
            <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Prize Pool</span>
              <div className="font-bold text-lg text-white">{tournament.prize_pool || 'TBA'}</div>
            </div>
            <div className="bg-black/50 p-3 rounded-xl border border-white/5 flex-1">
              <span className="text-[10px] text-gray-500 uppercase font-bold">Round</span>
              <div className="font-bold text-lg text-white">{tournament.current_round}</div>
            </div>
          </div>
        )}
      </div>

      {/* Player Status Section */}
      <div className="bg-[#111] border border-white/5 p-6 rounded-3xl">
        <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-4">Your Status</h2>
        
        <div className="flex items-center gap-4 mb-6">
          <div className={`w-3 h-3 rounded-full animate-pulse ${
            playerStatus === 'Ready' || playerStatus === 'Playing' ? 'bg-green-500' : 
            playerStatus === 'Eliminated' ? 'bg-gray-600' : 'bg-yellow-500'
          }`}></div>
          <span className="text-xl font-bold uppercase">{playerStatus}</span>
        </div>

        {playerStatus === 'Ready' && (
          <button 
            onClick={handleEnterMatch}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 transition-all"
          >
            Enter Match
            <Swords className="w-5 h-5" />
          </button>
        )}
        
        {playerStatus === 'Eliminated' && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center text-sm text-gray-400">
            You have been eliminated from the current tournament. Better luck next time!
          </div>
        )}

        {playerStatus === 'Not Registered' && tournament && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl text-center text-sm text-gray-400">
            You are not registered for the active tournament. Look out for the next qualifier!
          </div>
        )}
      </div>

      {/* Match History */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <History className="w-4 h-4 text-gray-500" />
          <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold">Recent Matches</h2>
        </div>
        
        {matchHistory.length === 0 ? (
          <div className="bg-[#111] border border-white/5 p-6 rounded-3xl text-center text-gray-500 text-sm">
            No match history found.
          </div>
        ) : (
          <div className="space-y-3">
            {matchHistory.map((match) => {
              const isWinner = match.winner === session.user.id;
              const isDraw = match.status === 'draw';
              return (
                <div key={match.id} className="bg-[#111] border border-white/5 p-4 rounded-2xl flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold uppercase mb-1">Round {match.round_number || '?'}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(match.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    isWinner ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 
                    isDraw ? 'bg-gray-500/10 text-gray-400 border border-gray-500/20' : 
                    'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {isWinner ? 'Victory' : isDraw ? 'Draw' : 'Defeat'}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

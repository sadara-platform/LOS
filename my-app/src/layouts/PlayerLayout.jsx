import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { Swords, Ticket, LogOut } from 'lucide-react';

export default function PlayerLayout() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate('/'); // Redirect to home if not logged in
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        navigate('/');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Header */}
      <header className="bg-[#111] border-b border-white/5 p-4 flex justify-between items-center sticky top-0 z-50">
        <div className="font-black text-xl tracking-tighter uppercase text-white">LOS <span className="text-red-600">APP</span></div>
        <button 
          onClick={() => supabase.auth.signOut()}
          className="text-gray-400 hover:text-white transition-colors p-2"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow pb-24 overflow-y-auto">
        <Outlet context={{ session }} />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-[#111]/90 backdrop-blur-xl border-t border-white/5 pb-safe z-50">
        <div className="flex justify-around items-center h-16 max-w-md mx-auto">
          <Link 
            to="/app/arena" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/app/arena' ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Swords className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Arena</span>
          </Link>
          
          <Link 
            to="/app/discounts" 
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${location.pathname === '/app/discounts' ? 'text-red-500' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Ticket className="w-6 h-6" />
            <span className="text-[10px] uppercase font-bold tracking-widest">Discounts</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { ArrowRight, Lock } from 'lucide-react';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to app
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/app');
      }
    });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const mockEmail = `${phone.trim()}@gmail.com`;

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: mockEmail,
        password: password,
      });

      if (signInError) {
        throw signInError;
      }

      if (data.session) {
        navigate('/app');
      }
    } catch (err) {
      console.error(err);
      setError('Invalid phone number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="bg-[#111] border border-white/10 rounded-3xl p-8 md:p-12 w-full max-w-md relative z-10 shadow-2xl">
        <div className="w-16 h-16 bg-red-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-red-500/20">
          <Lock className="w-8 h-8 text-red-500" />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-widest text-center mb-2 text-white">Player Login</h1>
        <p className="text-gray-400 text-center text-sm mb-8">Enter your phone number to access the Arena and your Rewards.</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Phone Number</label>
            <input 
              type="tel" 
              placeholder="e.g. 07XXXXXXXXX" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-3 rounded-lg text-center font-bold">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                Login to Account
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/5 pt-6">
          <p className="text-xs text-gray-500">Don't have an account?</p>
          <p className="text-xs text-gray-400 mt-1">Scan a physical LOS card at any participating brand to activate it and create your account.</p>
        </div>
      </div>
    </div>
  );
}

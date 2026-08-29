import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { CheckCircle, AlertCircle, Loader2, Store } from 'lucide-react';

export default function OfferRedemptionPage() {
  const { redemptionId } = useParams();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [redemption, setRedemption] = useState(null);
  const [error, setError] = useState(null);
  
  // Auth state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        verifyRedemption(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        verifyRedemption(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, [redemptionId]);

  const verifyRedemption = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Redemption details with offer and brand info
      const { data: redData, error: redError } = await supabase
        .from('offer_redemptions')
        .select('*, offers(*, brands(*))')
        .eq('id', redemptionId)
        .single();
        
      if (redError || !redData) {
        throw new Error("Invalid or missing redemption code.");
      }
      
      // 2. Check if current user owns this brand
      const brandOwnerId = redData.offers?.brands?.owner_id;
      if (brandOwnerId !== userId) {
        throw new Error("Unauthorized. Only the owner of this brand can scan this QR code.");
      }

      setRedemption(redData);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setAuthLoading(false);
  };

  const confirmRedemption = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('offer_redemptions')
        .update({ status: 'used' })
        .eq('id', redemptionId);

      if (error) throw error;
      
      setRedemption({ ...redemption, status: 'used' });
      
      // Auto-navigate back to the scanner after 1.5 seconds
      setTimeout(() => {
        navigate('/brand-dashboard', { state: { activeTab: 'codes', isScanning: true } });
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setError("Failed to confirm redemption.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        <p className="font-mono text-sm tracking-widest uppercase">Verifying Scan...</p>
      </div>
    );
  }

  // If not logged in, show Brand Owner login
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 w-full max-w-md">
          <div className="text-center mb-8 border-b border-white/5 pb-6">
            <h1 className="text-xl font-black text-red-500 tracking-tighter uppercase mb-2">Brand Owner Login</h1>
            <p className="text-xs text-gray-500 tracking-widest uppercase">Login to verify this offer</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg text-xs font-bold text-center">
                {error}
              </div>
            )}
            
            <input 
              type="email" 
              placeholder="Admin Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            <input 
              type="password" 
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-red-500 transition-colors"
              required
            />
            
            <button 
              type="submit" 
              disabled={authLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-widest py-3 rounded-xl transition-all disabled:opacity-50 mt-4"
            >
              {authLoading ? 'Authenticating...' : 'Secure Login'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // If there's an error (e.g. invalid code, unauthorized)
  if (error && !redemption) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white">
        <div className="bg-[#111] border border-red-500/30 rounded-3xl p-8 max-w-md text-center shadow-2xl">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-xl font-black uppercase tracking-widest mb-4 text-red-500">Scan Failed</h1>
          <p className="text-gray-400 text-sm">{error}</p>
          <button onClick={() => navigate('/brand-dashboard')} className="mt-8 text-xs text-gray-500 uppercase tracking-widest underline">Go to Dashboard</button>
        </div>
      </div>
    );
  }

  if (!redemption) return null;

  const isUsed = redemption.status === 'used';
  const offer = redemption.offers;
  const brand = offer?.brands;

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-white">
      <div className="bg-[#111] border border-white/10 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl">
        
        <div className="p-8 text-center border-b border-white/5">
          <div className="w-20 h-20 bg-[#1A1A1A] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 overflow-hidden">
             {brand?.logo_url ? (
                <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
             ) : (
                <Store className="w-8 h-8 text-gray-500" />
             )}
          </div>
          <h2 className="text-sm tracking-widest text-red-500 uppercase font-bold">{brand?.name}</h2>
          <h1 className="text-2xl font-black uppercase mt-2">{offer?.title}</h1>
        </div>
        
        <div className="p-8 bg-black/50">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs text-gray-500 uppercase tracking-widest">Status</span>
              {isUsed ? (
                 <span className="bg-gray-800 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                   <CheckCircle className="w-3 h-3" /> Already Redeemed
                 </span>
              ) : (
                 <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                   <AlertCircle className="w-3 h-3" /> Valid & Ready
                 </span>
              )}
            </div>
            
            {offer?.discount_amount && (
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Discount</span>
                <span className="font-bold text-lg text-white">{offer.discount_amount}</span>
              </div>
            )}

            {offer?.discount_code && (
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <span className="text-xs text-gray-500 uppercase tracking-widest">Promo Code</span>
                <span className="font-mono text-red-400 font-bold">{offer.discount_code}</span>
              </div>
            )}
            
            <div className="flex justify-between items-start">
              <span className="text-xs text-gray-500 uppercase tracking-widest whitespace-nowrap">Details</span>
              <span className="text-sm text-gray-300 text-right ml-4 line-clamp-3">{offer?.description}</span>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-white/5">
             {isUsed ? (
               <button 
                 disabled
                 className="w-full bg-[#1A1A1A] text-gray-600 font-bold uppercase tracking-widest py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2"
               >
                 <CheckCircle className="w-5 h-5" />
                 Redeemed Successfully
               </button>
             ) : (
               <button 
                 onClick={confirmRedemption}
                 className="w-full bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest py-4 rounded-xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all flex items-center justify-center gap-2"
               >
                 <CheckCircle className="w-5 h-5" />
                 Confirm & Redeem
               </button>
             )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

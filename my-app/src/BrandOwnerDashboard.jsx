import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { BarChart3, Users, Ticket, Settings, LogOut, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BrandOwnerDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [brand, setBrand] = useState(null);
  const [analytics, setAnalytics] = useState({ totalCodes: 0, activatedCodes: 0, activationRate: 0 });
  const [offers, setOffers] = useState([]);
  
  // Profile Update State
  const [description, setDescription] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchBrandData(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchBrandData(session.user);
      else {
        setBrand(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const fetchBrandData = async (user) => {
    setLoading(true);
    try {
      // Fetch Brand
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (brandError) throw brandError;
      setBrand(brandData);
      setDescription(brandData.description || '');
      setPhoneNumber(brandData.phone_number || '');

      // Resilient Fetch for Analytics & Offers (Catch errors if tables don't exist yet)
      try {
        const { count: totalCodes } = await supabase.from('codes').select('*', { count: 'exact', head: true }).eq('brand_id', brandData.id);
        const { count: activatedCodes } = await supabase.from('codes').select('*', { count: 'exact', head: true }).eq('brand_id', brandData.id).eq('status', 'activated');
        
        const tot = totalCodes || 0;
        const act = activatedCodes || 0;
        setAnalytics({
          totalCodes: tot,
          activatedCodes: act,
          activationRate: tot > 0 ? Math.round((act / tot) * 100) : 0
        });
      } catch (err) {
        console.warn("Codes table might not be set up yet", err);
      }

      try {
        const { data: offersData } = await supabase.from('offers').select('*').eq('brand_id', brandData.id);
        if (offersData) setOffers(offersData);
      } catch (err) {
        console.warn("Offers table might not be set up yet", err);
      }

    } catch (err) {
      console.error("Error fetching brand data:", err.message);
      // It's possible the user is authenticated but not a brand owner
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: 'loading', message: 'Updating...' });
    
    const { error } = await supabase
      .from('brands')
      .update({ description, phone_number: phoneNumber })
      .eq('id', brand.id);

    if (error) {
      setUpdateStatus({ type: 'error', message: error.message });
    } else {
      setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
    }
  };

  // UI rendering
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-red-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#141414] border border-white/10 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Partner Portal</h1>
            <p className="text-zinc-500 text-sm">Secure access for authorized brand owners.</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {authError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {authError}
              </div>
            )}
            
            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                required
              />
            </div>
            
            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-bold tracking-widest uppercase py-4 rounded-lg transition-colors mt-4">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    );
  }

  // No Brand Found View
  if (!brand) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 font-sans text-white space-y-4">
        <AlertCircle className="w-16 h-16 text-zinc-600" />
        <h1 className="text-2xl font-black uppercase tracking-wider">Access Denied</h1>
        <p className="text-zinc-500 text-center max-w-sm">
          Your account is not linked to any active brand. Please contact the Platform Admin.
        </p>
        <button onClick={handleLogout} className="text-red-500 hover:text-red-400 text-sm font-bold tracking-widest uppercase underline">
          Sign Out
        </button>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white">
      {/* Header */}
      <header className="bg-[#141414] border-b border-white/5 px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          {brand.logo_url && <img src={brand.logo_url} alt="Logo" className="h-8 w-8 object-contain rounded-md" />}
          <div>
            <h1 className="text-xl font-black tracking-wider uppercase leading-none">{brand.name}</h1>
            <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">Brand Dashboard</span>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold tracking-widest uppercase">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6 md:p-8 space-y-8">
        
        {/* Analytics Section */}
        <section>
          <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Performance Analytics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
              <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Total Codes</div>
              <div className="text-4xl font-black tracking-tighter">{analytics.totalCodes}</div>
            </div>
            <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
              <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Activated</div>
              <div className="text-4xl font-black tracking-tighter text-cyan-400">{analytics.activatedCodes}</div>
            </div>
            <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
              <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Activation Rate</div>
              <div className="text-4xl font-black tracking-tighter text-red-500">{analytics.activationRate}%</div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Active Offers */}
          <section>
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              Active Offers
            </h2>
            <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
              {offers.length === 0 ? (
                <div className="p-8 text-center text-zinc-600 text-sm italic">
                  No active offers found.
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {offers.map(offer => (
                    <li key={offer.id} className="p-4 hover:bg-white/5 transition-colors flex justify-between items-center">
                      <div>
                        <div className="font-bold tracking-wide">{offer.title}</div>
                        <div className="text-xs text-zinc-500">{offer.description}</div>
                      </div>
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${offer.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {offer.status || 'Active'}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* Profile Updates */}
          <section>
            <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Basic Profile
            </h2>
            <form onSubmit={handleUpdateProfile} className="bg-[#141414] border border-white/5 p-6 rounded-2xl space-y-5">
              
              <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg flex items-start gap-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="text-xs text-red-200/70 leading-relaxed">
                  <strong>Restricted Area.</strong> Visual identity (colors, logo, slug) is locked to preserve platform aesthetics. You may only update textual descriptions and contact links.
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Brand Description</label>
                <textarea 
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors h-32 resize-none"
                  placeholder="Describe your brand's role in the tournament..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Support Phone Number</label>
                <input 
                  type="text"
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <div>
                  {updateStatus.message && (
                    <span className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${updateStatus.type === 'success' ? 'text-green-400' : updateStatus.type === 'error' ? 'text-red-400' : 'text-zinc-400'}`}>
                      {updateStatus.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
                      {updateStatus.message}
                    </span>
                  )}
                </div>
                <button 
                  type="submit" 
                  disabled={updateStatus.type === 'loading'}
                  className="bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-colors text-xs disabled:opacity-50"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>

        </div>
      </main>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { LogOut, AlertCircle, LayoutDashboard, Ticket, QrCode, Settings, LayoutTemplate, ShoppingBag } from 'lucide-react';

import AnalyticsTab from './AnalyticsTab';
import OffersTab from './OffersTab';
import CodesTab from './CodesTab';
import SettingsTab from './SettingsTab';
import CmsTab from './CmsTab';
import ProductsTab from './ProductsTab';

export default function BrandOwnerDashboard() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('analytics');
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Dashboard State
  const [brand, setBrand] = useState(null);

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
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('owner_id', user.id)
        .single();

      if (brandError) throw brandError;
      setBrand(brandData);
    } catch (err) {
      console.error("Error fetching brand data:", err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const navItems = [
    { id: 'analytics', label: 'Overview', icon: LayoutDashboard },
    { id: 'cms', label: 'Website CMS', icon: LayoutTemplate },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'offers', label: 'Offers', icon: Ticket },
    { id: 'codes', label: 'QR Codes', icon: QrCode },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Main Dashboard View with Sidebar
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white flex flex-col md:flex-row">
      
      {/* Mobile Header / Desktop Sidebar */}
      <aside className="w-full md:w-64 bg-[#141414] border-r border-white/5 flex flex-col md:min-h-screen shrink-0">
        <div className="p-6 border-b border-white/5 flex items-center justify-between md:flex-col md:items-start md:gap-4">
          <div className="flex items-center gap-4">
            {brand.logo_url && <img src={brand.logo_url} alt="Logo" className="h-10 w-10 object-contain rounded-lg bg-black/50 p-1" />}
            <div>
              <h1 className="text-lg font-black tracking-wider uppercase leading-none">{brand.name}</h1>
              <span className="text-[10px] tracking-widest text-zinc-500 uppercase font-bold">Partner Portal</span>
            </div>
          </div>
          
          <button onClick={handleLogout} className="md:hidden text-zinc-500 hover:text-white">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-x-auto md:overflow-y-auto custom-scrollbar flex md:flex-col p-4 gap-2 border-b md:border-b-0 border-white/5">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-all whitespace-nowrap shrink-0 md:w-full text-left
                  ${isActive ? 'bg-white/10 text-white' : 'text-zinc-500 hover:bg-white/5 hover:text-zinc-300'}
                `}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="hidden md:block p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'analytics' && <AnalyticsTab brand={brand} />}
          {activeTab === 'cms' && <CmsTab brand={brand} onBrandUpdate={setBrand} />}
          {activeTab === 'products' && <ProductsTab brand={brand} />}
          {activeTab === 'offers' && <OffersTab brand={brand} />}
          {activeTab === 'codes' && <CodesTab brand={brand} />}
          {activeTab === 'settings' && <SettingsTab brand={brand} onBrandUpdate={setBrand} />}
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 4px;
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}

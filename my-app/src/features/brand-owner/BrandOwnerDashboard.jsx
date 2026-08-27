import React, { useState, useEffect } from 'react';
import { supabase } from '../../SupabaseClient';
import { LogOut, AlertCircle, LayoutDashboard, Ticket, QrCode, Settings, LayoutTemplate, ShoppingBag } from 'lucide-react';

import AnalyticsTab from './components/AnalyticsTab';
import OffersTab from './components/OffersTab';
import CodesTab from './components/CodesTab';
import SettingsTab from './components/SettingsTab';
import CmsTab from './components/CmsTab';
import ProductsTab from './components/ProductsTab';

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
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-2 border-white/10 border-t-brand-accent rounded-full animate-spin neon-shadow mb-4"></div>
        <p className="font-code-sm text-brand-secondary tracking-widest uppercase animate-pulse">Initializing Interface...</p>
      </div>
    );
  }

  // Login View
  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 font-sans text-on-background relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-md w-full glass-panel border border-brand-border p-8 rounded-2xl relative z-10 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8 border-b border-brand-border pb-6">
            <h1 className="font-headline-lg-mobile text-brand-primary tracking-tighter uppercase mb-2 text-glow">Neon Nexus</h1>
            <p className="font-code-sm text-brand-secondary text-sm tracking-widest uppercase">Authorized Personnel Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {authError && (
              <div className="bg-error-container/20 border border-error/50 text-error p-3 rounded-lg text-sm flex items-center gap-2 font-code-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {authError}
              </div>
            )}
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-widest text-brand-secondary uppercase">IDENTIFICATION (EMAIL)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent font-code-sm">&gt;</span>
                <input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-primary font-code-sm focus:outline-none focus:border-brand-accent transition-colors"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-[10px] font-bold tracking-widest text-brand-secondary uppercase">ACCESS CODE (PASSWORD)</label>
              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-accent font-code-sm">&gt;</span>
                <input 
                  type="password" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-brand-surface border border-brand-border rounded-lg pl-10 pr-4 py-3 text-brand-primary font-code-sm focus:outline-none focus:border-brand-accent transition-colors"
                  required
                />
              </div>
            </div>
            
            <button type="submit" className="w-full bg-brand-accent/10 border border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-white font-code-sm tracking-widest uppercase py-4 rounded-lg transition-all mt-8 group flex justify-center items-center gap-2 relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                INITIATE_HANDSHAKE
                <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // No Brand Found View
  if (!brand) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 font-sans text-on-background space-y-6">
        <div className="w-24 h-24 rounded-full bg-error-container/10 border border-error/20 flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-error" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="font-headline-lg-mobile text-error uppercase tracking-wider text-glow">UNAUTHORIZED ACCESS</h1>
          <p className="font-code-sm text-brand-secondary max-w-sm mx-auto">
            Your credentials lack brand association. Please contact the SysAdmin.
          </p>
        </div>
        <button onClick={handleLogout} className="mt-8 border-b border-brand-accent text-brand-accent hover:text-white font-code-sm tracking-widest uppercase pb-1 transition-colors">
          TERMINATE_SESSION
        </button>
      </div>
    );
  }

  const navItems = [
    { id: 'analytics', label: 'Analytics', icon: 'analytics' },
    { id: 'cms', label: 'Dashboard CMS', icon: 'dashboard' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'offers', label: 'Offers', icon: 'local_offer' },
    { id: 'codes', label: 'QR Matrix', icon: 'qr_code_scanner' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  // Main Dashboard View with Sidebar
  return (
    <div className="min-h-screen bg-background font-sans text-on-background flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 glass-panel border-r border-brand-border flex flex-col transition-transform duration-300 transform -translate-x-full md:relative md:translate-x-0 bg-[#141414]/90 backdrop-blur-xl">
        <div className="h-20 flex items-center px-6 border-b border-white/5 pt-4 pb-4">
          <div className="flex items-center gap-3">
            {brand.logo_url && (
              <div className="w-10 h-10 rounded bg-[#0A0A0A] border border-white/10 p-1 flex shrink-0 items-center justify-center">
                <img src={brand.logo_url} alt="Logo" className="w-full h-full object-contain" />
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-title-md text-brand-primary uppercase tracking-tighter truncate w-36">{brand.name}</span>
              <span className="font-code-sm text-[10px] text-brand-accent tracking-widest uppercase">Admin Node</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg font-code-sm transition-all duration-300 group
                  ${isActive 
                    ? 'bg-brand-accent/10 text-brand-accent border border-brand-accent/30 neon-shadow' 
                    : 'text-brand-secondary hover:bg-white/5 hover:text-brand-primary border border-transparent'
                  }
                `}
              >
                <span 
                  className={`material-symbols-outlined mr-4 ${isActive ? '' : 'group-hover:text-brand-primary transition-colors'}`} 
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {item.icon}
                </span>
                <span className="tracking-widest uppercase text-xs">{item.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <button 
            onClick={handleLogout} 
            className="w-full flex items-center px-4 py-3 rounded-lg font-code-sm text-brand-secondary hover:bg-error-container/20 hover:text-error transition-all duration-300 group"
          >
            <span className="material-symbols-outlined mr-4 group-hover:text-error" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
            <span className="tracking-widest uppercase text-xs">DISCONNECT</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative bg-[#0A0A0A] custom-scrollbar">
        {/* Subtle background ambient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="p-6 md:p-10 w-full relative z-10 flex flex-col min-h-full">
          {activeTab === 'analytics' && <AnalyticsTab brand={brand} />}
          {activeTab === 'cms' && <CmsTab brand={brand} onBrandUpdate={setBrand} />}
          {activeTab === 'products' && <ProductsTab brand={brand} />}
          {activeTab === 'offers' && <OffersTab brand={brand} />}
          {activeTab === 'codes' && <CodesTab brand={brand} />}
          {activeTab === 'settings' && <SettingsTab brand={brand} onBrandUpdate={setBrand} />}
        </div>
      </main>

      <style>{`
        .glass-panel {
          background-color: rgba(23, 23, 23, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .neon-shadow {
          box-shadow: 0 0 20px rgba(255, 0, 85, 0.4);
        }
        .text-glow { 
          text-shadow: 0 0 10px rgba(255, 0, 85, 0.5); 
        }
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

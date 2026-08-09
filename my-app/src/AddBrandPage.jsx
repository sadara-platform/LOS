import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Icons (using simple SVGs to avoid dependency issues, or you can import from lucide-react if installed)
const CheckCircleIcon = () => (
  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LoaderIcon = () => (
  <svg className="animate-spin w-5 h-5 mr-2 text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

export default function AddBrandPage() {
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    phoneNumber: '',
    logoUrl: '',
    themeColor: '#8b5cf6',
    secondaryColor: '#ffffff',
    accentColor: '#1e1e1e',
    bgColor: '#0A0A0A',
    surfaceColor: '#141414',
    textPrimary: '#FFFFFF',
    textSecondary: '#71717A',
    themeMode: 'dark',
    codeAllocation: 100,
    ownerEmail: '',
    ownerPassword: ''
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Auto-generate slug from name if user hasn't explicitly typed one
  const handleNameChange = (e) => {
    const newName = e.target.value;
    setFormData(prev => ({
      ...prev,
      name: newName,
      // Simple slugification: lowercase, replace spaces with hyphens, remove non-alphanumeric
      slug: newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAnalyzeLogo = async () => {
    if (!formData.logoUrl) {
      setToastMessage("Error: Please provide a Logo URL or Base64 string first.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }
    setIsAnalyzing(true);
    setToastMessage(null);
    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const response = await fetch(`${supabaseUrl}/functions/v1/analyze-logo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoUrl: formData.logoUrl })
      });
      if (!response.ok) {
        throw new Error("Failed to analyze logo");
      }
      const data = await response.json();
      setFormData(prev => ({
        ...prev,
        themeColor: data.primary_color || prev.themeColor,
        secondaryColor: data.secondary_color || prev.secondaryColor,
        accentColor: data.accent_color || prev.accentColor,
        bgColor: data.bg_color || prev.bgColor,
        surfaceColor: data.surface_color || prev.surfaceColor,
        textPrimary: data.text_primary || prev.textPrimary,
        textSecondary: data.text_secondary || prev.textSecondary,
        themeMode: data.theme_mode || prev.themeMode
      }));
      setToastMessage("Success: AI Analysis Complete!");
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
      setToastMessage("Error: AI Analysis failed.");
      setTimeout(() => setToastMessage(null), 4000);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      let newOwnerId = null;

      // 1. Create Auth User if credentials are provided
      if (formData.ownerEmail && formData.ownerPassword) {
        // Create a temporary Supabase client with persistSession: false
        // This ensures the current Admin is NOT logged out when the new user is created
        const tempSupabase = createClient(supabaseUrl, supabaseKey, {
          auth: { persistSession: false, autoRefreshToken: false }
        });
        
        const { data: authData, error: authError } = await tempSupabase.auth.signUp({
          email: formData.ownerEmail,
          password: formData.ownerPassword
        });

        if (authError) {
          throw new Error(`Auth Error: ${authError.message}`);
        }
        
        if (authData?.user) {
          newOwnerId = authData.user.id;
        } else {
          // If no error but no user, usually means email confirmation is required and blocked it.
          console.warn("User created, but ID not returned. Check if 'Confirm Email' is enabled in Supabase.");
        }
      }

      // 2. Insert into Brands table
      const payload = {
        name: formData.name,
        slug: formData.slug,
        phone_number: formData.phoneNumber,
        logo_url: formData.logoUrl,
        primary_color: formData.themeColor,
        secondary_color: formData.secondaryColor,
        accent_color: formData.accentColor,
        bg_color: formData.bgColor,
        surface_color: formData.surfaceColor,
        text_primary: formData.textPrimary,
        text_secondary: formData.textSecondary,
        theme_mode: formData.themeMode,
        owner_id: newOwnerId // Assign the newly created user as the owner
      };

      const response = await fetch(`${supabaseUrl}/rest/v1/brands`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to register brand. Slug might be taken.');
      }

      setToastMessage(`Success: Brand "${formData.name}" added successfully!`);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => setToastMessage(null), 4000);
      
      setFormData({
        name: '',
        slug: '',
        phoneNumber: '',
        logoUrl: '',
        themeColor: '#8b5cf6',
        secondaryColor: '#ffffff',
        accentColor: '#1e1e1e',
        bgColor: '#0A0A0A',
        surfaceColor: '#141414',
        textPrimary: '#FFFFFF',
        textSecondary: '#71717A',
        themeMode: 'dark',
        codeAllocation: 100,
        ownerEmail: '',
        ownerPassword: ''
      });
    } catch (err) {
      console.error('API Error:', err);
      setToastMessage(`Error: ${err.message}`);
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans p-6 md:p-12 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 relative z-10">
        <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-2">LOS Admin Panel</h2>
        <h1 className="text-4xl md:text-5xl font-black text-white">Add New Brand</h1>
        <p className="text-gray-400 mt-3">Register a new partner brand, generate their access portal, and initialize codes.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
        
        {/* LEFT COLUMN: FORM */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)] h-fit max-h-[80vh] overflow-y-auto custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-4">1. Brand Identity</h3>
            
            {/* Brand Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Brand Name</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleNameChange}
                required
                placeholder="e.g. Burger X"
                className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Brand Slug */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">URL Slug</label>
              <div className="flex items-center">
                <span className="bg-white/10 border border-white/20 border-r-0 rounded-l-xl p-4 text-gray-500 font-mono text-sm">
                  los.com/
                </span>
                <input 
                  type="text" 
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  required
                  placeholder="burger-x"
                  className="w-full bg-black/50 border border-white/20 rounded-r-xl p-4 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            {/* Brand Phone Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Brand Phone Number</label>
              <input 
                type="tel" 
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="e.g. 05XXXXXXXX"
                className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>

            {/* Brand Logo URL */}
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Brand Logo URL (or Base64)</label>
              <div className="flex items-center gap-2">
                <input 
                  type="text" 
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={handleAnalyzeLogo}
                  disabled={isAnalyzing || !formData.logoUrl}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white p-4 rounded-xl font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[160px]"
                >
                  {isAnalyzing ? <LoaderIcon /> : '✨ AI Analyze'}
                </button>
              </div>
            </div>

            {/* Theming Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 border-b border-white/10 pb-2">Structural Colors</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Background</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="bgColor" value={formData.bgColor} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.bgColor}</span></div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Surface (Cards)</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="surfaceColor" value={formData.surfaceColor} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.surfaceColor}</span></div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Primary</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="textPrimary" value={formData.textPrimary} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.textPrimary}</span></div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Text Secondary</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="textSecondary" value={formData.textSecondary} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.textSecondary}</span></div>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-gray-300 border-b border-white/10 pb-2 mt-4">Accent Colors</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Primary Accent</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="themeColor" value={formData.themeColor} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.themeColor}</span></div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Secondary Accent</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="secondaryColor" value={formData.secondaryColor} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.secondaryColor}</span></div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Highlight Accent</label>
                  <div className="flex items-center gap-2 bg-black/50 border border-white/20 rounded-xl p-2"><input type="color" name="accentColor" value={formData.accentColor} onChange={handleChange} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent p-0" /><span className="font-mono text-gray-300 uppercase text-[10px]">{formData.accentColor}</span></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-white/10">
              {/* Theme Mode */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Theme Mode</label>
                <select
                  name="themeMode"
                  value={formData.themeMode}
                  onChange={handleChange}
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                >
                  <option value="dark">Dark Theme</option>
                  <option value="light">Light Theme</option>
                </select>
              </div>
              
              {/* Code Allocation */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Initial Code Allocation</label>
                <input 
                  type="number" 
                  name="codeAllocation"
                  value={formData.codeAllocation}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white font-mono placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <h3 className="text-xl font-bold border-b border-white/10 pb-2 mt-8 mb-4">2. Brand Owner Access</h3>
            <p className="text-xs text-blue-400 mb-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              Provide an email and password to automatically create a Supabase Auth user for this brand owner. They will use these to log into /brand-dashboard.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Owner Email</label>
                <input 
                  type="email" 
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  required
                  placeholder="owner@brand.com"
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>

              {/* Owner Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Owner Password</label>
                <input 
                  type="text" 
                  name="ownerPassword"
                  value={formData.ownerPassword}
                  onChange={handleChange}
                  required
                  placeholder="SecurePass123!"
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-8">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center p-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.4)]
                  ${isSubmitting ? 'bg-indigo-600/70 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] hover:-translate-y-1'}
                `}
              >
                {isSubmitting ? (
                  <>
                    <LoaderIcon /> Processing...
                  </>
                ) : (
                  'Register Brand & Generate Access'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="flex flex-col">
          <h3 className="text-gray-400 font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: formData.themeColor }}></span>
            Live Portal Preview
          </h3>
          
          <div 
            className="flex-1 rounded-3xl p-1 relative overflow-hidden transition-all duration-500"
            style={{ 
              background: `linear-gradient(135deg, rgba(255,255,255,0.05) 0%, ${formData.themeColor}30 100%)`,
              boxShadow: `0 0 40px ${formData.themeColor}40`
            }}
          >
            {/* The inner mock app screen */}
            <div className="h-full w-full bg-[#050505] rounded-[22px] border border-white/5 p-8 flex flex-col items-center justify-center text-center relative z-10 overflow-hidden">
              
              {/* Fake UI Header */}
              <div className="absolute top-0 w-full h-1" style={{ backgroundColor: formData.themeColor }}></div>

              <div 
                className="w-24 h-24 rounded-2xl mb-6 flex items-center justify-center shadow-2xl transition-all duration-300"
                style={{ 
                  backgroundColor: formData.logoUrl ? 'transparent' : 'rgba(255,255,255,0.05)',
                  boxShadow: `0 0 25px ${formData.themeColor}60`
                }}
              >
                {formData.logoUrl ? (
                  <img src={formData.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-2xl" />
                ) : (
                  <span className="text-4xl font-black" style={{ color: formData.themeColor }}>
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
              </div>

              <h2 className="text-3xl font-black mb-2">{formData.name || 'Brand Name'}</h2>
              <p className="text-gray-500 mb-8 max-w-xs">Scan the QR code on your receipt to collect points and win rewards!</p>
              
              <div 
                className="w-full max-w-[250px] py-4 rounded-xl font-bold text-black transition-colors duration-300"
                style={{ backgroundColor: formData.themeColor }}
              >
                Claim Reward
              </div>
              
              {/* Fake UI elements */}
              <div className="mt-8 flex gap-4">
                <div className="w-16 h-2 rounded-full bg-white/10"></div>
                <div className="w-8 h-2 rounded-full" style={{ backgroundColor: formData.themeColor }}></div>
                <div className="w-16 h-2 rounded-full bg-white/10"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST NOTIFICATION */}
      <div 
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] transition-all duration-500 z-50
          ${toastMessage ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}
        `}
      >
        <CheckCircleIcon />
        <span className="font-medium">{toastMessage}</span>
      </div>
      
      {/* ADD STYLES FOR CUSTOM SCROLLBAR IN LEFT PANEL */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background-color: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

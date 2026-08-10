import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { LayoutTemplate, CheckCircle2, AlertCircle } from 'lucide-react';

const defaultCmsConfig = {
  topBarMsg: "FOR DEDICATED REBELS // SECURE GLOBAL EXPRESS SHIPPING",
  heroBg1: "STRETEAT",
  heroBg2: "SELVING",
  heroLabel: "NEW EXPANSION 03.1",
  heroTitle1: "STRETEAT",
  heroTitle2: "SELVING",
  heroSubtitle: "The boundaries of modern streetwear are pure attitude, industrial geometry, and high-performance utility. Discover our new capsule release crafted with heavy fabrics and modular detailing.",
  midBg: "SOEFGN",
  midTitle: "SOEFGN CAPSULE",
  midSubtitle: "High-contrast silhouettes designed to command presence. Engineered with layered weather shields and modular fasteners.",
  colLabel: "CATEGORIZED SYSTEM",
  colTitle: "COLLECTIONS",
  aiLabel: "LOS CREATIVE ENGINE",
  aiTitle: "KATT-AI STYLING ADVISOR",
  aiSubtitle: "Describe your environment, sizing preference, or outfit concept. Our Gemini-powered stylist will compile an elite urban-grunge layering prescription."
};

export default function CmsTab({ brand, onBrandUpdate }) {
  const initialConfig = brand.cms_config && Object.keys(brand.cms_config).length > 0 
    ? { ...defaultCmsConfig, ...brand.cms_config } 
    : defaultCmsConfig;

  const [cmsConfig, setCmsConfig] = useState(initialConfig);
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  const handleChange = (key, value) => {
    setCmsConfig(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: 'loading', message: 'Saving content...' });
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .update({ cms_config: cmsConfig })
        .eq('id', brand.id)
        .select()
        .single();

      if (error) throw error;
      
      setUpdateStatus({ type: 'success', message: 'Website content updated live!' });
      setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
      
      if (onBrandUpdate && data) {
        onBrandUpdate(data);
      }
    } catch (error) {
      setUpdateStatus({ type: 'error', message: error.message });
    }
  };

  const InputField = ({ label, configKey, isTextArea = false }) => (
    <div className="flex flex-col gap-2 mb-8">
      <label className="font-code-sm text-code-sm text-primary flex items-center gap-2 opacity-80 uppercase tracking-widest">
        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>keyboard_arrow_right</span>
        {label}_
      </label>
      {isTextArea ? (
        <textarea 
          value={cmsConfig[configKey]}
          onChange={e => handleChange(configKey, e.target.value)}
          className="terminal-input w-full font-code-sm text-code-sm p-4 resize-none transition-all duration-300 focus:bg-white/5 rounded-t-lg bg-[#0A0A0A] border-0 border-b-2 border-primary/50 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0 h-32"
          placeholder="Enter configuration string..."
        />
      ) : (
        <input 
          type="text" 
          value={cmsConfig[configKey]}
          onChange={e => handleChange(configKey, e.target.value)}
          className="terminal-input w-full font-code-sm text-code-sm p-4 transition-all duration-300 focus:bg-white/5 rounded-t-lg bg-[#0A0A0A] border-0 border-b-2 border-primary/50 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0"
          placeholder="Enter configuration string..."
        />
      )}
    </div>
  );

  return (
    <div className="flex-1 flex flex-col relative animate-in fade-in zoom-in duration-500 w-full pt-12">
      {/* Header */}
      <header className="mb-[80px]">
        <h2 className="font-headline-lg-mobile md:font-display-xl text-headline-lg-mobile md:text-display-xl text-on-surface uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">CONTENT_MANAGEMENT_SYSTEM</h2>
        <div className="h-1 w-24 bg-primary mt-6 shadow-[0_0_10px_rgba(255,0,85,0.6)]"></div>
        <p className="mt-6 text-code-sm font-code-sm text-zinc-400 uppercase tracking-widest border border-white/10 bg-white/5 p-3 rounded max-w-xl flex items-center gap-2">
           <AlertCircle className="w-4 h-4 text-primary" /> LIVE PREVIEW MODE. CHANGES SYNC INSTANTLY TO YOUR STOREFRONT.
        </p>
      </header>
      
      {/* CMS Form Container */}
      <div className="max-w-4xl w-full">
        <form onSubmit={handleSave}>
          <div className="glass-card rounded-xl p-8 md:p-12 relative overflow-hidden group bg-[#141414]/90 backdrop-blur-xl border border-white/10">
            {/* Subtle background ambient glow inside card */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
            
            <div className="relative z-10 flex flex-col gap-4">
              <h3 className="font-title-md text-white border-b border-white/10 pb-4 mb-4 uppercase tracking-widest">&gt; TOP_BAR_&amp;_HERO</h3>
              <InputField label="TOP_BAR_MSG" configKey="topBarMsg" />
              <InputField label="HERO_LABEL" configKey="heroLabel" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="HERO_TITLE_L1" configKey="heroTitle1" />
                <InputField label="HERO_TITLE_L2" configKey="heroTitle2" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField label="BG_TEXT_1" configKey="heroBg1" />
                <InputField label="BG_TEXT_2" configKey="heroBg2" />
              </div>
              <InputField label="HERO_SUBTITLE" configKey="heroSubtitle" isTextArea={true} />
              
              <h3 className="font-title-md text-white border-b border-white/10 pb-4 mt-8 mb-4 uppercase tracking-widest">&gt; MID_SECTION_&amp;_COLLECTIONS</h3>
              <InputField label="MID_SECTION_BG_TEXT" configKey="midBg" />
              <InputField label="MID_SECTION_TITLE" configKey="midTitle" />
              <InputField label="MID_SECTION_SUBTITLE" configKey="midSubtitle" isTextArea={true} />
              <InputField label="COLLECTIONS_LABEL" configKey="colLabel" />
              <InputField label="COLLECTIONS_TITLE" configKey="colTitle" />

              <h3 className="font-title-md text-white border-b border-white/10 pb-4 mt-8 mb-4 uppercase tracking-widest">&gt; AI_STYLIST_ENGINE</h3>
              <InputField label="AI_ENGINE_LABEL" configKey="aiLabel" />
              <InputField label="AI_ENGINE_TITLE" configKey="aiTitle" />
              <InputField label="AI_ENGINE_DESCRIPTION" configKey="aiSubtitle" isTextArea={true} />
            </div>
          </div>
          
          {/* Action Area */}
          <div className="mt-[80px] flex justify-end items-center gap-6 pb-24">
            {updateStatus.message && (
              <span className={`font-code-sm text-code-sm tracking-widest uppercase flex items-center gap-2 ${updateStatus.type === 'success' ? 'text-green-400' : updateStatus.type === 'error' ? 'text-error' : 'text-zinc-400'}`}>
                {updateStatus.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {updateStatus.message}
              </span>
            )}
            <button 
              type="submit" 
              disabled={updateStatus.type === 'loading'}
              className="bg-primary text-white font-headline-lg-mobile text-[24px] md:text-[32px] rounded-DEFAULT px-8 py-4 group relative overflow-hidden transition-all duration-300 disabled:opacity-50"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
              <span className="relative z-10 flex items-center gap-3">
                PUBLISH_CHANGES
                <span className="material-symbols-outlined font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>upload</span>
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
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
  // Initialize with brand.cms_config or default values
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
    <div className="mb-4">
      <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">{label}</label>
      {isTextArea ? (
        <textarea 
          value={cmsConfig[configKey]}
          onChange={e => handleChange(configKey, e.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-colors resize-none h-20"
        />
      ) : (
        <input 
          type="text" 
          value={cmsConfig[configKey]}
          onChange={e => handleChange(configKey, e.target.value)}
          className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-red transition-colors"
        />
      )}
    </div>
  );

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4" />
          Website Content Manager
        </h2>
        
        <div className="flex items-center gap-4">
          {updateStatus.message && (
            <span className={`text-xs font-bold tracking-widest uppercase flex items-center gap-1 ${updateStatus.type === 'success' ? 'text-green-400' : updateStatus.type === 'error' ? 'text-red-400' : 'text-zinc-400'}`}>
              {updateStatus.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
              {updateStatus.message}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={updateStatus.type === 'loading'}
            className="bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase px-6 py-2.5 rounded-lg transition-colors text-xs disabled:opacity-50"
          >
            Save Changes
          </button>
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg flex items-start gap-3 mb-8">
        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div className="text-xs text-red-200/70 leading-relaxed">
          <strong>Live Preview Mode.</strong> Changes saved here will instantly reflect on your public Brand Activation Page.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Top & Hero Section */}
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-6 pb-2 border-b border-white/10">Top Bar & Hero Section</h3>
          
          <InputField label="Top Bar Announcement" configKey="topBarMsg" />
          <InputField label="Hero Label (Tiny Pill)" configKey="heroLabel" />
          
          <div className="flex gap-4">
            <div className="flex-1"><InputField label="Hero Title Line 1" configKey="heroTitle1" /></div>
            <div className="flex-1"><InputField label="Hero Title Line 2" configKey="heroTitle2" /></div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1"><InputField label="Background Text 1" configKey="heroBg1" /></div>
            <div className="flex-1"><InputField label="Background Text 2" configKey="heroBg2" /></div>
          </div>
          
          <InputField label="Hero Subtitle / Description" configKey="heroSubtitle" isTextArea={true} />
        </div>

        {/* Mid Section & Collections */}
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-6 pb-2 border-b border-white/10">Mid Section & Collections</h3>
          
          <InputField label="Mid Section Background Text" configKey="midBg" />
          <InputField label="Mid Section Title" configKey="midTitle" />
          <InputField label="Mid Section Subtitle" configKey="midSubtitle" isTextArea={true} />
          
          <div className="mt-8 mb-6 pb-2 border-b border-white/10 text-xs font-bold tracking-widest uppercase text-white">Collections Area</div>
          <InputField label="Collections Small Label" configKey="colLabel" />
          <InputField label="Collections Main Title" configKey="colTitle" />
        </div>

        {/* AI Stylist Section */}
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl lg:col-span-2">
          <h3 className="text-xs font-bold tracking-widest uppercase text-white mb-6 pb-2 border-b border-white/10">AI Stylist Engine Section</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
            <div>
              <InputField label="Stylist Engine Label" configKey="aiLabel" />
              <InputField label="Stylist Engine Main Title" configKey="aiTitle" />
            </div>
            <div>
              <InputField label="Stylist Instructions / Description" configKey="aiSubtitle" isTextArea={true} />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

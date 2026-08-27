import React, { useState } from 'react';
import { supabase } from '../../../SupabaseClient';
import { Settings, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function SettingsTab({ brand, onBrandUpdate }) {
  const [description, setDescription] = useState(brand.description || '');
  const [phoneNumber, setPhoneNumber] = useState(brand.phone_number || '');
  const [updateStatus, setUpdateStatus] = useState({ type: '', message: '' });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateStatus({ type: 'loading', message: 'Updating...' });
    
    try {
      const { data, error } = await supabase
        .from('brands')
        .update({ description, phone_number: phoneNumber })
        .eq('id', brand.id)
        .select()
        .single();

      if (error) throw error;
      
      setUpdateStatus({ type: 'success', message: 'Profile updated successfully!' });
      setTimeout(() => setUpdateStatus({ type: '', message: '' }), 3000);
      
      if (onBrandUpdate && data) {
        onBrandUpdate(data);
      }
    } catch (error) {
      setUpdateStatus({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="flex-1 flex flex-col relative animate-in fade-in zoom-in duration-500 w-full pt-12 items-center">
      {/* Decorative Background Element */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-20">
        <div className="w-[800px] h-[800px] rounded-full bg-primary blur-[150px] mix-blend-screen opacity-10 translate-y-1/4"></div>
      </div>
      
      <div className="w-full max-w-3xl glass-panel rounded-xl p-8 md:p-12 z-10 transition-all duration-500 hover:bg-white/5 border border-white/10 bg-[#141414]/90 backdrop-blur-xl">
        <div className="mb-10 text-center">
          <h1 className="font-display-xl text-[32px] md:text-[48px] font-black text-on-surface tracking-tighter uppercase mb-2">BRAND_PROFILE_V2</h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_15px_rgba(255,0,85,0.8)]"></div>
          <p className="mt-6 text-code-sm font-code-sm text-error/80 uppercase tracking-widest border border-error/20 bg-error/5 p-2 rounded max-w-md mx-auto flex items-center justify-center gap-2">
             <AlertCircle className="w-4 h-4" /> [RESTRICTED: Visual Identity Locked]
          </p>
        </div>

        <form onSubmit={handleUpdateProfile} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label className="font-code-sm text-code-sm text-primary flex items-center gap-2 opacity-80 uppercase tracking-widest" htmlFor="brandDesc">
              <span className="text-on-surface-variant/50 font-bold">01</span> &gt; BRAND_DESCRIPTION_
            </label>
            <textarea 
              id="brandDesc" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="terminal-input w-full font-code-sm text-code-sm p-4 resize-none transition-all duration-300 focus:bg-white/5 rounded-t-lg bg-[#0A0A0A] border-0 border-b-2 border-primary/50 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0" 
              placeholder="Enter system configuration parameters..." 
              rows="5"
            ></textarea>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="font-code-sm text-code-sm text-primary flex items-center gap-2 opacity-80 uppercase tracking-widest" htmlFor="contactPhone">
              <span className="text-on-surface-variant/50 font-bold">02</span> &gt; COMM_LINK_
            </label>
            <input 
              id="contactPhone" 
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              className="terminal-input w-full font-code-sm text-code-sm p-4 transition-all duration-300 focus:bg-white/5 rounded-t-lg bg-[#0A0A0A] border-0 border-b-2 border-primary/50 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-0" 
              placeholder="+1 (000) 000-0000" 
            />
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            {updateStatus.message && (
              <span className={`font-code-sm text-code-sm tracking-widest uppercase flex items-center gap-2 ${updateStatus.type === 'success' ? 'text-green-400' : updateStatus.type === 'error' ? 'text-error' : 'text-zinc-400'}`}>
                {updateStatus.type === 'success' && <CheckCircle2 className="w-4 h-4" />}
                {updateStatus.message}
              </span>
            )}
            
            <button 
              type="submit" 
              disabled={updateStatus.type === 'loading'}
              className="bg-primary text-white font-headline-lg text-[20px] md:text-[24px] uppercase tracking-wider py-[20px] px-[60px] rounded-DEFAULT neon-shadow neon-shadow-hover transition-all duration-300 font-bold active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:active:scale-100"
            >
              SAVE_CHANGES <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { supabase } from './SupabaseClient';
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
    <section>
      <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
        <Settings className="w-4 h-4" />
        Basic Profile Settings
      </h2>
      <form onSubmit={handleUpdateProfile} className="bg-[#141414] border border-white/5 p-6 md:p-8 rounded-2xl space-y-6 max-w-2xl">
        
        <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-lg flex items-start gap-3 mb-6">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="text-xs text-red-200/70 leading-relaxed">
            <strong>Restricted Area.</strong> Visual identity (colors, logo, slug) is locked by the Admin to preserve platform aesthetics. You may only update textual descriptions and contact links.
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

        <div className="pt-4 flex items-center justify-between border-t border-white/5 mt-4">
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
  );
}

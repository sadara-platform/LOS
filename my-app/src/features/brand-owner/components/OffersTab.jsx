import React, { useState, useEffect } from 'react';
import { supabase } from '../../../SupabaseClient';
import { Ticket, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function OffersTab({ brand }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newOffer, setNewOffer] = useState({ title: '', description: '', discount_code: '', discount_amount: '', status: 'active' });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchOffers();
  }, [brand]);

  async function fetchOffers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setOffers(data || []);
    } catch (err) {
      console.error("Error fetching offers:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const { data, error } = await supabase.from('offers').insert([{
        brand_id: brand.id,
        title: newOffer.title,
        description: newOffer.description,
        discount_code: newOffer.discount_code,
        discount_amount: newOffer.discount_amount,
        status: newOffer.status
      }]).select();

      if (error) throw error;
      
      setOffers([data[0], ...offers]);
      setIsAdding(false);
      setNewOffer({ title: '', description: '', discount_code: '', discount_amount: '', status: 'active' });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleToggleStatus = async (offerId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    try {
      const { error } = await supabase
        .from('offers')
        .update({ status: newStatus })
        .eq('id', offerId)
        .eq('brand_id', brand.id); // Extra safety, though RLS handles it
        
      if (error) throw error;
      
      setOffers(offers.map(o => o.id === offerId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Error updating offer:", err);
    }
  };

  const handleDelete = async (offerId) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const { error } = await supabase
        .from('offers')
        .delete()
        .eq('id', offerId)
        .eq('brand_id', brand.id);
        
      if (error) throw error;
      
      setOffers(offers.filter(o => o.id !== offerId));
    } catch (err) {
      console.error("Error deleting offer:", err);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 text-sm italic p-8">Loading offers...</div>;
  }

  return (
    <div className="flex flex-col relative h-full overflow-y-auto animate-in fade-in zoom-in duration-500">
      <div className="max-w-[1200px] w-full mx-auto pb-24 flex flex-col gap-16">
        
        {/* 1. Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 relative">
          <div className="relative z-10">
            <p className="font-code-sm text-code-sm text-primary mb-2 opacity-70">&gt; SYS_COM // DASHBOARD // OFFERS</p>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-surface uppercase tracking-tighter drop-shadow-lg">
              ACTIVE_OFFERS_<br/>MANAGEMENT
            </h1>
          </div>
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="group relative inline-flex items-center justify-center bg-[#FF0055] text-white font-code-sm text-code-sm uppercase px-8 py-5 tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 neon-shadow border border-white/20"
          >
            <span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
            <span className="relative z-10 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isAdding ? 'close' : 'add'}
              </span>
              {isAdding ? 'CANCEL_OPERATION' : 'CREATE_NEW_OFFER'}
            </span>
          </button>
        </header>

        {/* 2. Create Offer Form (Terminal Style) */}
        {isAdding && (
          <section className="relative group animate-in slide-in-from-top-4">
            {/* Glass Frame */}
            <div className="absolute inset-0 bg-[#141414]/90 backdrop-blur-xl border border-primary/20 rounded-lg pointer-events-none transition-colors duration-500 group-hover:border-primary/40"></div>
            <div className="relative z-10 p-8 md:p-12 flex flex-col gap-10">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>terminal</span>
                <h3 className="font-code-sm text-code-sm text-primary tracking-widest uppercase">Input Sequence Required</h3>
              </div>
              
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateOffer} className="flex flex-col gap-8 w-full max-w-2xl font-code-sm text-code-sm">
                
                {/* Field: Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant flex items-center gap-2">
                    <span className="text-primary">&gt;</span> OFFER_TITLE_
                  </label>
                  <input 
                    required
                    value={newOffer.title}
                    onChange={e => setNewOffer({...newOffer, title: e.target.value})}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white focus:ring-0 focus:border-primary py-3 px-0 w-full placeholder:text-zinc-600 transition-colors" 
                    placeholder="ENTER ALPHANUMERIC DESIGNATION..." 
                    type="text"
                  />
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Field: Discount Code */}
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-on-surface-variant flex items-center gap-2">
                      <span className="text-primary">&gt;</span> PROMO_CODE_
                    </label>
                    <input 
                      value={newOffer.discount_code}
                      onChange={e => setNewOffer({...newOffer, discount_code: e.target.value})}
                      className="bg-transparent border-0 border-b-2 border-white/20 text-white focus:ring-0 focus:border-primary py-3 px-0 w-full placeholder:text-zinc-600 transition-colors uppercase" 
                      placeholder="e.g. SUMMER20 (Optional)" 
                      type="text"
                    />
                  </div>

                  {/* Field: Discount Amount */}
                  <div className="flex flex-col gap-2 flex-1">
                    <label className="text-on-surface-variant flex items-center gap-2">
                      <span className="text-primary">&gt;</span> DISCOUNT_VALUE_
                    </label>
                    <input 
                      required
                      value={newOffer.discount_amount}
                      onChange={e => setNewOffer({...newOffer, discount_amount: e.target.value})}
                      className="bg-transparent border-0 border-b-2 border-white/20 text-white focus:ring-0 focus:border-primary py-3 px-0 w-full placeholder:text-zinc-600 transition-colors" 
                      placeholder="e.g. 20% OFF or $10" 
                      type="text"
                    />
                  </div>
                </div>

                {/* Field: Description */}
                <div className="flex flex-col gap-2">
                  <label className="text-on-surface-variant flex items-center gap-2">
                    <span className="text-primary">&gt;</span> DESCRIPTION_DATA_
                  </label>
                  <textarea 
                    required
                    value={newOffer.description}
                    onChange={e => setNewOffer({...newOffer, description: e.target.value})}
                    className="bg-transparent border-0 border-b-2 border-white/20 text-white focus:ring-0 focus:border-primary py-3 px-0 w-full placeholder:text-zinc-600 transition-colors resize-none h-24" 
                    placeholder="ENTER OFFER DETAILS..."
                  />
                </div>

                {/* Form CTA */}
                <div className="mt-4 flex justify-end">
                  <button type="submit" className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 hover:bg-white/10 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                    <span className="font-code-sm text-code-sm uppercase tracking-widest text-white group-hover:text-primary transition-colors">INITIALIZE_OFFER_PROTOCOL</span>
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* 3. Offers Data Table */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="font-code-sm text-code-sm text-primary tracking-widest uppercase flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dataset</span>
              DATABASE_QUERY_RESULTS
            </h3>
            <span className="text-on-surface-variant text-xs opacity-60">Showing {offers.length} entries</span>
          </div>
          
          <div className="w-full flex flex-col gap-4 font-code-sm text-[13px]">
            {/* Header Row */}
            <div className="grid grid-cols-8 gap-4 px-6 py-3 text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-2">
              <div className="col-span-2">OFFER_TITLE</div>
              <div className="col-span-2">DESCRIPTION</div>
              <div className="col-span-2">VALUE / CODE</div>
              <div className="col-span-2 text-right">STATUS/ACT</div>
            </div>
            
            {/* Data Rows */}
            {offers.length === 0 ? (
              <div className="text-center p-8 text-zinc-600 italic border-2 border-dashed border-white/5 rounded">NO RECORDS FOUND</div>
            ) : (
              offers.map((offer, index) => (
                <div key={offer.id} className={`grid grid-cols-8 gap-4 items-center px-6 py-5 ${offer.status === 'active' ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-70'} backdrop-blur-md border rounded transition-all duration-300 hover:-translate-y-2 hover:backdrop-blur-xl hover:bg-white/10 hover:border-primary/30 group`}>
                  <div className="col-span-2 text-primary truncate font-bold">{offer.title}</div>
                  <div className="col-span-2 text-on-surface truncate pr-4 opacity-80">{offer.description}</div>
                  <div className="col-span-2 flex flex-col">
                    <span className="text-white font-bold">{offer.discount_amount || 'N/A'}</span>
                    {offer.discount_code && <span className="text-zinc-500 text-[10px] uppercase">Code: {offer.discount_code}</span>}
                  </div>
                  
                  <div className="col-span-2 flex justify-end items-center gap-4">
                    <button 
                      onClick={() => handleToggleStatus(offer.id, offer.status)}
                      className={`border px-2 py-1 text-[10px] tracking-widest uppercase transition-colors ${offer.status === 'active' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_10px_rgba(34,211,238,0.2)] hover:bg-cyan-400/30' : 'border-zinc-500 text-zinc-500 bg-black hover:bg-zinc-800'}`}
                    >
                      {offer.status === 'active' ? 'LIVE' : 'PAUSED'}
                    </button>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleDelete(offer.id)} className="text-on-surface-variant hover:text-primary transition-colors">
                        <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

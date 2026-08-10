import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { Ticket, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function OffersTab({ brand }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newOffer, setNewOffer] = useState({ title: '', description: '', status: 'active' });
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
        status: newOffer.status
      }]).select();

      if (error) throw error;
      
      setOffers([data[0], ...offers]);
      setIsAdding(false);
      setNewOffer({ title: '', description: '', status: 'active' });
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
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <Ticket className="w-4 h-4" />
          Manage Offers
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-white hover:bg-zinc-200 text-black px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> New Offer</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateOffer} className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold tracking-widest uppercase text-xs text-white mb-2">Create New Offer</h3>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Offer Title</label>
            <input 
              type="text" 
              required
              value={newOffer.title}
              onChange={e => setNewOffer({...newOffer, title: e.target.value})}
              placeholder="e.g. 50% Off Next Order"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold tracking-widest text-zinc-400 uppercase mb-2">Description</label>
            <textarea 
              value={newOffer.description}
              onChange={e => setNewOffer({...newOffer, description: e.target.value})}
              placeholder="Provide details about the offer..."
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors h-24 resize-none"
            />
          </div>
          
          <button type="submit" className="bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-colors text-xs w-full">
            Save Offer
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {offers.length === 0 ? (
          <div className="col-span-full bg-[#141414] border border-white/5 rounded-2xl p-8 text-center text-zinc-600 text-sm italic">
            No offers created yet.
          </div>
        ) : (
          offers.map(offer => (
            <div key={offer.id} className="bg-[#141414] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg leading-tight">{offer.title}</h3>
                  <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase shrink-0 ${offer.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-500'}`}>
                    {offer.status}
                  </span>
                </div>
                <p className="text-zinc-500 text-sm mb-6">{offer.description}</p>
              </div>
              
              <div className="flex gap-2 border-t border-white/5 pt-4 mt-auto">
                <button 
                  onClick={() => handleToggleStatus(offer.id, offer.status)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold tracking-widest uppercase py-2 rounded transition-colors"
                >
                  {offer.status === 'active' ? 'Pause' : 'Activate'}
                </button>
                <button 
                  onClick={() => handleDelete(offer.id)}
                  className="bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-2 rounded transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

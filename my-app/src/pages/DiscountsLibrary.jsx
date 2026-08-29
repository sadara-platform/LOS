import React, { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { supabase } from '../SupabaseClient';
import { Ticket, Search, CheckCircle, Store, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DiscountsLibrary() {
  const { session } = useOutletContext();
  const [offers, setOffers] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeQR, setActiveQR] = useState(null);

  useEffect(() => {
    if (!session?.user?.id) return;
    const userId = session.user.id;

    const fetchData = async () => {
      try {
        // 1. Fetch all active offers from 'offers'
        const { data: allOffersData } = await supabase
          .from('offers')
          .select('*')
          .eq('status', 'active')
          .order('created_at', { ascending: false });

        if (allOffersData) {
          // 2. Fetch user's redemptions
          const { data: redemptionsData } = await supabase
            .from('offer_redemptions')
            .select('*')
            .eq('user_id', userId);

          const redemptionsMap = {};
          if (redemptionsData) {
            redemptionsData.forEach(r => {
              redemptionsMap[r.offer_id] = r;
            });
          }

          // 3. Fetch brands manually to attach to offers
          const brandIds = [...new Set(allOffersData.map(o => o.brand_id).filter(Boolean))];
          
          let fetchedBrands = [];
          if (brandIds.length > 0) {
            const { data: brandsData } = await supabase
              .from('brands')
              .select('*')
              .in('id', brandIds);
            fetchedBrands = brandsData || [];
          }

          const combinedOffers = allOffersData.map(offer => {
            const redemption = redemptionsMap[offer.id];
            return {
              id: offer.id, // Offer ID
              redemption_id: redemption?.id,
              status: redemption?.status || 'unlocked',
              offers: offer,
              brand: fetchedBrands.find(b => b.id === offer.brand_id)
            };
          });

          setOffers(combinedOffers);
        }

        // Fetch All Brands for LOS Network
        const { data: allBrands } = await supabase
          .from('brands')
          .select('*')
          .order('name');
        
        if (allBrands) setBrands(allBrands);

      } catch (err) {
        console.error("Error fetching discounts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session]);

  // Realtime Listener for Offer Redemptions
  useEffect(() => {
    if (!session?.user?.id) return;
    
    const channel = supabase.channel('redemptions-changes')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'offer_redemptions',
        filter: `user_id=eq.${session.user.id}`
      }, (payload) => {
        const updatedRedemption = payload.new;
        if (updatedRedemption.status === 'used') {
          // Update the offers state
          setOffers(prev => prev.map(o => 
            o.id === updatedRedemption.offer_id 
              ? { ...o, status: 'used' } 
              : o
          ));
          
          // If this is the active QR, close it
          setActiveQR(current => {
            if (current && current.redemptionId === updatedRedemption.id) {
              return null; // Close modal
            }
            return current;
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session]);

  const handleUseOffer = async (offerId) => {
    try {
      const offer = offers.find(o => o.id === offerId);
      if (offer.status === 'pending' && offer.redemption_id) {
        // Already pending, just show QR
        setActiveQR({ redemptionId: offer.redemption_id, offerTitle: offer.offers.title });
        return;
      }

      // Create a pending redemption
      const { data, error } = await supabase
        .from('offer_redemptions')
        .insert([{ offer_id: offerId, user_id: session.user.id, status: 'pending' }])
        .select()
        .single();

      if (error) {
        console.error("Failed to redeem offer:", error);
        return;
      }

      // Update local state to pending
      setOffers(prev => prev.map(o => o.id === offerId ? { ...o, status: 'pending', redemption_id: data.id } : o));
      
      // Show QR
      setActiveQR({ redemptionId: data.id, offerTitle: offer.offers.title });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      
      {/* QR Code Modal */}
      {activeQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-red-500/30 rounded-3xl p-8 max-w-sm w-full flex flex-col items-center shadow-2xl shadow-red-500/20 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setActiveQR(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <h2 className="text-xl font-black uppercase tracking-widest mb-2 text-center text-white">Scan to Redeem</h2>
            <p className="text-gray-400 text-xs text-center mb-6">Show this QR code to the Brand Owner to use your <strong className="text-white">{activeQR.offerTitle}</strong> offer.</p>
            
            <div className="bg-white p-4 rounded-2xl">
              <QRCodeSVG 
                value={`${window.location.origin}/redeem-offer/${activeQR.redemptionId}`}
                size={200}
                bgColor={"#ffffff"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
            
            <p className="text-[10px] text-gray-600 font-mono mt-6 text-center break-all w-full">
              ID: {activeQR.redemptionId}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tighter">Your <span className="text-red-600">Rewards</span></h1>
        <div className="bg-[#1A1A1A] border border-white/10 p-2 rounded-full">
          <Search className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {/* Offers List */}
      <div className="space-y-4">
        {offers.filter(o => o.status !== 'used').length === 0 ? (
          <div className="bg-[#111] border border-white/5 p-8 rounded-3xl text-center flex flex-col items-center">
            <Ticket className="w-12 h-12 text-gray-600 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No rewards yet</h3>
            <p className="text-sm text-gray-500">Play in tournaments to unlock exclusive brand discounts!</p>
          </div>
        ) : (
          offers.filter(o => o.status !== 'used').map((item) => {
            const isUsed = item.status === 'used';
            return (
              <div key={item.id} className={`bg-[#111] border border-white/5 rounded-3xl overflow-hidden transition-all shadow-lg shadow-black/50 hover:border-white/20`}>
                <div className="p-5 flex gap-4">
                  {/* Brand Logo or Placeholder */}
                  <div className="w-16 h-16 bg-[#1A1A1A] rounded-2xl flex-shrink-0 flex items-center justify-center border border-white/5 overflow-hidden">
                    {item.brand?.logo_url ? (
                      <img src={item.brand.logo_url} alt={item.brand.name} className="w-full h-full object-cover" />
                    ) : (
                      <Store className="w-6 h-6 text-gray-500" />
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] uppercase tracking-widest text-red-500 font-bold block">
                        {item.brand?.name || 'LOS Partner'}
                      </span>
                      {item.offers?.discount_amount && (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                          {item.offers.discount_amount}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold uppercase tracking-tight leading-tight mb-1">
                      {item.offers?.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                      {item.offers?.description}
                    </p>
                    {item.offers?.discount_code && !isUsed && (
                      <div className="bg-black/50 border border-white/5 rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">Promo Code</span>
                        <span className="font-mono text-white text-sm font-bold tracking-wider">{item.offers.discount_code}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-5 pb-5 pt-1">
                  <button
                    onClick={() => handleUseOffer(item.id)}
                    disabled={isUsed}
                    className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all bg-white text-black hover:bg-gray-200 shadow-xl`}
                  >
                    {item.status === 'pending' ? (
                      'Show QR Code'
                    ) : (
                      'Use Offer'
                    )}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* LOS Network Display */}
      <div className="pt-6 border-t border-white/5">
        <h2 className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-4 px-2">The LOS Network</h2>
        
        {/* Horizontal Scroll Area */}
        <div className="flex overflow-x-auto pb-4 gap-4 snap-x hide-scrollbar px-2">
          {brands.map((brand) => (
            <Link to={`/${brand.slug || brand.id}`} key={brand.id} className="snap-start flex flex-col items-center gap-2 w-20 flex-shrink-0 hover:opacity-80 transition-opacity cursor-pointer">
              <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center border border-white/10 overflow-hidden">
                {brand.logo_url ? (
                   <img src={brand.logo_url} alt={brand.name} className="w-full h-full object-cover" />
                ) : (
                   <span className="font-bold text-gray-600 uppercase text-xs">{brand.name?.substring(0,2)}</span>
                )}
              </div>
              <span className="text-[9px] uppercase tracking-widest text-gray-400 font-bold text-center line-clamp-1 w-full">
                {brand.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}

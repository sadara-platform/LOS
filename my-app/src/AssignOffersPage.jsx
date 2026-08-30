import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { Loader2 } from 'lucide-react';

const CheckCircleIcon = () => (
  <svg className="w-6 h-6 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default function AssignOffersPage() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const [formData, setFormData] = useState({
    brandId: '',
    title: '',
    description: '',
    discountCode: '',
    discountAmount: ''
  });

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setBrands(data || []);
      
      if (data && data.length > 0) {
        setFormData(prev => ({ ...prev, brandId: data[0].id }));
      }
    } catch (err) {
      console.error('Error fetching brands:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.brandId) {
      setToastMessage("Error: Please select a brand first.");
      setTimeout(() => setToastMessage(null), 4000);
      return;
    }

    setIsSubmitting(true);
    setToastMessage(null);

    try {
      const { error } = await supabase.rpc('admin_create_offer', {
        p_brand_id: formData.brandId,
        p_title: formData.title,
        p_description: formData.description,
        p_discount_code: formData.discountCode || null,
        p_discount_amount: formData.discountAmount
      });

      if (error) throw error;

      const selectedBrand = brands.find(b => b.id === formData.brandId)?.name || 'the brand';
      setToastMessage(`Success: Offer assigned to ${selectedBrand}!`);
      
      // Auto-hide toast after 4 seconds
      setTimeout(() => setToastMessage(null), 4000);
      
      // Reset form but keep the selected brand
      setFormData(prev => ({
        ...prev,
        title: '',
        description: '',
        discountCode: '',
        discountAmount: ''
      }));
    } catch (err) {
      console.error('Error creating offer:', err);
      setToastMessage(`Error: ${err.message}`);
      setTimeout(() => setToastMessage(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full bg-[#0A0A0A] text-white font-sans p-6 md:p-12 relative overflow-x-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-900/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-4xl mx-auto mb-10 relative z-10">
        <h2 className="text-cyan-500 font-bold tracking-widest uppercase text-sm mb-2">LOS Admin Panel</h2>
        <h1 className="text-4xl md:text-5xl font-black text-white">Assign Offers</h1>
        <p className="text-gray-400 mt-3">Directly assign promotional offers and discounts to participating brands.</p>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <h3 className="text-xl font-bold border-b border-white/10 pb-2 mb-6">Offer Details</h3>
              
              {/* Brand Selector */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Target Brand</label>
                <select
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleChange}
                  required
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                >
                  <option value="" disabled>Select a brand...</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Offer Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Offer Title</label>
                <input 
                  type="text" 
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Summer Special 20%"
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promo Code */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Promo Code (Optional)</label>
                  <input 
                    type="text" 
                    name="discountCode"
                    value={formData.discountCode}
                    onChange={handleChange}
                    placeholder="e.g. SUMMER20"
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all uppercase"
                  />
                </div>

                {/* Discount Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Discount Value</label>
                  <input 
                    type="text" 
                    name="discountAmount"
                    value={formData.discountAmount}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 20% OFF or $10"
                    className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Enter the terms and details of this offer..."
                  className="w-full bg-black/50 border border-white/20 rounded-xl p-4 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all resize-none"
                />
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full flex items-center justify-center p-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.2)]
                    ${isSubmitting ? 'bg-cyan-600/70 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:-translate-y-1 text-black'}
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" /> Assigning...
                    </>
                  ) : (
                    'Assign Offer to Brand'
                  )}
                </button>
              </div>
            </form>
          )}
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
    </div>
  );
}

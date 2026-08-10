import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient';
import { ShoppingBag, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';

export default function ProductsTab({ brand }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newProduct, setNewProduct] = useState({ 
    name: '', sku: '', price: '', category: '', image_url: '', description: '' 
  });
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchProducts();
  }, [brand]);

  async function fetchProducts() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const { data, error } = await supabase.from('products').insert([{
        brand_id: brand.id,
        name: newProduct.name,
        sku: newProduct.sku,
        price: Number(newProduct.price),
        category: newProduct.category || 'hardware',
        image_url: newProduct.image_url,
        description: newProduct.description,
        specs: [] // Keep empty for MVP
      }]).select();

      if (error) throw error;
      
      setProducts([data[0], ...products]);
      setIsAdding(false);
      setNewProduct({ name: '', sku: '', price: '', category: '', image_url: '', description: '' });
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('brand_id', brand.id);
        
      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== productId));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (loading) {
    return <div className="text-zinc-500 text-sm italic p-8">Loading catalog...</div>;
  }

  return (
    <div className="flex flex-col relative z-10 w-full animate-in fade-in zoom-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="font-headline-lg-mobile md:font-display-xl text-headline-lg-mobile md:text-display-xl text-primary font-black neon-text-primary tracking-tighter uppercase">Product Catalog Manager</h1>
          <p className="font-code-sm text-code-sm text-on-surface-variant mt-2 opacity-80">&gt; SYS.MSG: MANAGE_INVENTORY_MATRIX</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#FF0055] text-white font-title-md text-title-md py-4 px-8 rounded-DEFAULT neon-glow-primary uppercase transition-all duration-300 hover:scale-105 flex items-center gap-2"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isAdding ? 'close' : 'add'}
          </span>
          {isAdding ? 'CANCEL' : 'ADD PRODUCT'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Section 1: Add New Product Form */}
        {isAdding && (
          <section className="lg:col-span-4 flex flex-col gap-6">
            <div className="glass-card rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group border border-white/10 bg-[#141414]">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
              
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8 border-b border-white/10 pb-4">&gt; ADD_NEW_PRODUCT_</h2>
              
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleCreateProduct} className="flex flex-col gap-6">
                <div>
                  <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">PRODUCT_NAME</label>
                  <input required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm" placeholder="e.g. Quantum Accelerator" type="text" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">SKU_ID</label>
                    <input required value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm tabular-nums" placeholder="Q-ACC-001" type="text" />
                  </div>
                  <div>
                    <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">PRICE_CREDITS</label>
                    <input required step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm tabular-nums" placeholder="2999.00" type="number" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">CATEGORY</label>
                  <select required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm appearance-none cursor-pointer">
                    <option className="bg-[#141414] text-primary" value="hardware">Hardware</option>
                    <option className="bg-[#141414] text-primary" value="software">Software</option>
                    <option className="bg-[#141414] text-primary" value="gear">Tactical Gear</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">DESCRIPTION_DATA</label>
                  <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm resize-none h-24" placeholder="Enter specifications..."></textarea>
                </div>
                
                <div>
                   <label className="block text-code-sm font-bold tracking-widest text-zinc-400 uppercase mb-2">IMAGE_ASSET_URL</label>
                   <input value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-primary text-sm focus:outline-none focus:border-brand-accent transition-colors font-code-sm" placeholder="https://..." type="url" />
                </div>

                <button type="submit" className="mt-4 border border-primary text-primary font-code-sm text-code-sm py-3 rounded-DEFAULT hover:bg-primary/10 transition-colors uppercase tracking-wider w-full">
                  INITIALIZE_UPLOAD
                </button>
              </form>
            </div>
          </section>
        )}

        {/* Section 2: Product Catalog Data Table */}
        <section className={isAdding ? "lg:col-span-8" : "lg:col-span-12"}>
          <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col min-h-[600px] border border-white/10 bg-black/40">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#171717]/80">
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">&gt; ACTIVE_INVENTORY_</h2>
              <div className="flex gap-4">
                <div className="relative border-b border-white/20 pb-1 flex items-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2" style={{ fontVariationSettings: "'FILL' 1" }}>search</span>
                  <input className="bg-transparent border-none p-0 text-code-sm font-code-sm text-primary focus:outline-none focus:ring-0 w-32 md:w-48 placeholder-white/30" placeholder="QUERY_DB..." type="text"/>
                </div>
                <button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>filter_list</span></button>
              </div>
            </div>
            
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-[#171717] z-10 shadow-md">
                  <tr className="border-b border-white/10 text-on-surface-variant font-code-sm text-[12px] uppercase tracking-wider">
                    <th className="p-4 pl-6 font-medium">Visual</th>
                    <th className="p-4 font-medium">Designation</th>
                    <th className="p-4 font-medium">SKU</th>
                    <th className="p-4 font-medium">Category</th>
                    <th className="p-4 text-right font-medium">Value (CR)</th>
                    <th className="p-4 pr-6 text-right font-medium">Command</th>
                  </tr>
                </thead>
                <tbody className="font-code-sm text-code-sm divide-y divide-white/5">
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-on-surface-variant font-code-sm italic opacity-50">
                        No inventory data found.
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id} className="hover:bg-white/5 transition-colors bg-transparent group">
                        <td className="p-4 pl-6">
                          <div className="w-12 h-12 rounded bg-[#0A0A0A] border border-white/10 overflow-hidden">
                            {product.image_url ? (
                               <img alt="Item" className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all duration-300" src={product.image_url}/>
                            ) : (
                               <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600">N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 font-bold text-on-surface truncate max-w-[200px]">{product.name}</td>
                        <td className="p-4 text-on-surface-variant tabular-nums">{product.sku}</td>
                        <td className="p-4 text-on-surface-variant uppercase text-xs">{product.category}</td>
                        <td className="p-4 text-right text-secondary-fixed tabular-nums font-bold text-cyan-400">{product.price}</td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="text-on-surface-variant hover:text-error mx-1 transition-colors group-hover:text-red-500"
                          >
                            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>delete</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="p-4 border-t border-white/10 bg-[#171717] flex justify-between items-center text-code-sm text-on-surface-variant">
              <span>SHOWING {Math.min(1, products.length)}-{products.length} OF {products.length} ENTRIES</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">&lt; PREV</button>
                <button className="px-3 py-1 border border-primary text-primary bg-primary/10 rounded transition-colors">01</button>
                <button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">NEXT &gt;</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { ShoppingBag, Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import ImageUpload from './ImageUpload';

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
        category: newProduct.category,
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
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <ShoppingBag className="w-4 h-4" />
          Product Catalog Manager
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand-red hover:bg-brand-red/90 text-white px-4 py-2 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-2"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Product</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleCreateProduct} className="bg-[#141414] border border-white/10 rounded-2xl p-6 mb-8 space-y-4">
          <h3 className="font-bold tracking-widest uppercase text-xs text-white mb-2">Create New Product</h3>
          
          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Product Name</label>
              <input type="text" required value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="e.g. Utility Tactical Vest" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">SKU Code</label>
              <input type="text" required value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="e.g. SE3P" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Price ($)</label>
              <input type="number" step="0.01" required value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="299.99" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Category</label>
              <input type="text" required value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="e.g. VEST" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Product Image</label>
              <ImageUpload 
                currentImage={newProduct.image_url}
                onUploadSuccess={(url) => setNewProduct({...newProduct, image_url: url})} 
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold tracking-widest text-zinc-400 uppercase mb-2">Description</label>
              <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-[#0A0A0A] border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red transition-colors h-20 resize-none" placeholder="Provide product details..." />
            </div>
          </div>
          
          <button type="submit" className="bg-white hover:bg-zinc-200 text-black font-bold tracking-widest uppercase px-6 py-3 rounded-lg transition-colors text-xs w-full mt-4">
            Save Product to Catalog
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full bg-[#141414] border border-white/5 rounded-2xl p-8 text-center text-zinc-600 text-sm italic">
            No products found. Start adding your catalog!
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden group">
              <div className="h-48 bg-zinc-900 relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-700">No Image</div>
                )}
                <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border border-white/10 text-white">
                  ${product.price}
                </div>
              </div>
              <div className="p-4">
                <div className="text-[9px] text-brand-red uppercase tracking-widest font-bold mb-1">{product.category} • {product.sku}</div>
                <h3 className="font-bold text-base leading-tight mb-2 truncate">{product.name}</h3>
                <p className="text-zinc-500 text-xs line-clamp-2 mb-4 h-8">{product.description}</p>
                
                <div className="flex gap-2 border-t border-white/5 pt-4">
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold tracking-widest uppercase py-2 rounded transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

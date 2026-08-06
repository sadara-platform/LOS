import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Package, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function BrandDashboard() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [brand, setBrand] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    sku: '',
    price: '',
    category: '',
    image_url: '',
    description: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBrandData();
  }, [id]);

  const fetchBrandData = async () => {
    setIsLoading(true);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    };

    try {
      // Fetch Brand
      const brandRes = await fetch(`${supabaseUrl}/rest/v1/brands?id=eq.${id}&select=*`, { headers });
      const brandData = await brandRes.json();
      if (brandData && brandData.length > 0) {
        setBrand(brandData[0]);
      }

      // Fetch Products
      const prodRes = await fetch(`${supabaseUrl}/rest/v1/products?brand_id=eq.${id}&order=created_at.desc`, { headers });
      const prodData = await prodRes.json();
      setProducts(prodData || []);
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    };

    const productData = {
      ...newProduct,
      brand_id: id,
      price: parseFloat(newProduct.price)
    };

    try {
      const res = await fetch(`${supabaseUrl}/rest/v1/products`, {
        method: 'POST',
        headers,
        body: JSON.stringify(productData)
      });
      const data = await res.json();
      if (res.ok && data.length > 0) {
        setProducts([data[0], ...products]);
        setIsAdding(false);
        setNewProduct({ name: '', sku: '', price: '', category: '', image_url: '', description: '' });
      }
    } catch (err) {
      console.error("Error adding product", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center items-center h-full">
        <Loader2 className="w-10 h-10 animate-spin text-cyan-500" />
      </div>
    );
  }

  if (!brand) {
    return <div className="p-8 text-white">Brand not found.</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <button 
        onClick={() => navigate('/admin/brands')}
        className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 font-mono text-sm uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Directory
      </button>

      <div className="flex items-center gap-6 mb-12 pb-6 border-b border-white/10">
        {brand.logo_url ? (
          <img src={brand.logo_url} alt={brand.name} className="w-20 h-20 object-contain bg-white/5 rounded-xl p-2" />
        ) : (
          <div className="w-20 h-20 bg-white/5 rounded-xl flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-gray-500" />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-black tracking-widest text-white uppercase">{brand.name} Dashboard</h1>
          <a href={`/${brand.slug}`} target="_blank" rel="noreferrer" className="text-cyan-400 font-mono text-sm hover:underline">
            Visit Live Portal (/{brand.slug})
          </a>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Package className="w-6 h-6 text-cyan-500" /> Product Inventory
        </h2>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 px-4 py-2 rounded-lg font-bold text-sm tracking-wide uppercase flex items-center gap-2 transition-colors"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Add Product</>}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddProduct} className="bg-[#111] border border-cyan-500/30 rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <h3 className="col-span-full text-lg font-bold text-cyan-400 uppercase tracking-widest">New Product Details</h3>
          
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Product Name</label>
            <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">SKU</label>
            <input required type="text" value={newProduct.sku} onChange={e => setNewProduct({...newProduct, sku: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Price ($)</label>
            <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" />
          </div>
          <div>
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Category</label>
            <input required type="text" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="e.g. Apparel, Hardware" />
          </div>
          <div className="col-span-full">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Image URL</label>
            <input type="url" value={newProduct.image_url} onChange={e => setNewProduct({...newProduct, image_url: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none" placeholder="https://..." />
          </div>
          <div className="col-span-full">
            <label className="block text-xs font-mono text-gray-400 uppercase mb-2">Description</label>
            <textarea value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-cyan-500 outline-none min-h-[100px]" />
          </div>
          <div className="col-span-full flex justify-end">
            <button disabled={isSubmitting} type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest px-8 py-3 rounded-lg flex items-center gap-2">
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
            </button>
          </div>
        </form>
      )}

      {products.length === 0 && !isAdding ? (
        <div className="text-center py-20 border border-white/5 bg-[#111] rounded-2xl">
          <p className="text-gray-500 font-mono">No products in inventory. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors flex flex-col group">
              <div className="h-48 bg-black/50 flex items-center justify-center p-4 relative">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform" />
                ) : (
                  <Package className="w-12 h-12 text-white/10" />
                )}
                <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-cyan-400 font-bold px-3 py-1 rounded-full text-sm border border-cyan-500/20">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="text-[10px] text-gray-500 font-mono uppercase tracking-widest mb-1">{product.category} &bull; {product.sku}</div>
                <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">{product.description}</p>
                
                <button className="mt-auto w-full border border-white/10 hover:bg-white/5 text-white py-2 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors">
                  Edit Product
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

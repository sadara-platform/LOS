import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, LayoutDashboard, Search, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        const response = await fetch(`${supabaseUrl}/rest/v1/brands?select=*&order=created_at.desc`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        
        const data = await response.json();
        setBrands(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  const filteredBrands = brands.filter(brand => 
    brand.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    brand.slug?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 uppercase">
            Brands Directory
          </h1>
          <p className="text-gray-400 mt-2 font-mono text-sm uppercase tracking-wide">
            Manage your network of affiliated platforms
          </p>
        </div>
        
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1A1A1A] border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-colors placeholder:text-gray-600 font-mono"
          />
        </div>
      </div>

      {/* States */}
      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="w-12 h-12 border-4 border-white/10 border-t-cyan-500 rounded-full animate-spin"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl flex items-start gap-4 mb-8">
          <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-bold mb-1">Failed to load directory</h3>
            <p className="text-sm text-red-400/80">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && filteredBrands.length === 0 && (
        <div className="text-center py-20 border border-white/5 rounded-2xl bg-[#111]">
          <p className="text-gray-500 font-mono">No brands found.</p>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div 
            key={brand.id} 
            className="group bg-[#111] border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors flex flex-col"
          >
            {/* Logo/Image Banner */}
            <div className="h-32 bg-[#0A0A0A] border-b border-white/5 flex items-center justify-center p-6 relative overflow-hidden">
              {/* Subtle background color based on brand */}
              <div 
                className="absolute inset-0 opacity-20 transition-opacity group-hover:opacity-30" 
                style={{ backgroundColor: brand.bg_color || brand.primary_color }}
              ></div>
              
              {brand.logo_url ? (
                <img 
                  src={brand.logo_url} 
                  alt={brand.name} 
                  className="h-full object-contain relative z-10 drop-shadow-xl" 
                />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-700 relative z-10" />
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold text-white mb-1 tracking-wide">{brand.name}</h2>
              <p className="text-xs text-gray-500 font-mono mb-6">/{brand.slug}</p>

              {/* Color Palette Preview */}
              <div className="mb-6 mt-auto">
                <p className="text-[10px] uppercase tracking-widest text-gray-600 mb-2 font-bold">Brand Palette</p>
                <div className="flex gap-2">
                  {[brand.primary_color, brand.secondary_color, brand.accent_color, brand.bg_color].filter(Boolean).map((color, i) => (
                    <div 
                      key={i}
                      className="w-6 h-6 rounded-full border border-white/10 shadow-sm"
                      style={{ backgroundColor: color }}
                      title={color}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center gap-3">
                <button 
                  onClick={() => navigate(`/admin/brands/${brand.id}`)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <a 
                  href={`/${brand.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 text-xs font-bold uppercase tracking-wider p-2.5 rounded-lg transition-colors flex items-center justify-center"
                  title="View Live Portal"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

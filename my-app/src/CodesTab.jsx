import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { QrCode, Search } from 'lucide-react';

export default function CodesTab({ brand }) {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function fetchCodes() {
      setLoading(true);
      try {
        // Fetch a sample of recent codes for the read-only view
        const { data, error } = await supabase
          .from('codes')
          .select('*')
          .eq('brand_id', brand.id)
          .order('created_at', { ascending: false })
          .limit(100); // Limit to 100 for performance on read-only tab
          
        if (error) throw error;
        setCodes(data || []);
      } catch (err) {
        console.error("Error fetching codes:", err);
      } finally {
        setLoading(false);
      }
    }
    
    if (brand) fetchCodes();
  }, [brand]);

  const filteredCodes = codes.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return <div className="text-zinc-500 text-sm italic p-8">Loading codes data...</div>;
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase flex items-center gap-2">
          <QrCode className="w-4 h-4" />
          QR Codes Log
        </h2>
        <div className="text-xs text-zinc-500 italic bg-white/5 px-3 py-1.5 rounded border border-white/5">
          Read-only Mode. Code generation is restricted to Admin.
        </div>
      </div>

      <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center gap-3">
          <Search className="w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search by code snippet..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="bg-transparent border-none text-white text-sm focus:outline-none w-full"
          />
        </div>

        {filteredCodes.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm italic">
            No codes found matching your search.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs font-bold tracking-widest text-zinc-500 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Code</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Claimed By</th>
                  <th className="px-6 py-4 font-medium">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredCodes.map(code => (
                  <tr key={code.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-zinc-300">{code.code}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase ${code.status === 'activated' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-zinc-800 text-zinc-400'}`}>
                        {code.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-zinc-500">
                      {code.user_id ? code.user_id.substring(0, 8) + '...' : '-'}
                    </td>
                    <td className="px-6 py-4 text-zinc-500">
                      {new Date(code.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}

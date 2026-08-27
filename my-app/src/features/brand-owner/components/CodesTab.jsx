import React, { useState, useEffect } from 'react';
import { supabase } from '../../../SupabaseClient';

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
    return (
      <div className="flex items-center justify-center h-64 text-brand-secondary font-code-sm uppercase tracking-widest animate-pulse">
        {'>'} FETCHING_CODES_MATRIX...
      </div>
    );
  }

  return (
    <div className="flex flex-col relative h-full overflow-y-auto animate-in fade-in zoom-in duration-500 pb-24">
      <div className="w-full mx-auto flex flex-col gap-[60px]">
        {/* Header Section */}
        <section className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-white/5 pb-8">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="font-headline-lg text-headline-lg font-black neon-text-primary tracking-tighter uppercase m-0 leading-none">
              QR_CODES_LOG
            </h1>
            <span className="font-code-sm text-code-sm text-error bg-error-container/20 border border-error/50 px-3 py-1 rounded-sm tracking-widest neon-text-error">
              [READ_ONLY_MODE]
            </span>
          </div>
          {/* Terminal Search */}
          <div className="relative w-full md:w-96 flex items-center font-code-sm text-code-sm group">
            <span className="text-primary mr-2 font-bold">&gt;</span>
            <input 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-transparent border-0 border-b-2 border-surface-variant text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 terminal-input py-2 transition-colors uppercase tracking-wider focus:outline-none focus:border-primary" 
              placeholder="SEARCH_CODE_" 
              type="text"
            />
            <span className="absolute right-0 bottom-2 w-2 h-4 bg-primary cursor-blink hidden group-focus-within:block"></span>
          </div>
        </section>

        {/* Data Table Section */}
        <section className="glass-panel rounded-xl overflow-hidden p-[1px] bg-white/5 border border-white/10">
          <div className="bg-[#171717]/95 rounded-xl overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-white/10 font-code-sm text-code-sm text-on-surface-variant bg-surface-container-low/50">
                  <th className="py-4 px-6 font-medium tracking-widest uppercase">Code</th>
                  <th className="py-4 px-6 font-medium tracking-widest uppercase">Status</th>
                  <th className="py-4 px-6 font-medium tracking-widest uppercase">Claimed By</th>
                  <th className="py-4 px-6 font-medium tracking-widest uppercase text-right">Created At</th>
                </tr>
              </thead>
              <tbody className="font-code-sm text-code-sm divide-y divide-white/5">
                {filteredCodes.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-on-surface-variant/50 italic">
                      NO_RECORDS_FOUND
                    </td>
                  </tr>
                ) : (
                  filteredCodes.map(code => (
                    <tr key={code.id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 tabular-nums font-bold text-on-surface">{code.code}</td>
                      <td className="py-4 px-6">
                        {code.status === 'activated' ? (
                          <span className="inline-flex items-center gap-1.5 border border-[#00ff88]/30 px-2.5 py-0.5 rounded-full text-[12px] bg-[#00ff88]/10 neon-text-success text-[#00ff88]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                            ACTIVATED
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 border border-surface-variant px-2.5 py-0.5 rounded-full text-[12px] text-on-surface-variant text-zinc-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                            {code.status ? code.status.toUpperCase() : 'PENDING'}
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-on-surface-variant opacity-70 font-mono">
                        {code.user_id ? code.user_id.substring(0, 8) + '...' : '--'}
                      </td>
                      <td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">
                        {new Date(code.created_at).toLocaleString('en-GB').replace(',', '')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="px-6 py-4 border-t border-white/5 flex justify-between items-center font-code-sm text-code-sm text-on-surface-variant">
              <span>SHOWING {Math.min(1, filteredCodes.length)} TO {filteredCodes.length} OF {filteredCodes.length} RECORDS</span>
              <div className="flex gap-4">
                <button className="hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-on-surface-variant" disabled>PREV</button>
                <span className="text-on-surface">01 / 01</span>
                <button className="hover:text-primary transition-colors disabled:opacity-50" disabled>NEXT</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { supabase } from './SupabaseClient';
import { BarChart3 } from 'lucide-react';

export default function AnalyticsTab({ brand }) {
  const [analytics, setAnalytics] = useState({ totalCodes: 0, activatedCodes: 0, activationRate: 0, totalOffers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const { count: totalCodes } = await supabase.from('codes').select('*', { count: 'exact', head: true }).eq('brand_id', brand.id);
        const { count: activatedCodes } = await supabase.from('codes').select('*', { count: 'exact', head: true }).eq('brand_id', brand.id).eq('status', 'activated');
        const { count: totalOffers } = await supabase.from('offers').select('*', { count: 'exact', head: true }).eq('brand_id', brand.id);
        
        const tot = totalCodes || 0;
        const act = activatedCodes || 0;
        setAnalytics({
          totalCodes: tot,
          activatedCodes: act,
          activationRate: tot > 0 ? Math.round((act / tot) * 100) : 0,
          totalOffers: totalOffers || 0
        });
      } catch (err) {
        console.warn("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    if (brand) fetchAnalytics();
  }, [brand]);

  if (loading) {
    return <div className="text-zinc-500 text-sm italic p-8">Loading analytics...</div>;
  }

  return (
    <section>
      <h2 className="text-sm font-bold tracking-widest text-zinc-500 uppercase mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4" />
        Performance Analytics
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Total Codes</div>
          <div className="text-4xl font-black tracking-tighter">{analytics.totalCodes}</div>
        </div>
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Activated</div>
          <div className="text-4xl font-black tracking-tighter text-cyan-400">{analytics.activatedCodes}</div>
        </div>
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Activation Rate</div>
          <div className="text-4xl font-black tracking-tighter text-red-500">{analytics.activationRate}%</div>
        </div>
        <div className="bg-[#141414] border border-white/5 p-6 rounded-2xl">
          <div className="text-zinc-500 text-xs font-bold tracking-widest uppercase mb-1">Active Offers</div>
          <div className="text-4xl font-black tracking-tighter text-emerald-500">{analytics.totalOffers}</div>
        </div>
      </div>
    </section>
  );
}

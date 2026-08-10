import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabaseClient'; // keep existing import
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
    return (
      <div className="flex items-center justify-center h-64 text-brand-secondary font-code-sm uppercase tracking-widest animate-pulse">
        {'>'} QUERY_DATASTREAM...
      </div>
    );
  }

  return (
    <div className="flex flex-col relative z-10 w-full animate-in fade-in zoom-in duration-500">
      <header className="mb-12">
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-background uppercase tracking-tight">System Analytics</h2>
        <p className="font-code-sm text-code-sm text-primary mt-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(255,178,184,0.8)] animate-pulse"></span>
          LIVE_DATA_STREAM
        </p>
      </header>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-[120px]">
        
        {/* Card 1 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 neon-shadow-hover glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Total Scans</span>
            <span className="material-symbols-outlined text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>qr_code_scanner</span>
          </div>
          <div className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-background tabular-nums relative z-10">
            {analytics.totalCodes}
          </div>
          <div className="mt-2 text-secondary-fixed-dim font-code-sm text-xs flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Overall codes generated
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 neon-shadow-hover glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Active Offers</span>
            <span className="material-symbols-outlined text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>local_offer</span>
          </div>
          <div className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-background tabular-nums relative z-10">
            {analytics.totalOffers}
          </div>
          <div className="mt-2 text-secondary-fixed-dim font-code-sm text-xs flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Live offers in network
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 neon-shadow-hover glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Claimed Scans</span>
            <span className="material-symbols-outlined text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
          </div>
          <div className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-background tabular-nums relative z-10">
            {analytics.activatedCodes}
          </div>
          <div className="mt-2 text-secondary-fixed-dim font-code-sm text-xs flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">info</span>
            Total activated tags
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-6 relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 neon-shadow-hover glass-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="font-code-sm text-code-sm text-on-surface-variant uppercase tracking-wider">Activation Rate</span>
            <span className="material-symbols-outlined text-primary/70" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
          </div>
          <div className="font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-background tabular-nums relative z-10">
            {analytics.activationRate}%
          </div>
          <div className="mt-2 text-secondary-fixed-dim font-code-sm text-xs flex items-center gap-1 relative z-10">
            <span className="material-symbols-outlined text-[14px]">trending_up</span>
            Current conversion 
          </div>
        </div>
      </section>

      {/* Chart Section */}
      <section className="flex-1 w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-8 relative overflow-hidden glass-border hover:shadow-[0_0_30px_rgba(255,0,85,0.1)] transition-shadow duration-500">
        <h3 className="font-title-md text-title-md text-on-background uppercase tracking-widest mb-8">Scans Over Time</h3>
        <div className="h-64 md:h-96 w-full flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-lg bg-surface/30 relative">
          <div className="absolute top-4 left-4 font-code-sm text-xs text-on-surface-variant opacity-50">
            &gt; QUERY_DATASTREAM...<br/>&gt; STATUS: NULL
          </div>
          <div className="text-center z-10">
            <span className="material-symbols-outlined text-6xl text-primary/30 mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>ssid_chart</span>
            <h4 className="font-code-sm text-code-sm text-on-surface-variant mb-6 uppercase tracking-widest">No Data Available</h4>
            <button className="bg-transparent border-b-2 border-primary/50 text-primary hover:text-white hover:border-white font-code-sm text-code-sm py-2 px-4 transition-all duration-300 flex items-center gap-2 mx-auto">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
              REFRESH SYNC
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

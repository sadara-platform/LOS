<main className="flex-1 overflow-y-auto p-gutter sm:p-margin-desktop">
<div className="max-w-container-max mx-auto space-y-12">
{/* Page Header */}
<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
<div>
<h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-brand-primary uppercase tracking-tighter text-glow">System Overview</h1>
<p className="font-code-sm text-brand-secondary mt-2">&gt; STATUS: OPTIMAL // ALL SYSTEMS NOMINAL</p>
</div>
<button className="bg-brand-accent text-white font-title-md py-3 px-8 rounded-DEFAULT neon-shadow hover-lift uppercase tracking-widest flex items-center justify-center gap-2 w-full sm:w-auto">
<span className="material-symbols-outlined">add</span>
                        New Protocol
                    </button>
</div>
{/* KPI Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
{/* KPI Card 1 */}
<div className="glass-panel p-6 rounded-xl hover-lift relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
<span className="material-symbols-outlined text-6xl text-brand-accent">speed</span>
</div>
<div className="font-code-sm text-brand-secondary mb-2">&gt; TOTAL_REQUESTS</div>
<div className="font-display-xl text-4xl text-brand-primary tabular-nums tracking-tighter">84,209</div>
<div className="mt-4 flex items-center text-sm">
<span className="text-green-400 flex items-center mr-2"><span className="material-symbols-outlined text-sm mr-1">trending_up</span>+12.5%</span>
<span className="text-brand-secondary">vs last cycle</span>
</div>
</div>
{/* KPI Card 2 */}
<div className="glass-panel p-6 rounded-xl hover-lift relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
<span className="material-symbols-outlined text-6xl text-brand-accent">memory</span>
</div>
<div className="font-code-sm text-brand-secondary mb-2">&gt; CPU_LOAD</div>
<div className="font-display-xl text-4xl text-brand-primary tabular-nums tracking-tighter text-glow">92%</div>
<div className="mt-4 flex items-center text-sm">
<span className="text-brand-accent flex items-center mr-2"><span className="material-symbols-outlined text-sm mr-1">warning</span>CRITICAL</span>
<span className="text-brand-secondary">allocation</span>
</div>
</div>
{/* KPI Card 3 */}
<div className="glass-panel p-6 rounded-xl hover-lift relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
<span className="material-symbols-outlined text-6xl text-brand-accent">account_tree</span>
</div>
<div className="font-code-sm text-brand-secondary mb-2">&gt; ACTIVE_NODES</div>
<div className="font-display-xl text-4xl text-brand-primary tabular-nums tracking-tighter">1,024</div>
<div className="mt-4 flex items-center text-sm">
<span className="text-green-400 flex items-center mr-2"><span className="material-symbols-outlined text-sm mr-1">check_circle</span>STABLE</span>
<span className="text-brand-secondary">cluster status</span>
</div>
</div>
{/* KPI Card 4 */}
<div className="glass-panel p-6 rounded-xl hover-lift relative overflow-hidden group">
<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
<span className="material-symbols-outlined text-6xl text-brand-accent">api</span>
</div>
<div className="font-code-sm text-brand-secondary mb-2">&gt; API_LATENCY</div>
<div className="font-display-xl text-4xl text-brand-primary tabular-nums tracking-tighter">12ms</div>
<div className="mt-4 flex items-center text-sm">
<span className="text-brand-secondary flex items-center mr-2"><span className="material-symbols-outlined text-sm mr-1">remove</span>-2ms</span>
<span className="text-brand-secondary">improvement</span>
</div>
</div>
</div>
</div>
</main>
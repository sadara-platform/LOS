<main className="flex-1 h-full overflow-y-auto bg-[#0A0A0A] pt-24 pb-12 md:pl-64">
<div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-[60px]">
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
<input className="w-full bg-transparent border-0 border-b-2 border-surface-variant text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0 terminal-input py-2 transition-colors uppercase tracking-wider" placeholder="SEARCH_CODE_" type="text"/>
<span className="absolute right-0 bottom-2 w-2 h-4 bg-primary cursor-blink hidden group-focus-within:block"></span>
</div>
</section>
{/* Data Table Section */}
<section className="glass-panel rounded-xl overflow-hidden p-[1px]">
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
{/* Row 1 */}
<tr className="hover:bg-white/5 transition-colors group">
<td className="py-4 px-6 tabular-nums font-bold text-on-surface">NX-8829-X</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 border border-[#00ff88]/30 px-2.5 py-0.5 rounded-full text-[12px] bg-[#00ff88]/10 neon-text-success">
<span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                                        ACTIVATED
                                    </span>
</td>
<td className="py-4 px-6 text-on-surface-variant">USER_ALPHA_9</td>
<td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">2024.08.12 14:30</td>
</tr>
{/* Row 2 */}
<tr className="hover:bg-white/5 transition-colors group">
<td className="py-4 px-6 tabular-nums font-bold text-on-surface">NX-1044-Y</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 border border-surface-variant px-2.5 py-0.5 rounded-full text-[12px] text-on-surface-variant">
<span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                                        PENDING
                                    </span>
</td>
<td className="py-4 px-6 text-on-surface-variant opacity-40">--</td>
<td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">2024.08.12 11:15</td>
</tr>
{/* Row 3 */}
<tr className="hover:bg-white/5 transition-colors group">
<td className="py-4 px-6 tabular-nums font-bold text-on-surface">NX-9932-Z</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 border border-[#FF0055]/30 px-2.5 py-0.5 rounded-full text-[12px] bg-[#FF0055]/10 neon-text-primary">
<span className="w-1.5 h-1.5 rounded-full bg-[#FF0055]"></span>
                                        EXPIRED
                                    </span>
</td>
<td className="py-4 px-6 text-on-surface-variant">GUEST_0442</td>
<td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">2024.08.11 09:00</td>
</tr>
{/* Row 4 */}
<tr className="hover:bg-white/5 transition-colors group">
<td className="py-4 px-6 tabular-nums font-bold text-on-surface">NX-5510-A</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 border border-[#00ff88]/30 px-2.5 py-0.5 rounded-full text-[12px] bg-[#00ff88]/10 neon-text-success">
<span className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse"></span>
                                        ACTIVATED
                                    </span>
</td>
<td className="py-4 px-6 text-on-surface-variant">SYS_ADMIN</td>
<td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">2024.08.10 22:45</td>
</tr>
{/* Row 5 */}
<tr className="hover:bg-white/5 transition-colors group">
<td className="py-4 px-6 tabular-nums font-bold text-on-surface">NX-2201-B</td>
<td className="py-4 px-6">
<span className="inline-flex items-center gap-1.5 border border-surface-variant px-2.5 py-0.5 rounded-full text-[12px] text-on-surface-variant">
<span className="w-1.5 h-1.5 rounded-full bg-surface-variant"></span>
                                        PENDING
                                    </span>
</td>
<td className="py-4 px-6 text-on-surface-variant opacity-40">--</td>
<td className="py-4 px-6 tabular-nums text-right text-on-surface-variant/70 group-hover:text-primary transition-colors">2024.08.10 18:20</td>
</tr>
</tbody>
</table>
<div className="px-6 py-4 border-t border-white/5 flex justify-between items-center font-code-sm text-code-sm text-on-surface-variant">
<span>SHOWING 5 OF 1,024 RECORDS</span>
<div className="flex gap-4">
<button className="hover:text-primary transition-colors disabled:opacity-50 disabled:hover:text-on-surface-variant" disabled="">PREV</button>
<span className="text-on-surface">01 / 205</span>
<button className="hover:text-primary transition-colors">NEXT</button>
</div>
</div>
</div>
</section>
</div>
</main>
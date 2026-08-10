<main className="flex-1 md:ml-64 p-margin-mobile md:p-margin-desktop overflow-y-auto">
{/* Page Header */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
<div>
<h1 className="font-headline-lg-mobile md:font-display-xl text-headline-lg-mobile md:text-display-xl text-primary font-black neon-text-primary tracking-tighter uppercase">Product Catalog Manager</h1>
<p className="font-code-sm text-code-sm text-on-surface-variant mt-2 opacity-80">&gt; SYS.MSG: MANAGE_INVENTORY_MATRIX</p>
</div>
<button className="bg-[#FF0055] text-white font-title-md text-title-md py-4 px-8 rounded-DEFAULT neon-glow-primary uppercase transition-all duration-300 hover:scale-105 flex items-center gap-2">
<span className="material-symbols-outlined">add</span>
                    Add Product
                </button>
</div>
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
{/* Section 1: Add New Product Form (Bento Style Layout) */}
<section className="lg:col-span-4 flex flex-col gap-6">
<div className="glass-card rounded-xl p-8 transition-all duration-300 hover:-translate-y-2 relative overflow-hidden group">
{/* Decorative glow element */}
<div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mb-8 border-b border-white/10 pb-4">&gt; ADD_NEW_PRODUCT_</h2>
<form className="flex flex-col gap-6">
<div>
<label className="terminal-label text-code-sm">PRODUCT_NAME</label>
<input className="terminal-input" placeholder="e.g. Quantum Accelerator" type="text"/>
</div>
<div className="grid grid-cols-2 gap-4">
<div>
<label className="terminal-label text-code-sm">SKU_ID</label>
<input className="terminal-input tabular-nums" placeholder="Q-ACC-001" type="text"/>
</div>
<div>
<label className="terminal-label text-code-sm">PRICE_CREDITS</label>
<input className="terminal-input tabular-nums" placeholder="2999.00" type="number"/>
</div>
</div>
<div>
<label className="terminal-label text-code-sm">CATEGORY</label>
<select className="terminal-input bg-transparent text-primary appearance-none cursor-pointer">
<option className="bg-surface text-primary" value="hardware">Hardware</option>
<option className="bg-surface text-primary" value="software">Software</option>
<option className="bg-surface text-primary" value="gear">Tactical Gear</option>
</select>
</div>
<div>
<label className="terminal-label text-code-sm">DESCRIPTION_DATA</label>
<textarea className="terminal-input resize-none h-24" placeholder="Enter specifications..."></textarea>
</div>
{/* Image Upload Drag & Drop */}
<div className="mt-4 border-2 border-dashed border-primary/40 rounded-lg p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all duration-300">
<span className="material-symbols-outlined text-4xl text-primary mb-2 opacity-80" data-weight="fill">cloud_upload</span>
<span className="font-code-sm text-code-sm text-primary mb-1">DRAG &amp; DROP ASSETS</span>
<span className="font-code-sm text-[12px] text-on-surface-variant opacity-60">or click to browse local matrix</span>
</div>
<button className="mt-4 border border-primary text-primary font-code-sm text-code-sm py-3 rounded-DEFAULT hover:bg-primary/10 transition-colors uppercase tracking-wider w-full" type="button">
                                INITIALIZE_UPLOAD
                            </button>
</form>
</div>
</section>
{/* Section 2: Product Catalog Data Table */}
<section className="lg:col-span-8">
<div className="glass-card rounded-xl overflow-hidden h-full flex flex-col min-h-[600px]">
<div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#171717]/80">
<h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">&gt; ACTIVE_INVENTORY_</h2>
{/* Search / Filter minimalist representation */}
<div className="flex gap-4">
<div className="relative border-b border-white/20 pb-1 flex items-center">
<span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
<input className="bg-transparent border-none p-0 text-code-sm font-code-sm text-primary focus:ring-0 w-32 md:w-48 placeholder-white/30" placeholder="QUERY_DB..." type="text"/>
</div>
<button className="text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined">filter_list</span></button>
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
<th className="p-4 font-medium text-center">Status</th>
<th className="p-4 pr-6 text-right font-medium">Command</th>
</tr>
</thead>
<tbody className="font-code-sm text-code-sm divide-y divide-white/5">
{/* Row 1 */}
<tr className="table-row-hover bg-transparent">
<td className="p-4 pl-6">
<div className="w-12 h-12 rounded bg-surface border border-white/10 overflow-hidden">
<img alt="Item Image" className="object-cover w-full h-full" data-alt="A glowing neon cyan tech gadget resembling a cybernetic eye implant. Set against a dark metallic grid background. High contrast, sharp focus, 3d render style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvRE_JXEWiPJoiPwnp9Gwfd7AnLKpY4GJZI4l-7TgVZ3rIAEUTo-nj28Bmvvg3vvmNSZ1D0eH546sTyt4_9u-S_2kaeeRPpOhc4MXcJY0jJ3IAdra4qbYeQO4gqhRpSPbm6XOZ5L9WRAU87P39yz73C-_qtw1nVO9Rq7Wt4FLWqWYMDi9hQ3c0RQI3y61aaV6UO5OPykg3AF8qTCyI8AHlNMQKg4LuKp4VLhYnf5PTQWS8hRXP41EvY7IGQgEMEJNDr4ljRmkUHxs"/>
</div>
</td>
<td className="p-4 font-bold text-on-surface">Neural Interface V3</td>
<td className="p-4 text-on-surface-variant tabular-nums">NI-300-X</td>
<td className="p-4 text-on-surface-variant">Hardware</td>
<td className="p-4 text-right text-secondary-fixed tabular-nums font-bold">1,450.00</td>
<td className="p-4 text-center">
<span className="inline-block px-2 py-1 rounded text-[10px] border border-secondary-fixed text-secondary-fixed bg-secondary-fixed/10 uppercase tracking-wider">Optimal</span>
</td>
<td className="p-4 pr-6 text-right">
<button className="text-on-surface-variant hover:text-primary mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-on-surface-variant hover:text-error mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</td>
</tr>
{/* Row 2 */}
<tr className="table-row-hover bg-transparent">
<td className="p-4 pl-6">
<div className="w-12 h-12 rounded bg-surface border border-white/10 overflow-hidden">
<img alt="Item Image" className="object-cover w-full h-full" data-alt="A sleek black datapad with glowing red text on screen. Floating slightly above a dark surface. Cyberpunk aesthetic, moody lighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZMPqnxRNtxysCwZ4lQpOiLJysQ2RXaLuj2IcaIBUI30GatoB8gZgF3FQ3hKg5Vp5E8W5qeiNR9wZJZadrKKBpPkoumwVuTTICt00w297pfJt-FfEM17FxnrhU7jGsg49yqefchA6R6ZeXYvD2DLKkYuzSfsr659ARhfw4TYtSxkNXAzUNBO4Bfkg2TH8SIDgN6OvwRzJU6hVPcushZJ_Th4kjEA98cv2hXWsfoDUcgOy25bI4xSX5luwO6B5JiZHBsGOwCkiL3MY"/>
</div>
</td>
<td className="p-4 font-bold text-on-surface">Stealth Datapad</td>
<td className="p-4 text-on-surface-variant tabular-nums">SD-001-B</td>
<td className="p-4 text-on-surface-variant">Gear</td>
<td className="p-4 text-right text-secondary-fixed tabular-nums font-bold">899.99</td>
<td className="p-4 text-center">
<span className="inline-block px-2 py-1 rounded text-[10px] border border-primary text-primary bg-primary/10 uppercase tracking-wider neon-text-primary">Low Stock</span>
</td>
<td className="p-4 pr-6 text-right">
<button className="text-on-surface-variant hover:text-primary mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-on-surface-variant hover:text-error mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</td>
</tr>
{/* Row 3 */}
<tr className="table-row-hover bg-transparent opacity-60">
<td className="p-4 pl-6">
<div className="w-12 h-12 rounded bg-surface border border-white/10 overflow-hidden relative">
<div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
<span className="material-symbols-outlined text-white/50 text-sm">block</span>
</div>
<img alt="Item Image" className="object-cover w-full h-full grayscale" data-alt="A mechanical combat glove, heavily weathered and damaged. Dark muted colors, industrial cyberpunk style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCiehT21hQbi8w3T8QmTQIGHgQ7_Kmx5aG9HNjMf393h9i428kj-GP8wBVMi30WxxhX6gC-gGTXDTtM3kfNML-UC-Y1-MQCuqv6sp-jWcRxV-rpansYQD3BpHIfv_eKtfHTeE72s-R3NhAx433PuOyzZAVUHWizFLam1MnaeS-crkLkTmyJWLAuk68JUIYRW-DmBaCaoCWxk-mJHurpfxZHbtuGuT_x59qsgx76yIc_l7xzQHo4V1q47sz32B8blRvOJ6RIPC-FMKA"/>
</div>
</td>
<td className="p-4 font-bold text-on-surface line-through">Kinetic Gauntlet</td>
<td className="p-4 text-on-surface-variant tabular-nums">KG-225-O</td>
<td className="p-4 text-on-surface-variant">Gear</td>
<td className="p-4 text-right text-secondary-fixed tabular-nums font-bold">3,200.00</td>
<td className="p-4 text-center">
<span className="inline-block px-2 py-1 rounded text-[10px] border border-white/20 text-white/40 bg-white/5 uppercase tracking-wider">Depleted</span>
</td>
<td className="p-4 pr-6 text-right">
<button className="text-on-surface-variant hover:text-primary mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-on-surface-variant hover:text-error mx-1 transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</td>
</tr>
</tbody>
</table>
</div>
{/* Table Pagination / Footer */}
<div className="p-4 border-t border-white/10 bg-[#171717] flex justify-between items-center text-code-sm text-on-surface-variant">
<span>SHOWING 01-03 OF 1,492 ENTRIES</span>
<div className="flex gap-2">
<button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">&lt; PREV</button>
<button className="px-3 py-1 border border-primary text-primary bg-primary/10 rounded transition-colors">01</button>
<button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">02</button>
<button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">03</button>
<button className="px-3 py-1 border border-white/10 hover:bg-white/5 rounded transition-colors">NEXT &gt;</button>
</div>
</div>
</div>
</section>
</div>
</main>
<main className="flex-1 ml-0 md:ml-64 flex flex-col relative h-full overflow-y-auto">
<div className="max-w-[1200px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex flex-col gap-16">
{/* 1. Header Section */}
<header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/10 pb-8 relative">
<div className="relative z-10">
<p className="font-code-sm text-code-sm text-primary mb-2 opacity-70">&gt; SYS_COM // DASHBOARD // OFFERS</p>
<h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-black text-on-surface uppercase tracking-tighter drop-shadow-lg">
                            ACTIVE_OFFERS_<br/>MANAGEMENT
                        </h1>
</div>
<button className="group relative inline-flex items-center justify-center bg-inverse-primary text-white font-code-sm text-code-sm uppercase px-8 py-5 tracking-widest overflow-hidden transition-all duration-300 hover:scale-105 neon-shadow-primary neon-shadow-primary-hover border border-white/20">
<span className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
<span className="relative z-10 flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">add</span>
                            CREATE_NEW_OFFER
                        </span>
</button>
</header>
{/* 2. Create Offer Form (Terminal Style) */}
<section className="relative group">
{/* Glass Frame */}
<div className="absolute inset-0 bg-surface-container-low/80 backdrop-blur-xl border border-inverse-primary/20 rounded-lg pointer-events-none transition-colors duration-500 group-hover:border-inverse-primary/40"></div>
<div className="relative z-10 p-8 md:p-12 flex flex-col gap-10">
<div className="flex items-center gap-3 border-b border-white/10 pb-4">
<span className="material-symbols-outlined text-primary">terminal</span>
<h3 className="font-code-sm text-code-sm text-primary tracking-widest uppercase">Input Sequence Required</h3>
</div>
<form className="flex flex-col gap-8 w-full max-w-2xl font-code-sm text-code-sm">
{/* Field: Title */}
<div className="flex flex-col gap-2">
<label className="text-on-surface-variant flex items-center gap-2" htmlFor="offer_title">
<span className="text-primary">&gt;</span> OFFER_TITLE_
                                </label>
<input className="bg-transparent border-0 border-b-2 border-surface-variant text-on-surface focus:ring-0 focus:border-inverse-primary py-3 px-0 w-full placeholder:text-surface-variant placeholder:opacity-50 transition-colors" id="offer_title" placeholder="ENTER ALPHANUMERIC DESIGNATION..." type="text"/>
</div>
{/* Field: Product Select */}
<div className="flex flex-col gap-2">
<label className="text-on-surface-variant flex items-center gap-2" htmlFor="linked_product">
<span className="text-primary">&gt;</span> LINKED_PRODUCT_
                                </label>
<select className="bg-surface-container border-0 border-b-2 border-surface-variant text-on-surface focus:ring-0 focus:border-inverse-primary py-3 px-0 w-full appearance-none transition-colors cursor-pointer" id="linked_product">
<option className="text-surface-variant" disabled="" selected="" value="">SELECT TARGET ASSET...</option>
<option value="p1">Neon Nexus Pass (Season 1)</option>
<option value="p2">Elite Core Activation Key</option>
<option value="p3">Void cosmetic bundle</option>
</select>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
{/* Field: Discount */}
<div className="flex flex-col gap-2">
<label className="text-on-surface-variant flex items-center gap-2" htmlFor="discount_value">
<span className="text-primary">&gt;</span> DISCOUNT_VALUE_
                                    </label>
<div className="relative">
<span className="absolute left-0 top-1/2 -translate-y-1/2 text-on-surface-variant">%</span>
<input className="bg-transparent border-0 border-b-2 border-surface-variant text-on-surface focus:ring-0 focus:border-inverse-primary py-3 pl-6 pr-0 w-full placeholder:text-surface-variant placeholder:opacity-50 transition-colors" id="discount_value" placeholder="00.00" type="number"/>
</div>
</div>
{/* Field: Date */}
<div className="flex flex-col gap-2">
<label className="text-on-surface-variant flex items-center gap-2" htmlFor="valid_until">
<span className="text-primary">&gt;</span> VALID_UNTIL_
                                    </label>
<input className="bg-transparent border-0 border-b-2 border-surface-variant text-on-surface focus:ring-0 focus:border-inverse-primary py-3 px-0 w-full transition-colors opacity-80 focus:opacity-100 color-scheme-dark" id="valid_until" type="date"/>
</div>
</div>
{/* Form CTA */}
<div className="mt-4 flex justify-end">
<button className="group flex items-center gap-3 bg-white/5 border border-white/10 px-6 py-4 hover:bg-white/10 hover:border-inverse-primary/50 transition-all duration-300 hover:-translate-y-1" type="button">
<span className="font-code-sm text-code-sm uppercase tracking-widest text-on-surface group-hover:text-primary transition-colors">INITIALIZE_OFFER_PROTOCOL</span>
<span className="material-symbols-outlined text-primary group-hover:translate-x-2 transition-transform">arrow_forward</span>
</button>
</div>
</form>
</div>
</section>
{/* 3. Offers Data Table */}
<section className="flex flex-col gap-6">
<div className="flex items-center justify-between border-b border-white/10 pb-4">
<h3 className="font-code-sm text-code-sm text-primary tracking-widest uppercase flex items-center gap-2">
<span className="material-symbols-outlined">dataset</span>
                            DATABASE_QUERY_RESULTS
                        </h3>
<span className="text-on-surface-variant text-xs opacity-60">Showing active entries</span>
</div>
{/* Custom Table Structure (Div based for floating rows) */}
<div className="w-full flex flex-col gap-4 font-code-sm text-[13px]">
{/* Header Row */}
<div className="grid grid-cols-6 gap-4 px-6 py-3 text-on-surface-variant uppercase tracking-widest border-b border-white/5 mb-2">
<div className="col-span-1">OFFER_ID</div>
<div className="col-span-2">PRODUCT</div>
<div className="col-span-1">DISCOUNT</div>
<div className="col-span-1">VALID_UNTIL</div>
<div className="col-span-1 text-right">STATUS/ACT</div>
</div>
{/* Data Row 1 (LIVE) */}
<div className="grid grid-cols-6 gap-4 items-center px-6 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded transition-all duration-300 hover:-translate-y-2 hover:backdrop-blur-xl hover:bg-white/10 hover:border-inverse-primary/30 group">
<div className="col-span-1 text-primary">#NX-001A</div>
<div className="col-span-2 text-on-surface truncate pr-4">Neon Nexus Pass (Season 1)</div>
<div className="col-span-1 text-on-surface font-bold">25.00%</div>
<div className="col-span-1 text-on-surface-variant">2024-12-31</div>
<div className="col-span-1 flex justify-end items-center gap-4">
<span className="border border-secondary-container text-secondary-container px-2 py-1 text-[10px] tracking-widest uppercase shadow-[0_0_10px_rgba(0,238,252,0.2)] bg-secondary-container/10">LIVE</span>
<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-on-surface-variant hover:text-inverse-primary transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</div>
</div>
</div>
{/* Data Row 2 (EXPIRED) */}
<div className="grid grid-cols-6 gap-4 items-center px-6 py-5 bg-black/40 backdrop-blur-sm border border-white/5 rounded transition-all duration-300 hover:-translate-y-1 hover:border-white/10 group opacity-70">
<div className="col-span-1 text-surface-variant">#NX-000B</div>
<div className="col-span-2 text-surface-variant truncate pr-4">Early Access Core Module</div>
<div className="col-span-1 text-surface-variant">50.00%</div>
<div className="col-span-1 text-surface-variant">2024-01-15</div>
<div className="col-span-1 flex justify-end items-center gap-4">
<span className="border border-surface-variant text-surface-variant px-2 py-1 text-[10px] tracking-widest uppercase bg-black">EXPIRED</span>
<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-surface-variant hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-surface-variant hover:text-inverse-primary transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</div>
</div>
</div>
{/* Data Row 3 (LIVE) */}
<div className="grid grid-cols-6 gap-4 items-center px-6 py-5 bg-white/5 backdrop-blur-md border border-white/10 rounded transition-all duration-300 hover:-translate-y-2 hover:backdrop-blur-xl hover:bg-white/10 hover:border-inverse-primary/30 group">
<div className="col-span-1 text-primary">#VX-992C</div>
<div className="col-span-2 text-on-surface truncate pr-4">Void Cosmetic Bundle</div>
<div className="col-span-1 text-on-surface font-bold">10.00%</div>
<div className="col-span-1 text-on-surface-variant">2024-08-01</div>
<div className="col-span-1 flex justify-end items-center gap-4">
<span className="border border-secondary-container text-secondary-container px-2 py-1 text-[10px] tracking-widest uppercase shadow-[0_0_10px_rgba(0,238,252,0.2)] bg-secondary-container/10">LIVE</span>
<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
<button className="text-on-surface-variant hover:text-white transition-colors"><span className="material-symbols-outlined text-[18px]">edit</span></button>
<button className="text-on-surface-variant hover:text-inverse-primary transition-colors"><span className="material-symbols-outlined text-[18px]">delete</span></button>
</div>
</div>
</div>
</div>
</section>
</div>
</main>
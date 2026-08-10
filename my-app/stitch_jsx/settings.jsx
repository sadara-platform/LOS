<main className="flex-1 md:ml-64 pt-[88px] min-h-screen flex items-center justify-center p-gutter relative">
{/* Decorative Background Element */}
<div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center opacity-20">
<div className="w-[800px] h-[800px] rounded-full bg-[#FF0055] blur-[150px] mix-blend-screen opacity-10 translate-y-1/4"></div>
</div>
<div className="w-full max-w-3xl glass-panel rounded-xl p-8 md:p-12 z-10 transition-all duration-500 hover:bg-white/10">
<div className="mb-10 text-center">
<h1 className="font-display-xl text-[32px] md:text-[48px] font-black text-on-surface tracking-tighter uppercase mb-2">BRAND_PROFILE_V2</h1>
<div className="w-24 h-1 bg-[#FF0055] mx-auto rounded-full neon-shadow"></div>
</div>
<form className="flex flex-col gap-8">
<div className="flex flex-col gap-2">
<label className="font-code-sm text-code-sm text-[#FF0055] flex items-center gap-2 opacity-80" htmlFor="brandDesc">
<span className="text-on-surface-variant/50">01</span> &gt; BRAND_DESCRIPTION_
                    </label>
<textarea className="terminal-input w-full font-code-sm text-code-sm p-4 resize-none transition-all duration-300 focus:bg-white/5 rounded-t-lg" id="brandDesc" placeholder="Enter system configuration parameters..." rows="5"></textarea>
</div>
<div className="flex flex-col gap-2">
<label className="font-code-sm text-code-sm text-[#FF0055] flex items-center gap-2 opacity-80" htmlFor="contactPhone">
<span className="text-on-surface-variant/50">02</span> &gt; COMM_LINK_
                    </label>
<input className="terminal-input w-full font-code-sm text-code-sm p-4 transition-all duration-300 focus:bg-white/5 rounded-t-lg" id="contactPhone" placeholder="+1 (000) 000-0000" type="tel"/>
</div>
<div className="mt-8 flex justify-center">
<button className="bg-[#FF0055] text-white font-headline-lg text-[20px] md:text-[24px] uppercase tracking-wider py-[20px] px-[60px] rounded-DEFAULT neon-shadow neon-shadow-hover transition-all duration-300 font-bold active:scale-95 flex items-center gap-3" type="button">
                        SAVE_CHANGES <span className="material-symbols-outlined">save</span>
</button>
</div>
</form>
</div>
</main>
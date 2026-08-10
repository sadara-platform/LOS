<main className="flex-1 ml-0 md:ml-64 pt-[100px] md:pt-[120px] px-margin-mobile md:px-margin-desktop pb-[120px] min-h-screen flex flex-col relative z-10">
{/* Header */}
<header className="mb-[80px]">
<h2 className="font-headline-lg-mobile md:font-display-xl text-headline-lg-mobile md:text-display-xl text-on-surface uppercase drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">CONTENT_MANAGEMENT_SYSTEM</h2>
<div className="h-1 w-24 bg-primary mt-6 shadow-[0_0_10px_rgba(255,0,85,0.6)]"></div>
</header>
{/* CMS Form Container */}
<div className="max-w-4xl w-full mx-auto">
<div className="glass-card rounded-xl p-8 md:p-12 relative overflow-hidden group">
{/* Subtle background ambient glow inside card */}
<div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none group-hover:bg-primary/20 transition-colors duration-700"></div>
<div className="relative z-10 flex flex-col gap-[40px]">
{/* Input Block 1 */}
<div className="terminal-input-group">
<label className="terminal-label font-code-sm text-code-sm flex items-center gap-2" htmlFor="hero-headline">
<span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_right">keyboard_arrow_right</span>
                            HERO_HEADLINE_
                        </label>
<textarea className="terminal-input font-code-sm text-[16px] md:text-title-md resize-none overflow-hidden" id="hero-headline" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'" rows="1">BRAND X CHALLENGES YOU!</textarea>
</div>
{/* Input Block 2 */}
<div className="terminal-input-group">
<label className="terminal-label font-code-sm text-code-sm flex items-center gap-2" htmlFor="hero-subtitle">
<span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_right">keyboard_arrow_right</span>
                            HERO_SUBTITLE_
                        </label>
<textarea className="terminal-input font-code-sm text-[16px] md:text-title-md resize-none overflow-hidden" id="hero-subtitle" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'" rows="2">Activate your elite digital credentials and step into the arena. The void waits for no one.</textarea>
</div>
{/* Input Block 3 */}
<div className="terminal-input-group">
<label className="terminal-label font-code-sm text-code-sm flex items-center gap-2" htmlFor="footer-text">
<span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_right">keyboard_arrow_right</span>
                            FOOTER_TEXT_
                        </label>
<textarea className="terminal-input font-code-sm text-[16px] md:text-title-md resize-none overflow-hidden" id="footer-text" oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'" rows="1">© 2024 NX x X x LOS // THE VOID REMAINS</textarea>
</div>
</div>
</div>
{/* Action Area */}
<div className="mt-[80px] flex justify-end">
<button className="massive-cta font-headline-lg-mobile text-[24px] md:text-[32px] rounded-DEFAULT group relative overflow-hidden">
<div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out z-0"></div>
<span className="relative z-10 flex items-center gap-3">
                        PUBLISH CHANGES
                        <span className="material-symbols-outlined font-bold" data-icon="upload">upload</span>
</span>
</button>
</div>
</div>
</main>
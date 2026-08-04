import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Instagram, Twitter, ShieldCheck, Sparkles, Search, Plus, Minus, X, Star, Menu, Heart, ChevronRight, Info, Send, Check, TrendingUp, Sliders, Maximize2 } from 'lucide-react';

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
);
const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
);

// Product Catalog corresponding strictly to the LOS brand identity shown in the image
interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  category: string;
  image: string;
  description: string;
  specs: string[];
}

interface BrandData {
  name: string;
  themeColor: string;
  secondaryColor: string;
  accentColor: string;
  bgColor: string;
  surfaceColor: string;
  textPrimary: string;
  textSecondary: string;
  themeMode: string;
  logoUrl?: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'prod-daty',
    name: 'DATY TACTICAL UTILITY VEST',
    sku: 'DV-95E9',
    price: 145,
    category: 'Vests & Straps',
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=800',
    description: 'An avant-garde technical chest rig built for high-utility styling. Features heavy-duty ballistic webbing, modular magnetic quick-release cobra buckles, and waterproof zip utility pockets.',
    specs: ['1000D Ballistic Cordura', 'Dual asymmetric magnetic buckles', 'Waterproof zippers & nylon lining', 'Laser-cut Molle attachment system']
  },
  {
    id: 'prod-nasy',
    name: 'NASY NEON TRACK CARGO PANTS',
    sku: 'NT-3845',
    price: 135,
    category: 'Pants',
    image: 'https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?q=80&w=800',
    description: 'Techwear cargo trousers engineered with fluorescent neon cybernetic stitching and geometric pocket flaps. Adjustable ankle shock-cords allow for customizable styling from wide-leg to jogger drapes.',
    specs: ['High-tensile ripstop tech fabric', 'Double-stitched fluorescent embroidery', 'Secure multi-cargo pockets', 'Ergonomic articulated knees']
  },
  {
    id: 'prod-nary',
    name: 'NARY OVERSIZED SEAM HOODIE',
    sku: 'NH-SE3P',
    price: 120,
    category: 'Hoodies',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800',
    description: 'Premium heavyweight silhouette meticulously crafted from 480GSM organic French terry cotton. Styled with distressed raw-edge shoulder seams, a deep unstructured hood, and technical crimson cord locks.',
    specs: ['480GSM Ultra-heavy French terry', 'Signature red toggle cord locks', 'Raw-distressed aesthetic seams', 'Pre-shrunk vintage carbon wash']
  },
  {
    id: 'prod-shield',
    name: 'LOS THERMAL SHIELD PARKA',
    sku: 'SP-1092',
    price: 189,
    category: 'Outerwear',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800',
    description: 'Wind-resistant and moisture-repelling longline utility jacket featuring a modular harness sling strap and a fully detachable hood with a wire-reinforced brim.',
    specs: ['DWR-coated nylon shell', 'Integrated elastic internal harness sling', 'Matte black metal fasteners', 'Asymmetrical protective zip shield']
  },
  {
    id: 'prod-tee',
    name: 'DISTRESSED CORE STENCIL TEE',
    sku: 'ST-0012',
    price: 65,
    category: 'T-Shirts',
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800',
    description: 'A relaxed midweight combed cotton tee washed down to a vintage faded grey/black tone. Finished with raw-cut hems and a subtle white stencil brand graphic printed on the chest.',
    specs: ['240GSM combed jersey cotton', 'Acid-faded vintage black wash', 'Raw-cut double-stitch hem', 'Water-based non-cracking print']
  },
  {
    id: 'prod-belt',
    name: 'CYBERPUNK INDUSTRIAL COBRA BELT',
    sku: 'CB-4552',
    price: 45,
    category: 'Accessories',
    image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=800',
    description: 'High-strength industrial safety belt constructed with heavy-duty structural webbing and an authentic quick-release matte steel cobra buckle finished with a bold red woven tag.',
    specs: ['Military-spec heavy webbing', 'Matte steel quick-release cobra buckle', 'Subtle woven red brand tag', 'One-size infinite adjustment']
  }
];

interface CartItem {
  product: Product;
  size: string;
  quantity: number;
}

export default function BrandActivationPage() {
  const { brandId: slug } = useParams();
  const [brandData, setBrandData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Fetch brand data from real backend
  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setIsLoading(true);
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
        
        // Use PostgREST syntax to query by slug
        const response = await fetch(`${supabaseUrl}/rest/v1/brands?slug=eq.${slug}`, {
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Brand not found');
        }
        
        const data = await response.json();
        if (data.length === 0) {
           throw new Error('Brand not found');
        }
        
        // Map DB columns to our component state
        const dbBrand = data[0];
        setBrandData({
          name: dbBrand.name,
          themeColor: dbBrand.primary_color,
          secondaryColor: dbBrand.secondary_color || '#ffffff',
          accentColor: dbBrand.accent_color || '#1e1e1e',
          bgColor: dbBrand.bg_color || '#0A0A0A',
          surfaceColor: dbBrand.surface_color || '#141414',
          textPrimary: dbBrand.text_primary || '#FFFFFF',
          textSecondary: dbBrand.text_secondary || '#71717A',
          themeMode: dbBrand.theme_mode || 'dark',
          logoUrl: dbBrand.logo_url
        });
      } catch (err) {
        setFetchError('Brand not found or offline.');
      } finally {
        setIsLoading(false);
      }
    };
    if (slug) fetchBrandData();
  }, [slug]);

  // Application UI states
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Custom Client-Side Theme Toggle
  const [isClientDarkMode, setIsClientDarkMode] = useState<boolean | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCollectionTab, setActiveCollectionTab] = useState('ALL');
  
  // AI Styling States
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChatResponse, setAiChatResponse] = useState<string>('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Active Hero State
  const [activeHeroLook, setActiveHeroLook] = useState(0);

  // Load cart & wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('los_cart');
    const savedWishlist = localStorage.getItem('los_wishlist');
    if (savedCart) setCart(JSON.parse(savedCart));
    if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
  }, []);

  // Sync to localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('los_cart', JSON.stringify(newCart));
  };

  const saveWishlistToStorage = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    localStorage.setItem('los_wishlist', JSON.stringify(newWishlist));
  };

  // Cart operations
  const addToCart = (product: Product, size: string, quantity: number = 1) => {
    const existingIndex = cart.findIndex(item => item.product.id === product.id && item.size === size);
    let newCart = [...cart];
    if (existingIndex > -1) {
      newCart[existingIndex].quantity += quantity;
    } else {
      newCart.push({ product, size, quantity });
    }
    saveCartToStorage(newCart);
    setIsCartOpen(true);
  };

  const updateQuantity = (index: number, delta: number) => {
    let newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity <= 0) {
      newCart.splice(index, 1);
    }
    saveCartToStorage(newCart);
  };

  const removeFromCart = (index: number) => {
    let newCart = [...cart];
    newCart.splice(index, 1);
    saveCartToStorage(newCart);
  };

  const toggleWishlist = (productId: string) => {
    const newWishlist = wishlist.includes(productId)
      ? wishlist.filter(id => id !== productId)
      : [...wishlist, productId];
    saveWishlistToStorage(newWishlist);
  };

  // Submit query to server style advisor endpoint
  const handleAskAI = async (customPrompt?: string) => {
    const query = customPrompt || aiPrompt;
    if (!query.trim()) return;

    setIsAiLoading(true);
    setAiPrompt('');
    
    // Set a smooth starting message
    setAiChatResponse('Consulting LOS archives & detailing the silhouette...');

    try {
      const response = await fetch('/api/style-advisor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: query })
      });
      const data = await response.json();
      if (data.text) {
        setAiChatResponse(data.text);
      } else {
        setAiChatResponse('Unable to retrieve stylist guide. Try again later.');
      }
    } catch (err) {
      console.error(err);
      setAiChatResponse('Styling database is currently offline. Please review our premium lookbooks below.');
    } finally {
      setIsAiLoading(false);
    }
  };

  // Quick prompt triggers for AI Styling section
  const QUICK_PROMPTS = [
    'Layer the Utility Tactical Vest for winter',
    'Recommend an oversized grunge streetwear outfit',
    'How do I fit the Neon Track Pants for high-top sneakers?'
  ];

  // Filters for collections grid
  const filteredProducts = activeCollectionTab === 'ALL'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category.toUpperCase().includes(activeCollectionTab) || p.name.toUpperCase().includes(activeCollectionTab));

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-brand-light space-y-4">
        <div className="w-12 h-12 border-4 border-white/10 border-t-brand-red rounded-full animate-spin"></div>
        <p className="text-sm tracking-widest text-brand-muted uppercase animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  if (fetchError || !brandData) {
    return (
      <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center text-brand-light space-y-6">
        <div className="text-brand-red mb-4">
           <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-center">System Offline</h1>
        <p className="text-brand-muted tracking-wide max-w-md text-center">This portal does not exist or has been suspended. Verify the URL slug.</p>
      </div>
    );
  }

  const currentMode = isClientDarkMode !== null 
    ? (isClientDarkMode ? 'dark' : 'light') 
    : (brandData?.themeMode || 'dark');

  const isSwapped = currentMode !== brandData?.themeMode;

  const themeVars = {
    '--brand-theme-color': brandData?.themeColor,
    '--brand-secondary': brandData?.secondaryColor,
    '--brand-accent': brandData?.accentColor,
    '--brand-bg': isSwapped ? brandData?.textPrimary : brandData?.bgColor,
    '--brand-surface': isSwapped ? brandData?.textSecondary : brandData?.surfaceColor,
    '--brand-text': isSwapped ? brandData?.bgColor : brandData?.textPrimary,
    '--brand-text-muted': isSwapped ? brandData?.surfaceColor : brandData?.textSecondary,
  } as React.CSSProperties;

  return (
    <div 
      className={`min-h-screen font-sans selection:bg-brand-red selection:text-white bg-brand-bg text-brand-text`}
      style={themeVars}
    >
      
      {/* 1. TOP BAR */}
      <div className="bg-brand-charcoal text-[11px] tracking-widest uppercase border-b border-white/5 py-2.5 px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="text-brand-muted font-light">Living True Details Happy // {brandData?.name || 'LOS'}</div>
        <div className="font-semibold text-brand-light flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-ping"></span>
          FOR DEDICATED REBELS // SECURE GLOBAL EXPRESS SHIPPING
        </div>
        <div className="flex items-center gap-4 text-brand-muted">
          <span className="text-white/10">|</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-1 hover:text-brand-light transition-colors text-brand-light relative"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-brand-red" />
            <span className="font-semibold tracking-normal font-display">CART ({totalCartItems})</span>
          </button>
        </div>
      </div>

      {/* 2. MAIN HEADER / NAVIGATION */}
      <header className="sticky top-0 z-40 bg-brand-dark/95 backdrop-blur-md border-b border-white/5 px-4 md:px-8 py-4 flex justify-between items-center transition-all">
        <div className="flex items-center gap-2">
          {/* Logo matches exact condensed editorial style of LOS */}
          {brandData?.logoUrl ? (
            <img src={brandData.logoUrl} alt={brandData.name} className="h-10 object-contain" />
          ) : (
            <a href="#" className="text-3xl md:text-4xl font-display font-bold tracking-tighter text-brand-light hover:text-brand-red transition-colors">
              {brandData?.name || 'LOS'}
            </a>
          )}
        </div>

        {/* Desktop Menu */}
        <nav className="hidden lg:flex items-center gap-8 text-[13px] font-semibold tracking-widest uppercase text-brand-muted">
          <a href="#" className="text-brand-light hover:text-brand-red transition-colors border-b border-brand-red pb-0.5">Home</a>
          <a href="#shop-now" className="hover:text-brand-light transition-colors">Shop</a>
          <a href="#collections" className="hover:text-brand-light transition-colors">Collections</a>
          <a href="#ai-stylist" className="hover:text-brand-accent transition-colors flex items-center gap-1.5 text-brand-light bg-brand-accent/10 px-3 py-1.5 rounded-full border border-brand-accent/20">
            <Sparkles className="w-3 h-3 text-brand-accent" />
            STYLING AI
          </a>
          <a href="#footer" className="hover:text-brand-light transition-colors">About</a>
          <a href="#footer" className="hover:text-brand-light transition-colors">Blog</a>
        </nav>

        {/* Right Nav Utilities */}
        <div className="flex items-center gap-4">
          <div className="relative flex items-center">
            {isSearchOpen && (
              <input 
                type="text" 
                placeholder="SEARCH ARCHIVE..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-brand-surface border border-white/10 text-xs text-brand-text rounded-md px-3 py-1.5 w-40 md:w-56 focus:outline-none focus:border-brand-red/50 uppercase tracking-wider mr-2 font-display"
              />
            )}
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-brand-muted hover:text-brand-text transition-colors"
              aria-label="Toggle Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setIsClientDarkMode(currentMode === 'light')}
            className="p-2 text-brand-muted hover:text-brand-text transition-colors"
            aria-label="Toggle Theme"
          >
            {currentMode === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>

          <button 
            onClick={() => {
              const el = document.getElementById('ai-stylist');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="hidden sm:flex items-center gap-1.5 bg-brand-accent text-brand-dark text-[12px] font-bold tracking-widest uppercase px-4 py-2 rounded-full hover:opacity-90 hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            STYLING AI
          </button>

          <button 
            onClick={() => setIsCartOpen(true)}
            className="p-2 text-brand-muted hover:text-brand-light transition-colors relative"
            aria-label="Open Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-brand-light" />
            {totalCartItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-secondary text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center font-display border border-brand-dark">
                {totalCartItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION (With exact grey curved backgrounds & layering from photo) */}
      <section className="relative overflow-hidden pt-8 pb-20 px-4 md:px-8 bg-brand-dark">
        
        {/* Curved, Grey Elegant Container Mocking Image Fluid Frame */}
        <div className="max-w-7xl mx-auto bg-brand-charcoal border border-white/5 rounded-[40px] md:rounded-[80px] p-6 md:p-12 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-12 min-h-[580px]">
          
          {/* Subtle Cybernetic Red Backlight Glow */}
          <div className="absolute top-1/4 -right-20 w-80 h-80 bg-brand-red/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-brand-red/5 rounded-full blur-3xl pointer-events-none"></div>

          {/* BACKGROUND TEXT BEHIND MODEL */}
          <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none select-none opacity-[0.04] md:opacity-[0.07] z-0">
            <h1 className="text-[12vw] font-display font-bold leading-none tracking-tighter text-brand-secondary">STRETEAT</h1>
            <h2 className="text-[10vw] font-display font-light leading-none tracking-widest text-brand-accent">SELVING</h2>
          </div>

          {/* Left Editorial Info Block */}
          <div className="w-full lg:w-5/12 z-10 space-y-6 text-left relative">
            <div className="inline-flex items-center gap-2 bg-brand-secondary/10 border border-brand-secondary/25 px-4 py-1 rounded-full">
              <span className="w-1.5 h-1.5 bg-brand-secondary rounded-full animate-pulse"></span>
              <span className="text-[10px] tracking-widest font-bold uppercase text-brand-secondary font-display">NEW EXPANSION 03.1</span>
            </div>
            
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight tracking-tight uppercase">
              STRETEAT <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-muted">SELVING</span>
            </h3>

            <p className="text-sm md:text-base text-brand-muted font-light leading-relaxed max-w-md">
              The boundaries of modern streetwear are pure attitude, industrial geometry, and high-performance utility. Discover our new capsule release crafted with heavy fabrics and modular detailing.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a 
                href="#shop-now" 
                className="bg-brand-red text-white text-[13px] font-bold tracking-widest uppercase px-8 py-3.5 rounded-full hover:bg-brand-red/90 hover:shadow-lg hover:shadow-brand-red/25 transition-all flex items-center gap-2"
              >
                EXPLORE CAPSULE
                <ArrowRight className="w-4 h-4" />
              </a>
              <button 
                onClick={() => {
                  const el = document.getElementById('ai-stylist');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-transparent border border-brand-secondary/40 hover:border-brand-secondary text-brand-light hover:text-brand-secondary text-[13px] font-bold tracking-widest uppercase px-6 py-3.5 rounded-full transition-all flex items-center gap-2"
              >
                AI STYLIST CONSULT
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Fashion Model Image Container (Uses droplet-mask visual styling from the photo) */}
          <div className="w-full lg:w-5/12 flex justify-center items-center z-10 relative">
            <div className="relative w-72 h-96 md:w-80 md:h-[480px] bg-brand-gray border border-white/10 rounded-[32px] overflow-hidden shadow-2xl transition-all duration-700 animate-float">
              {/* Dynamic image switching based on look selection */}
              <img 
                src={
                  activeHeroLook === 0 ? PRODUCTS[0].image :
                  activeHeroLook === 1 ? PRODUCTS[1].image :
                  PRODUCTS[2].image
                }
                alt="LOS Premium Model"
                className="w-full h-full object-cover grayscale opacity-90 transition-all duration-500 hover:scale-105"
                referrerPolicy="no-referrer"
              />
              {/* Overlay styling elements */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div className="text-left">
                  <span className="text-[10px] text-brand-red tracking-widest font-bold block uppercase font-display">
                    {activeHeroLook === 0 ? 'LOOK 01' : activeHeroLook === 1 ? 'LOOK 02' : 'LOOK 03'}
                  </span>
                  <span className="text-lg font-display font-bold tracking-wider block text-white uppercase">
                    {activeHeroLook === 0 ? 'DATY UTILITY' : activeHeroLook === 1 ? 'NASY NEON' : 'NARY CORE'}
                  </span>
                </div>
                <button 
                  onClick={() => {
                    const selected = activeHeroLook === 0 ? PRODUCTS[0] : activeHeroLook === 1 ? PRODUCTS[1] : PRODUCTS[2];
                    setSelectedProduct(selected);
                  }}
                  className="bg-brand-red/90 hover:bg-brand-red text-white p-2.5 rounded-full transition-colors group"
                >
                  <Maximize2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Thumbnails / Quick View Switches (Matches bottom right of the hero screenshot) */}
          <div className="hidden xl:flex flex-col gap-4 z-10 justify-center">
            <span className="text-[10px] tracking-widest uppercase text-brand-muted font-bold text-center">SELECT LOOKS</span>
            {[0, 1, 2].map((idx) => (
              <button 
                key={idx}
                onClick={() => setActiveHeroLook(idx)}
                className={`w-14 h-20 rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${activeHeroLook === idx ? 'border-brand-red scale-105' : 'border-white/10 opacity-50'}`}
              >
                <img 
                  src={PRODUCTS[idx].image} 
                  alt={`Look ${idx}`} 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. MID-SECTION ("SOEFGN" Layered Models and Letters from Screenshot) */}
      <section className="bg-brand-dark py-24 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative">
          
          {/* GIANT TITLE ON THE BACKGROUND */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
            <h2 className="text-[14vw] font-display font-black leading-none tracking-tighter text-white opacity-[0.03] select-none uppercase">
              SOEFGN
            </h2>
          </div>

          <div className="mb-16 space-y-4">
            <h3 className="text-3xl md:text-5xl font-display font-bold tracking-widest uppercase">
              SOEFGN CAPSULE
            </h3>
            <p className="text-brand-muted text-xs md:text-sm max-w-md mx-auto font-light">
              High-contrast silhouettes designed to command presence. Engineered with layered weather shields and modular fasteners.
            </p>
          </div>

          {/* THREE MODELS OVERLAPPING (Strictly replication of the 3-model visual grid under SOEFGN in photo) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 z-10 relative">
            {PRODUCTS.slice(0, 3).map((product, idx) => {
              // Custom names shown in screenshot under models: "Nasy Trek / Dem 0.1", "Daty Tlak / Sep 1.3", "Nary Trek / Nov 1.2"
              const mockScreenshotLabel = idx === 0 
                ? { label: 'NASY TREK', sub: 'DEM 0.1' }
                : idx === 1 
                ? { label: 'DATY TLAK', sub: 'SEP 1.3' }
                : { label: 'NARY TREK', sub: 'NOV 1.2' };

              return (
                <div 
                  key={product.id} 
                  className="group relative flex flex-col items-center bg-brand-charcoal/40 border border-white/5 p-4 rounded-3xl transition-all duration-300 hover:border-brand-red/30 hover:bg-brand-charcoal/80"
                >
                  {/* Model Image with layered depth */}
                  <div className="w-full h-[380px] lg:h-[420px] rounded-2xl overflow-hidden bg-brand-gray relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale transition-all duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-transparent to-transparent"></div>
                    
                    {/* Add to Cart Hover overlay */}
                    <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6">
                      <div className="space-y-3">
                        <p className="text-xs text-brand-light line-clamp-2">{product.description}</p>
                        <button 
                          onClick={() => addToCart(product, 'M')}
                          className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold tracking-widest text-[11px] py-2.5 rounded-lg uppercase transition-colors"
                        >
                          ADD QUICK CART
                        </button>
                      </div>
                    </div>

                    {/* Like button absolute */}
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-brand-red transition-all text-brand-light"
                    >
                      <Heart className={`w-4.5 h-4.5 transition-colors ${wishlist.includes(product.id) ? 'fill-brand-red text-brand-red' : 'text-white'}`} />
                    </button>
                  </div>

                  {/* Labeled styling recreating screenshot text: "Nasy Trek / Dem 0.1", etc */}
                  <div className="w-full mt-5 flex justify-between items-center px-1">
                    <div className="text-left">
                      <h4 className="font-display font-bold text-lg tracking-wider text-brand-light leading-none">
                        {mockScreenshotLabel.label}
                      </h4>
                      <span className="text-[10px] text-brand-muted tracking-widest font-semibold uppercase block mt-1">
                        {mockScreenshotLabel.sub}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-brand-red font-bold text-sm block font-display">
                        ${product.price}
                      </span>
                      <button 
                        onClick={() => setSelectedProduct(product)}
                        className="text-[10px] text-brand-muted hover:text-brand-red transition-colors uppercase tracking-widest underline mt-1"
                      >
                        SPECIFICATION
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. "COLLECTIONS" SECTION */}
      <section id="collections" className="bg-brand-charcoal py-24 px-4 md:px-8 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 gap-6">
            <div className="space-y-3">
              <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red">CATEGORIZED SYSTEM</span>
              <h3 className="text-3xl md:text-5xl font-display font-bold tracking-widest uppercase text-white">
                COLLECTIONS
              </h3>
            </div>

            {/* Red accent capsule tabs selector from screenshot */}
            <div className="flex flex-wrap items-center gap-2 bg-brand-dark p-1.5 rounded-full border border-white/5">
              {['ALL', 'VEST', 'HOODIE', 'PANTS', 'ACCESSORIES'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveCollectionTab(tab)}
                  className={`text-[10px] font-bold tracking-widest uppercase px-4 py-2 rounded-full transition-all ${activeCollectionTab === tab ? 'bg-brand-red text-white' : 'text-brand-muted hover:text-brand-light'}`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-brand-dark/40 border border-white/5 rounded-2xl p-4 flex flex-col hover:border-brand-red/20 transition-all group"
              >
                {/* Visual Image container with red product badge from the screenshot (e.g., SE3P with red pill) */}
                <div className="w-full h-72 rounded-xl overflow-hidden bg-brand-gray relative">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Exact red tag overlay reproducing code pills like "SE3P" from image */}
                  <div className="absolute bottom-4 left-4 bg-brand-red text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-md">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></span>
                    <span className="font-display tracking-wider uppercase">{product.sku}</span>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-dark/80 backdrop-blur-md text-brand-light text-[10px] font-bold px-2.5 py-1.5 rounded-md border border-white/10 font-display">
                      ${product.price}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex-grow flex flex-col justify-between space-y-3 text-left">
                  <div>
                    <span className="text-[10px] text-brand-muted uppercase tracking-widest font-semibold">{product.category}</span>
                    <h4 className="text-base font-semibold tracking-wider text-brand-light uppercase line-clamp-1 mt-1 font-display">
                      {product.name}
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-2 pt-2">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="flex-1 text-center bg-brand-gray hover:bg-brand-red text-brand-light hover:text-white text-[11px] font-bold tracking-widest uppercase py-2 rounded-lg border border-white/10 hover:border-brand-red transition-all"
                    >
                      VIEW DESIGN
                    </button>
                    <button 
                      onClick={() => addToCart(product, 'M')}
                      className="bg-brand-red hover:bg-brand-red/90 p-2 rounded-lg text-white hover:scale-105 transition-all"
                      aria-label="Add to Cart"
                    >
                      <Plus className="w-4.5 h-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. INTERACTIVE KATT-AI STYLING ASSISTANT (High functional depth utilizing Gemini API) */}
      <section id="ai-stylist" className="bg-brand-dark py-24 px-4 md:px-8 relative overflow-hidden">
        
        {/* Subtle decorative circles mimicking photographic frame lines */}
        <div className="absolute -top-10 left-10 w-40 h-40 border border-brand-red/10 rounded-full pointer-events-none"></div>
        <div className="absolute -bottom-10 right-10 w-60 h-60 border border-brand-red/5 rounded-full pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative">
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-brand-red/10 border border-brand-red/20 px-4 py-1.5 rounded-full text-brand-red text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              LOS CREATIVE ENGINE
            </div>
            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-widest uppercase text-white">
              KATT-AI STYLING ADVISOR
            </h2>
            <p className="text-brand-muted text-sm max-w-lg mx-auto leading-relaxed">
              Describe your environment, sizing preference, or outfit concept. Our Gemini-powered stylist will compile an elite urban-grunge layering prescription.
            </p>
          </div>

          {/* AI Console UI */}
          <div className="bg-brand-charcoal border border-white/10 rounded-3xl overflow-hidden shadow-2xl text-left">
            
            {/* Console Header */}
            <div className="bg-brand-gray border-b border-white/10 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-brand-red"></span>
                <span className="w-3 h-3 rounded-full bg-brand-muted/40"></span>
                <span className="w-3 h-3 rounded-full bg-brand-muted/20"></span>
                <span className="text-xs text-brand-muted tracking-widest font-bold uppercase ml-2">STYLIST SESSION // v3.6-flash</span>
              </div>
              <div className="text-[10px] text-brand-muted font-mono uppercase">STATUS: SECURE CONNECTED</div>
            </div>

            {/* Console Output Area */}
            <div className="p-6 md:p-8 space-y-6 min-h-[300px] max-h-[450px] overflow-y-auto bg-black/40">
              
              {/* Bot Greeting */}
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center font-display text-white font-bold shrink-0 shadow-md shadow-brand-red/20">
                  KT
                </div>
                <div className="space-y-1 max-w-[85%]">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red">KATT-AI STYLIST</span>
                  <div className="bg-brand-charcoal text-sm text-brand-light p-4 rounded-2xl border border-white/5 leading-relaxed">
                    Welcome to the LOS creative archives. I can recommend layered techwear drapes or styling configurations for any condition. Describe your look or try a recommendation shortcut below.
                  </div>
                </div>
              </div>

              {/* Dynamic Answer Area */}
              {aiChatResponse && (
                <div className="flex gap-4 animate-fade-in">
                  <div className="w-9 h-9 rounded-xl bg-brand-red flex items-center justify-center font-display text-white font-bold shrink-0 shadow-md shadow-brand-red/20">
                    KT
                  </div>
                  <div className="space-y-1 max-w-[85%]">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red">LOS RESPONSE</span>
                    <div className="bg-brand-charcoal text-sm text-brand-light p-4 rounded-2xl border border-white/5 leading-relaxed whitespace-pre-wrap font-sans">
                      {aiChatResponse}
                    </div>
                  </div>
                </div>
              )}

              {isAiLoading && (
                <div className="flex gap-4 items-center pl-14">
                  <div className="flex space-x-1.5">
                    <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-xs text-brand-muted uppercase tracking-widest">Sifting techwear specifications...</span>
                </div>
              )}
            </div>

            {/* Prompt Shortcuts */}
            <div className="px-6 py-4 bg-brand-gray/50 border-t border-white/10">
              <span className="text-[9px] text-brand-muted tracking-widest font-bold uppercase block mb-2.5">SHORTCUT SUGGESTIONS</span>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((promptText, i) => (
                  <button 
                    key={i}
                    onClick={() => handleAskAI(promptText)}
                    disabled={isAiLoading}
                    className="text-[10px] text-brand-light hover:text-white bg-brand-gray hover:bg-brand-red hover:border-brand-red border border-white/10 px-3.5 py-1.5 rounded-full transition-all text-left disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <div className="p-4 bg-brand-gray border-t border-white/10 flex gap-3">
              <input 
                type="text" 
                placeholder="DESCRIBE A STYLE OR SCENARIO (e.g. 'cozy oversized winter outfit with tactical vests')"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAskAI();
                }}
                disabled={isAiLoading}
                className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3 text-sm text-brand-light placeholder:text-brand-muted/50 uppercase tracking-wide focus:outline-none focus:border-brand-red font-display"
              />
              <button 
                onClick={() => handleAskAI()}
                disabled={isAiLoading || !aiPrompt.trim()}
                className="bg-brand-red hover:bg-brand-red/90 disabled:bg-brand-muted/30 text-white font-bold tracking-widest text-[12px] px-6 py-3 rounded-xl uppercase transition-colors shrink-0 flex items-center gap-2"
              >
                COMPILE
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 7. QUICK VIEW PRODUCT MODAL DRAWER */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            onClick={() => setSelectedProduct(null)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer content */}
          <div className="relative w-full max-w-lg bg-brand-dark border-l border-white/10 h-full overflow-y-auto flex flex-col shadow-2xl animate-slide-in">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-brand-red font-bold tracking-widest block uppercase font-display">LOS DESIGN REPORT</span>
                <span className="text-xs text-brand-muted tracking-widest uppercase font-mono">{selectedProduct.sku}</span>
              </div>
              <button 
                onClick={() => setSelectedProduct(null)}
                className="p-2 text-brand-muted hover:text-brand-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-8 flex-grow">
              {/* Product Thumbnail Large */}
              <div className="w-full h-80 bg-brand-gray rounded-2xl overflow-hidden relative border border-white/10">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
              </div>

              {/* Title & Price */}
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-display font-bold tracking-widest text-white leading-tight">
                  {selectedProduct.name}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="text-brand-red font-bold text-xl font-display">${selectedProduct.price}</span>
                  <span className="bg-brand-charcoal text-[10px] tracking-widest font-bold uppercase text-brand-muted border border-white/5 px-3 py-1 rounded-full">
                    {selectedProduct.category}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2.5">
                <span className="text-[10px] tracking-widest uppercase font-bold text-brand-muted block">DESIGN PROFILE</span>
                <p className="text-sm text-brand-muted font-light leading-relaxed">
                  {selectedProduct.description}
                </p>
              </div>

              {/* Technical Specifications */}
              <div className="space-y-3">
                <span className="text-[10px] tracking-widest uppercase font-bold text-brand-muted block">TECHNICAL SPECIFICATIONS</span>
                <ul className="grid grid-cols-1 gap-2">
                  {selectedProduct.specs.map((spec, i) => (
                    <li key={i} className="text-xs text-brand-light flex items-center gap-2">
                      <span className="w-1 h-1 bg-brand-red rounded-full"></span>
                      {spec}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Sizing */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-brand-muted">CHOOSE SILHOUETTE FIT</span>
                  <span className="text-[10px] text-brand-red tracking-widest font-semibold">TRUE TO OVERSIZED</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button 
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`font-display font-bold text-sm tracking-widest uppercase py-3 rounded-lg border transition-all ${selectedSize === size ? 'bg-brand-red border-brand-red text-white' : 'bg-transparent border-white/10 text-brand-muted hover:border-white/35 hover:text-brand-light'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Checkout Sticky Action */}
            <div className="p-6 bg-brand-charcoal border-t border-white/10 flex gap-4">
              <button 
                onClick={() => toggleWishlist(selectedProduct.id)}
                className="bg-brand-dark p-4 rounded-xl border border-white/10 hover:border-brand-red transition-all"
                aria-label="Wishlist item"
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(selectedProduct.id) ? 'fill-brand-red text-brand-red' : 'text-brand-light'}`} />
              </button>
              <button 
                onClick={() => {
                  addToCart(selectedProduct, selectedSize);
                  setSelectedProduct(null);
                }}
                className="flex-1 bg-brand-red hover:bg-brand-red/90 text-white font-bold tracking-widest text-[13px] py-4 rounded-xl uppercase transition-colors flex justify-center items-center gap-2"
              >
                ADD TO CAPSULE
                <ShoppingBag className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. SHOPPING CART SIDEBAR DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end" aria-labelledby="cart-title" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <div 
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          ></div>

          {/* Drawer content */}
          <div className="relative w-full max-w-md bg-brand-dark border-l border-white/10 h-full overflow-y-auto flex flex-col shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-brand-red" />
                <span className="text-xl font-display font-bold tracking-widest text-white uppercase">YOUR ACTIVE CAPSULE</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="p-2 text-brand-muted hover:text-brand-light transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart list */}
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 bg-brand-charcoal rounded-full flex items-center justify-center mx-auto border border-white/5">
                    <ShoppingBag className="w-6 h-6 text-brand-muted" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-display font-bold text-base tracking-wider text-brand-light uppercase">CAPSULE IS EMPTY</p>
                    <p className="text-xs text-brand-muted">No tactical configurations selected yet.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCartOpen(false);
                      const el = document.getElementById('shop-now');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs text-brand-red font-bold tracking-widest uppercase hover:underline"
                  >
                    EXPLORE RELEASES
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div 
                      key={`${item.product.id}-${item.size}-${index}`}
                      className="bg-brand-charcoal/40 border border-white/5 p-4 rounded-xl flex gap-4 items-center"
                    >
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-brand-gray shrink-0">
                        <img 
                          src={item.product.image} 
                          alt={item.product.name} 
                          className="w-full h-full object-cover grayscale"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-grow text-left space-y-1">
                        <h4 className="text-xs font-bold tracking-wider text-brand-light uppercase line-clamp-1 font-display">
                          {item.product.name}
                        </h4>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-brand-red font-bold font-display">${item.product.price}</span>
                          <span className="text-[10px] text-brand-muted uppercase font-semibold">SIZE: {item.size}</span>
                        </div>
                        
                        {/* Quantity management */}
                        <div className="flex items-center gap-2 pt-1">
                          <button 
                            onClick={() => updateQuantity(index, -1)}
                            className="bg-brand-dark p-1 rounded hover:bg-brand-red hover:text-white transition-colors border border-white/5"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-brand-light px-2 font-display">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(index, 1)}
                            className="bg-brand-dark p-1 rounded hover:bg-brand-red hover:text-white transition-colors border border-white/5"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(index)}
                        className="p-2 text-brand-muted hover:text-brand-red transition-colors shrink-0"
                        aria-label="Remove item"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subtotal & checkout details */}
            {cart.length > 0 && (
              <div className="p-6 bg-brand-charcoal border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center text-sm font-semibold text-brand-muted">
                  <span>SUBTOTAL</span>
                  <span className="text-brand-light font-bold text-lg font-display">${cartSubtotal}</span>
                </div>
                <div className="bg-brand-dark p-3.5 rounded-xl border border-white/5 text-[11px] leading-relaxed text-brand-muted text-left">
                  <div className="flex justify-between items-center font-bold mb-1 text-brand-light">
                    <span>STANDARD INSURED DELIVERY</span>
                    <span className="text-brand-red">COMPLIMENTARY</span>
                  </div>
                  Secure dispatch in eco-friendly industrial crates with complete tracking details.
                </div>
                <button 
                  onClick={() => {
                    alert('LOS Prototype Checkout: Your order has been registered in the sandbox system.');
                    saveCartToStorage([]);
                    setIsCartOpen(false);
                  }}
                  className="w-full bg-brand-red hover:bg-brand-red/90 text-white font-bold tracking-widest text-[13px] py-4 rounded-xl uppercase transition-colors"
                >
                  DISPATCH ORDER // PROCEED
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. GRID PRODUCT SECTION FOR DIRECT ENTRY OR NAVIGATION */}
      <section id="shop-now" className="bg-brand-dark py-24 px-4 md:px-8 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red">DESIGN ARCHIVE SYSTEM</span>
            <h3 className="text-3xl md:text-5xl font-display font-bold tracking-widest uppercase text-white">
              LOS FULL CAPSULE catalog
            </h3>
            <p className="text-brand-muted text-xs md:text-sm max-w-md mx-auto font-light">
              Filter through tactical outerwear, midlayers, high-tension trousers, and industrial modular harness belts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {PRODUCTS.map((product) => (
              <div 
                key={product.id}
                className="bg-brand-charcoal/40 border border-white/5 rounded-3xl p-5 hover:border-brand-red/30 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-80 rounded-2xl overflow-hidden bg-brand-gray relative">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover grayscale transition-transform duration-500 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/50 to-transparent"></div>
                    
                    <button 
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md p-2 rounded-full border border-white/10 hover:border-brand-red transition-all text-brand-light"
                    >
                      <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-brand-red text-brand-red' : 'text-white'}`} />
                    </button>
                  </div>

                  <div className="mt-5 text-left space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-brand-muted font-mono tracking-widest">
                      <span>{product.sku}</span>
                      <span className="text-brand-red font-bold uppercase">{product.category}</span>
                    </div>
                    <h4 className="text-lg font-bold tracking-wider text-brand-light uppercase font-display leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-xs text-brand-muted font-light leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="text-lg font-bold text-white font-display">${product.price}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedProduct(product)}
                      className="text-[11px] font-bold tracking-widest uppercase bg-brand-gray hover:bg-brand-dark text-brand-light px-4 py-2 rounded-lg border border-white/10 transition-colors"
                    >
                      SPEC
                    </button>
                    <button 
                      onClick={() => addToCart(product, 'M')}
                      className="bg-brand-red hover:bg-brand-red/90 text-white font-bold tracking-widest text-[11px] px-4 py-2 rounded-lg uppercase transition-colors"
                    >
                      BUY
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. NEWSLETTER & FOOTER */}
      <footer id="footer" className="bg-brand-charcoal text-brand-light border-t border-white/5 relative">
        
        {/* Newsletter Call-to-action */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center border-b border-white/5 text-left">
          <div className="space-y-4">
            <span className="text-[10px] tracking-widest uppercase font-bold text-brand-red">DISPATCH ANNOUNCEMENTS</span>
            <h4 className="text-3xl md:text-4xl font-display font-bold uppercase text-white">
              JOIN THE LOS LOGISTIC SYSTEM
            </h4>
            <p className="text-xs md:text-sm text-brand-muted font-light leading-relaxed max-w-md">
              Receive zero-latency deployment notifications, exclusive visual lookbooks, and private streetwear capsule access.
            </p>
          </div>
          <div className="flex gap-3">
            <input 
              type="email" 
              placeholder="ENTER REBEL EMAIL" 
              className="flex-grow bg-brand-dark border border-white/10 rounded-xl px-4 py-3.5 text-xs text-brand-light placeholder:text-brand-muted/40 uppercase tracking-widest focus:outline-none focus:border-brand-red font-display"
            />
            <button 
              onClick={() => alert('Logistic subscription secured.')}
              className="bg-brand-red hover:bg-brand-red/90 text-white font-bold tracking-widest text-[11px] px-6 py-3.5 rounded-xl uppercase transition-colors flex items-center gap-2"
            >
              REGISTER
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Traditional Multi-column Footer replicating exact elements and column headers of image */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 grid grid-cols-2 md:grid-cols-4 gap-12 text-left">
          
          {/* Col 1 */}
          <div className="space-y-6">
            <h5 className="font-display font-bold text-lg tracking-widest uppercase text-white">COLLECTIONS</h5>
            <ul className="space-y-3.5 text-xs text-brand-muted font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-brand-red transition-colors">Tactical Vests</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Cyber Hoodies</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Ripstop Cargo Pants</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Industrial Straps</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Core Stencil Tees</a></li>
            </ul>
          </div>

          {/* Col 2 */}
          <div className="space-y-6">
            <h5 className="font-display font-bold text-lg tracking-widest uppercase text-white">SUPPORT</h5>
            <ul className="space-y-3.5 text-xs text-brand-muted font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-brand-red transition-colors">Crate Tracking</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Exchange Logistics</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Fabric Durability Guide</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Sizing Prescriptions</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Terminal Support</a></li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-6">
            <h5 className="font-display font-bold text-lg tracking-widest uppercase text-white">LEGAL</h5>
            <ul className="space-y-3.5 text-xs text-brand-muted font-light uppercase tracking-wider">
              <li><a href="#" className="hover:text-brand-red transition-colors">Terminal Integrity</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Data Cryptography</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Terms of Operations</a></li>
              <li><a href="#" className="hover:text-brand-red transition-colors">Dispatch Protocols</a></li>
            </ul>
          </div>

          {/* Col 4 - Brand Signature & Sunglasses model from screenshot footer */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className="space-y-3">
              <h5 className="font-display font-bold text-lg tracking-widest uppercase text-white">LOS HQ</h5>
              <p className="text-[11px] text-brand-muted leading-relaxed font-light uppercase tracking-wider">
                Industrial Area Terminal 4 <br />
                Global Expansion Sect 03.1 <br />
                Amee14r@gmail.com
              </p>
            </div>
            
            <div className="flex gap-4 items-center">
              <span className="text-[10px] font-bold text-brand-red font-display tracking-widest uppercase">
                SYSTEMS OPERATIONAL
              </span>
              <span className="w-2.5 h-2.5 bg-brand-red rounded-full animate-pulse"></span>
            </div>
          </div>

        </div>

        {/* Trademark bar */}
        <div className="bg-black/40 py-8 px-4 border-t border-white/5 text-center text-[10px] tracking-widest text-brand-muted uppercase">
          © 2026 LOS SYSTEMS. ALL TECHNICAL CONFIGURATIONS ARCHIVED.
        </div>
      </footer>

    </div>
  );
}

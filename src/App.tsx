import React, { useState, useEffect } from "react";
import { 
  ShoppingBag, Heart, ArrowLeft, ArrowRight, CheckCircle, Package, Truck, 
  MapPin, CreditCard, ChevronRight, Sparkles, Star, AlertCircle, ShoppingCart, 
  Trash2, ShieldAlert, Plus, Minus, Info, Eye, ExternalLink, Menu, UserCheck
} from "lucide-react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProductCard from "./components/ProductCard";
import ArticleView from "./components/ArticleView";
import AdminPanel from "./components/AdminPanel";
import { Product, Article, Order, User, OrderItem, SystemConfig } from "./types";

export default function App() {
  // Page routing
  const [currentView, setCurrentView] = useState<string>("landing");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  // Core collections data
  const [products, setProducts] = useState<Product[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);

  // Customer transactions basket (stored in localStorage)
  const [cart, setCart] = useState<OrderItem[]>(() => {
    const saved = localStorage.getItem("vera_cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem("vera_wishlist");
    return saved ? JSON.parse(saved) : [];
  });

  // User Auth status
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem("vera_user");
    return saved ? JSON.parse(saved) : null;
  });

  // Client Filter/Sorting Preferences
  const [productCategory, setProductCategory] = useState<string>("All");
  const [productSearch, setProductSearch] = useState<string>("");
  const [productSort, setProductSort] = useState<string>("default");

  // Hero section slider
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);

  // Checkout address/invoice form state
  const [checkoutForm, setCheckoutForm] = useState({
    name: "Audrey Hepburn",
    email: "customer@vera.com",
    address: "Jl. Senopati No. 42, Kebayoran Baru",
    city: "Jakarta Selatan",
    zip: "12190",
    phone: "081234567890",
    paymentMethod: "Bank Transfer (Virtual Account)",
    shippingCategory: "Regular Courier (Standard)"
  });

  // Detail product states
  const [detailColorIdx, setDetailColorIdx] = useState<number>(0);
  const [detailSize, setDetailSize] = useState<string>("");
  const [detailQuantity, setDetailQuantity] = useState<number>(1);

  // Authenticate states
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authForm, setAuthForm] = useState({ email: "customer@vera.com", password: "password", name: "" });
  const [authError, setAuthError] = useState<string | null>(null);

  // Global overlay message notifier
  const [globalNotification, setGlobalNotification] = useState<string | null>(null);

  // Article filter query
  const [articleQuery, setArticleQuery] = useState("");

  useEffect(() => {
    loadProducts();
    loadArticles();
    loadSystemConfig();
  }, []);

  useEffect(() => {
    localStorage.setItem("vera_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("vera_wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Syncing login sesion
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("vera_user", JSON.stringify(currentUser));
      // Pre-populate checkout form with profile context
      setCheckoutForm(prev => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email
      }));
    } else {
      localStorage.removeItem("vera_user");
    }
  }, [currentUser]);

  const loadProducts = async () => {
    try {
      const resp = await fetch("/api/products");
      const data = await resp.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (e) {
      console.error("Products load failed, fallback metrics active", e);
    }
  };

  const loadArticles = async () => {
    try {
      const resp = await fetch("/api/articles");
      const data = await resp.json();
      if (data.success) {
        setArticles(data.articles);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadSystemConfig = async () => {
    try {
      const resp = await fetch("/api/config");
      const data = await resp.json();
      if (data.success) {
        setSystemConfig(data.config);
      }
    } catch {
      console.warn("Using offline fallback config");
    }
  };

  const throwToast = (msg: string) => {
    setGlobalNotification(msg);
    setTimeout(() => setGlobalNotification(null), 3500);
  };

  // Switch catalog filter
  const selectCatalogView = (category: string) => {
    setProductCategory(category);
    setCurrentView("catalog");
  };

  const handleProductSelect = (id: string) => {
    setSelectedProductId(id);
    setDetailColorIdx(0);
    setDetailQuantity(1);
    
    // Default size setup
    const prod = products.find(p => p.id === id);
    if (prod && prod.sizes && prod.sizes.length > 0) {
      setDetailSize(prod.sizes[0]);
    }
    setCurrentView("product-detail");
    window.scrollTo(0, 0);
  };

  // Switch variant details
  const handleColorChoice = (idx: number) => {
    setDetailColorIdx(idx);
  };

  // Add to Cart workflow
  const handleAddToCart = (product: Product, selectedColor: string, selectedSize: string, qty: number) => {
    if (product.stock === 0) {
      throwToast("Unable to add: this unique item is sold out.");
      return;
    }

    const cartCopy = [...cart];
    const matchIdx = cartCopy.findIndex(
      item => item.productId === product.id && 
              item.selectedColor === selectedColor && 
              item.selectedSize === selectedSize
    );

    if (matchIdx !== -1) {
      cartCopy[matchIdx].quantity += qty;
    } else {
      cartCopy.push({
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: qty,
        selectedColor,
        selectedSize
      });
    }

    setCart(cartCopy);
    throwToast(`Appended "${product.name}" to your shopping basket.`);
  };

  const handleToggleWishlist = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const wishCopy = [...wishlist];
    const index = wishCopy.indexOf(id);
    if (index !== -1) {
      wishCopy.splice(index, 1);
      throwToast("Removed item from wish list.");
    } else {
      wishCopy.push(id);
      throwToast("Saved item to your luxury wishlist.");
    }
    setWishlist(wishCopy);
  };

  const handleRemoveFromCart = (index: number) => {
    const fresh = [...cart];
    fresh.splice(index, 1);
    setCart(fresh);
    throwToast("Shopping cart package item removed.");
  };

  const handleUpdateCartQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    const active = updated[index];
    const targetProduct = products.find(p => p.id === active.productId);
    
    const maxStock = targetProduct ? targetProduct.stock : 99;
    const nextQty = active.quantity + delta;

    if (nextQty <= 0) {
      handleRemoveFromCart(index);
      return;
    }

    if (nextQty > maxStock) {
      throwToast(`Unable to satisfy request. Only ${maxStock} items present in current store stock.`);
      return;
    }

    updated[index].quantity = nextQty;
    setCart(updated);
  };

  // Placing transaction order
  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      throwToast("Your shopping cart has no items.");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = checkoutForm.shippingCategory.includes("Premium") ? 75000 : 35000;
    const total = subtotal + shippingFee;

    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser?.email || "guest@vera.com",
          name: checkoutForm.name,
          address: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zip}`,
          phone: checkoutForm.phone,
          items: cart,
          subtotal,
          shippingFee,
          total,
          paymentMethod: checkoutForm.paymentMethod
        })
      });

      const data = await resp.json();
      if (data.success) {
        // Clear workspace
        setCart([]);
        setSelectedOrderId(data.order.id);
        setCurrentView("order-tracking");
        throwToast(`Order Placed! Thank you for purchasing.`);
        loadProducts(); // Sync stock totals
      } else {
        throwToast(data.message || "Failed placing request.");
      }
    } catch {
      throwToast("System error transmitting order details.");
    }
  };

  // Repeat Previous Invoice purchases
  const handleReorder = async (invoiceId: string) => {
    try {
      const resp = await fetch(`/api/orders/${invoiceId}/reoder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser?.email })
      });
      const data = await resp.json();
      if (data.success && data.items) {
        setCart(data.items);
        setCurrentView("cart");
        throwToast("Items from previous order loaded in your active basket!");
      }
    } catch {
      throwToast("Re-order connection issues.");
    }
  };

  // Perform user authentication
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const isLogin = authMode === "login";
    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    try {
      const resp = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
          name: authForm.name
        })
      });

      const data = await resp.json();
      if (data.success) {
        setCurrentUser(data.user);
        throwToast(`Welcome ${data.user.name}!`);
        
        // Redirect logic based on role
        if (data.user.role === "admin" || data.user.role === "superadmin") {
          setCurrentView("admin-dashboard");
        } else {
          setCurrentView("landing");
        }
      } else {
        setAuthError(data.message || "Credential matching failed.");
      }
    } catch {
      setAuthError("Network interrupt during account synchronization.");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    throwToast("Secure logout validated.");
    setCurrentView("landing");
  };

  // Dynamic products filter calculations
  const filteredProducts = products.filter(p => {
    const matchesCategory = productCategory === "All" || p.category === productCategory;
    const matchesSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) || 
                          p.subCategory.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Apply sorting models
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (productSort === "price-low") return a.price - b.price;
    if (productSort === "price-high") return b.price - a.price;
    if (productSort === "alpha") return a.name.localeCompare(b.name);
    if (productSort === "stock") return b.stock - a.stock;
    return 0; // default
  });

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F9F8F6] text-[#141414] font-sans selection:bg-[#141414] selection:text-white">
      {/* Toast Notifier */}
      {globalNotification && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-[#141414] text-white border border-white/20 px-6 py-3 text-xs uppercase tracking-widest flex items-center gap-2 shadow-2xl animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{globalNotification}</span>
        </div>
      )}

      {/* Elegant Header Area */}
      <Navbar
        currentUser={currentUser}
        onNavigate={(view) => {
          setCurrentView(view);
          setSelectedArticleId(null);
          setSelectedProductId(null);
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        wishlistCount={wishlist.length}
        currentView={currentView}
        onLogout={handleLogout}
      />

      {/* Main Switcher */}
      <div className="flex-1">
        
        {/* VIEW 1: LANDING / HOME PAGE */}
        {currentView === "landing" && (
          <div className="animate-fade-in space-y-16">
            
            {/* Elegant Hero Slider section containing Unsplash Fashion models */}
            <div className="relative h-[550px] md:h-[650px] w-full bg-[#EAE8E4] group overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-80 transition-all duration-1000 transform scale-100" 
                style={{ 
                  backgroundImage: heroSlideIdx === 0 
                    ? `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=1500')`
                    : heroSlideIdx === 1
                    ? `url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1500')`
                    : `url('https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=1500')`
                }}
              />
              
              {/* Overlay Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-16 text-white bg-gradient-to-t from-black/50 via-transparent to-transparent">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] mb-4 text-[#F9F8F6]/80 font-semibold">
                  {heroSlideIdx === 0 ? "Spring Summer Collection 2026" : heroSlideIdx === 1 ? "Quiet Skincare Philosophy" : "Archival Haute Couture Details"}
                </span>
                <h1 className="text-4xl md:text-7xl font-light leading-tight mb-8 tracking-tighter max-w-2xl font-serif">
                  {heroSlideIdx === 0 ? "Elegant Silhouettes" : heroSlideIdx === 1 ? "Aura Prism Complexion" : "Modern Subtlety"}
                </h1>
                
                <div className="flex gap-4 items-center">
                  <button 
                    onClick={() => selectCatalogView("Fashion")}
                    className="w-fit px-6 py-3 border border-white text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all font-semibold"
                  >
                    Shop Fashion
                  </button>
                  <button 
                    onClick={() => selectCatalogView("Beauty")}
                    className="w-fit px-6 py-3 border border-white/40 text-[10px] uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all font-semibold"
                  >
                    View Beauty Line
                  </button>
                </div>
              </div>

              {/* Slider Arrows */}
              <button 
                onClick={() => setHeroSlideIdx(prev => (prev === 0 ? 2 : prev - 1))}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/25 text-white bg-black/10 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setHeroSlideIdx(prev => (prev === 2 ? 0 : prev + 1))}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-2.5 rounded-full border border-white/25 text-white bg-black/10 hover:bg-black/40 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Premium Seed Category Boxes */}
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
              <div 
                onClick={() => selectCatalogView("Fashion")}
                className="relative aspect-[16/10] bg-[#E9E9E9] group overflow-hidden cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=700" 
                  alt="Apparel Catalog"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/35 transition-all p-8 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-80 font-bold mb-1">Dresses & Outerwear</span>
                  <h3 className="text-2xl font-light font-serif tracking-tight">Luxury Tailoring & Apparel</h3>
                </div>
              </div>

              <div 
                onClick={() => selectCatalogView("Beauty")}
                className="relative aspect-[16/10] bg-[#F2F2F4] group overflow-hidden cursor-pointer"
              >
                <img 
                  src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=700" 
                  alt="Beauty Products"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 hover:bg-black/35 transition-all p-8 flex flex-col justify-end text-white">
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-80 font-bold mb-1">Skincare, Lips & Aura Glow</span>
                  <h3 className="text-2xl font-light font-serif tracking-tight font-display">Beauty & Botanical Apothecary</h3>
                </div>
              </div>
            </div>

            {/* CURATED FEATURED PRODUCTS RAIL */}
            <div className="max-w-7xl mx-auto px-6 space-y-6">
              <div className="flex justify-between items-end border-b border-black/5 pb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-slate-400">Handpicked Essentials</span>
                  <h2 className="text-2xl md:text-3xl font-light font-serif tracking-tight mt-1 text-[#141414]">Selected Masterpieces</h2>
                </div>
                <button 
                  onClick={() => selectCatalogView("All")}
                  className="text-xs uppercase tracking-[0.2em] border-b border-black pb-0.5 hover:opacity-75"
                >
                  View Catalogue
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.slice(0, 4).map(prod => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onSelect={handleProductSelect}
                    isWishlisted={wishlist.includes(prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onInstantAddToCart={(p, e) => {
                      e.stopPropagation();
                      handleAddToCart(p, p.variants[0]?.colorName || "Standard", p.sizes[0] || "Standard", 1);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* SHORT EDITORIAL / BLOG SNIPPET BANNER */}
            <div className="bg-[#FAF8F5] py-20 border-y border-[#141414]/5">
              <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-amber-900 bg-amber-50 px-3 py-1 font-semibold rounded block w-fit">
                    EDITORIAL COLUMNS
                  </span>
                  <h2 className="text-3xl md:text-4xl font-light font-serif tracking-tight leading-snug">
                    "Fewer things, chosen with exceptional care."
                  </h2>
                  <p className="text-sm text-slate-500 font-light leading-relaxed">
                    Explore how Quiet Luxury is redefining e-commerce aesthetics and how choosing sustainable full-grain Calfskins can impact dynamic wardrobes. Read reviews from Dr. Maya Thorne and Constantine Vera.
                  </p>
                  <button 
                    onClick={() => setCurrentView("articles")}
                    className="px-6 py-2.5 bg-black text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-black/90"
                  >
                    Read Columns & Essays
                  </button>
                </div>

                <div className="aspect-[4/3] bg-[#EAE8E4] p-2 border">
                  <img
                    src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=650"
                    alt="Timeless Essentials blog model"
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
              </div>
            </div>

            {/* LUXURY VALUES RAIL */}
            <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-xs tracking-wider uppercase">
              <div className="space-y-2.5 p-6 border border-black/5 hover:border-black/10 rounded transition-all">
                <span className="font-semibold text-slate-900 tracking-widest">Sustainably Milled Fabrics</span>
                <p className="normal-case text-slate-500 font-light tracking-normal leading-relaxed text-[11px]">
                  All material components trace back safely to ecological plantations or high-quality local European suppliers.
                </p>
              </div>
              <div className="space-y-2.5 p-6 border border-black/5 hover:border-black/10 rounded transition-all">
                <span className="font-semibold text-slate-900 tracking-widest">Complimentary courier transport</span>
                <p className="normal-case text-slate-500 font-light tracking-normal leading-relaxed text-[11px]">
                  Receive complimentary white-glove packaging and standard delivery on orders exceeding 2.000.000 IDR.
                </p>
              </div>
              <div className="space-y-2.5 p-6 border border-black/5 hover:border-black/10 rounded transition-all">
                <span className="font-semibold text-slate-900 tracking-widest">Handcrafted Craftsmanship</span>
                <p className="normal-case text-slate-500 font-light tracking-normal leading-relaxed text-[11px]">
                  Each piece receives careful manual validation inside our Parisian design studio before packaging.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: PRODUCT CATALOG */}
        {currentView === "catalog" && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in font-sans">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Couture & Apothecary</span>
              <h1 className="text-4xl md:text-5xl font-light tracking-tight font-serif text-[#141414]">Our Collections</h1>
            </div>

            {/* Filter Dashboard Control Panel */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-y border-[#141414]/10 py-5">
              {/* Category tabs */}
              <div className="flex gap-4 md:gap-6 text-2xs uppercase font-semibold tracking-widest text-[#141414]/70">
                <button 
                  onClick={() => setProductCategory("All")}
                  className={`pb-1 cursor-pointer transition-colors ${productCategory === "All" ? "text-black border-b border-black font-bold" : "hover:text-black"}`}
                >
                  All Items
                </button>
                <button 
                  onClick={() => setProductCategory("Fashion")}
                  className={`pb-1 cursor-pointer transition-colors ${productCategory === "Fashion" ? "text-black border-b border-black font-bold" : "hover:text-black"}`}
                >
                  Fashion
                </button>
                <button 
                  onClick={() => setProductCategory("Beauty")}
                  className={`pb-1 cursor-pointer transition-colors ${productCategory === "Beauty" ? "text-black border-b border-black font-bold" : "hover:text-black"}`}
                >
                  Beauty
                </button>
              </div>

              {/* Live search input */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search catalogue..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="px-4 py-2 border border-black/10 rounded text-xs bg-white outline-none focus:border-black w-full sm:w-56"
                />

                <select
                  value={productSort}
                  onChange={(e) => setProductSort(e.target.value)}
                  className="px-4 py-2 border border-black/10 rounded text-xs bg-white outline-none cursor-pointer"
                >
                  <option value="default">Sort: Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="alpha">Alphabetical</option>
                  <option value="stock">In Stock First</option>
                </select>
              </div>
            </div>

            {/* Grid display layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {sortedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={handleProductSelect}
                  isWishlisted={wishlist.includes(prod.id)}
                  onToggleWishlist={handleToggleWishlist}
                  onInstantAddToCart={(p, e) => {
                    e.stopPropagation();
                    handleAddToCart(p, p.variants[0]?.colorName || "Standard", p.sizes[0] || "Standard", 1);
                  }}
                />
              ))}

              {sortedProducts.length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 space-y-4">
                  <AlertCircle className="w-8 h-8 mx-auto text-stone-300" />
                  <p>Your search filter did not match any products in our collections.</p>
                  <button 
                    onClick={() => { setProductSearch(""); setProductCategory("All"); }}
                    className="px-4 py-2 bg-[#141414] text-white text-[10px] uppercase font-semibold mx-auto"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: PRODUCT DETAIL */}
        {currentView === "product-detail" && selectedProductId && (
          <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-sans">
            {/* Back button */}
            <button
              onClick={() => setCurrentView("catalog")}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#141414] hover:opacity-60 mb-8 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Collections
            </button>

            {(() => {
              const product = products.find(p => p.id === selectedProductId);
              if (!product) return <div className="p-8 text-center text-xs">Unencountered article. Try reloading catalog list.</div>;

              // Image displays depend automatically on active selected Color Variant!
              const activeVariant = product.variants && product.variants.length > 0 
                ? product.variants[detailColorIdx] 
                : null;
              const displayImage = activeVariant ? activeVariant.imageColorUrl : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600";

              return (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                  
                  {/* Left Column: Color Switching Product Image Gallery Grid */}
                  <div className="space-y-4">
                    <div className="aspect-[3/4] bg-[#F4F2EE] overflow-hidden border">
                      <img
                        src={displayImage}
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500"
                      />
                    </div>
                    
                    {/* Multicolored gallery alternatives list */}
                    {product.variants && product.variants.length > 1 && (
                      <div className="grid grid-cols-4 gap-2.5">
                        {product.variants.map((v, i) => (
                          <div 
                            key={i}
                            onClick={() => handleColorChoice(i)}
                            className={`aspect-square bg-stone-100 overflow-hidden cursor-pointer border-2 ${
                              detailColorIdx === i ? "border-black" : "border-transparent"
                            }`}
                          >
                            <img src={v.imageColorUrl} className="w-full h-full object-cover" alt="" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right Column: Premium Information & Selection Actions */}
                  <div className="space-y-6 pt-2">
                    <div className="space-y-2">
                      <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400 font-semibold inline-block">
                        VERA ESSENTIAL &bull; {product.category}
                      </span>
                      <h1 className="text-3xl md:text-4xl font-light font-serif tracking-tight text-[#141414] leading-tight">
                        {product.name}
                      </h1>
                      <div className="text-xl font-semibold text-slate-900 mt-2">
                        {product.price.toLocaleString("id-ID")} <span className="text-xs font-normal text-slate-400">IDR Retail</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 font-light leading-relaxed border-t border-black/5 pt-4">
                      {product.description}
                    </p>

                    {/* SELECT DETAILED COLOR */}
                    {product.variants && product.variants.length > 0 && (
                      <div className="space-y-2 border-t border-black/5 pt-4">
                        <span className="text-[10px] uppercase tracking-widest text-[#141414] font-semibold block">
                          Selected shade/material: <span className="font-light italic lowercase text-slate-500 font-serif">{product.variants[detailColorIdx]?.colorName}</span>
                        </span>
                        
                        <div className="flex gap-2">
                          {product.variants.map((v, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleColorChoice(idx)}
                              className={`w-7 h-7 rounded-full border cursor-pointer relative flex items-center justify-center transition-all ${
                                detailColorIdx === idx ? "ring-2 ring-black " : "border-slate-300"
                              }`}
                              style={{ backgroundColor: v.hex }}
                              title={v.colorName}
                            >
                              {detailColorIdx === idx && (
                                <span className="w-1.5 h-1.5 rounded-full bg-white block mix-blend-exclusion"></span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* SELECT SIZE */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase tracking-widest font-semibold block text-[#141414]">Choose Size / Volume</span>
                        <div className="flex gap-2 flex-wrap">
                          {product.sizes.map(size => (
                            <button
                              key={size}
                              onClick={() => setDetailSize(size)}
                              className={`px-4 py-2 border text-[10px] uppercase tracking-widest transition-all cursor-pointer font-semibold ${
                                detailSize === size 
                                  ? "bg-black text-white border-black" 
                                  : "bg-white text-slate-600 border-black/10 hover:border-black"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* QUANTITY MANAGER & ADDBASE ACTIONS */}
                    <div className="space-y-4 border-t border-black/5 pt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-widest font-semibold text-slate-400">Inventory Status</span>
                        {product.stock === 0 ? (
                          <span className="text-xs text-red-600 font-semibold bg-red-50 px-2.5 py-0.5 uppercase tracking-wider rounded">Sold Out</span>
                        ) : product.stock <= 5 ? (
                          <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2.5 py-0.5 uppercase tracking-wider rounded">Critical: Only {product.stock} items available</span>
                        ) : (
                          <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded uppercase tracking-wider font-semibold">In Stock Balance verified</span>
                        )}
                      </div>

                      {!product.variants ? null : product.stock > 0 && (
                        <div className="flex gap-4 items-center">
                          <div className="flex border border-black/10">
                            <button 
                              onClick={() => setDetailQuantity(q => Math.max(1, q - 1))}
                              className="px-3 py-1 bg-[#F9F8F6] hover:bg-slate-100 font-mono text-sm border-r focus:outline-none"
                            >
                              -
                            </button>
                            <span className="px-4 py-1 font-mono text-sm flex items-center justify-center min-w-[30px] bg-white">
                              {detailQuantity}
                            </span>
                            <button 
                              onClick={() => setDetailQuantity(q => Math.min(product.stock, q + 1))}
                              className="px-3 py-1 bg-[#F9F8F6] hover:bg-slate-100 font-mono text-sm border-l focus:outline-none"
                            >
                              +
                            </button>
                          </div>

                          <div className="text-xs text-slate-400 font-mono uppercase tracking-wider">
                            Total: {(product.price * detailQuantity).toLocaleString("id-ID")} IDR
                          </div>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          disabled={product.stock === 0}
                          onClick={() => handleAddToCart(
                            product, 
                            product.variants[detailColorIdx]?.colorName || "Standard", 
                            detailSize || product.sizes[0] || "Standard", 
                            detailQuantity
                          )}
                          className="flex-1 bg-[#141414] text-white hover:bg-black py-4 px-6 text-xs uppercase tracking-widest font-semibold text-center hover:opacity-90 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                        >
                          {product.stock === 0 ? "Out of Stock" : "Add to shopping Cart"}
                        </button>

                        <button
                          onClick={(e) => handleToggleWishlist(product.id, e)}
                          className="px-6 py-4 border border-black/15 text-xs text-slate-800 uppercase tracking-widest hover:bg-white flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? "fill-red-500 stroke-red-500 animate-pulse" : ""}`} />
                          {wishlist.includes(product.id) ? "Saved in wish list" : "Save to wishlist"}
                        </button>
                      </div>
                    </div>

                    {/* Details Accordion style list with values */}
                    <div className="border-t border-[#141414]/10 pt-4 space-y-2.5 text-[11px] leading-relaxed text-slate-500">
                      <div>
                        <strong>Formulation details:</strong> Luxury crafted textiles woven under organic European codes. Formulated products audited under strict clean dermatologist tests.
                      </div>
                      <div>
                        <strong>Complimentary Gift Wrap:</strong> Package arrives inside our iconic charcoal-embossed rigid paperboard boxes. Includes personalized calligraphic greeting notes.
                      </div>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 4: EDITORIAL ARTICLES */}
        {currentView === "articles" && (
          <ArticleView
            articles={articles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(id) => {
              setSelectedArticleId(id);
              if (id) {
                setCurrentView("article-detail");
              }
            }}
            searchQuery={articleQuery}
            onSearchChange={setArticleQuery}
          />
        )}

        {/* VIEW 4.5: SINGLE ARTICLE READ VIEW */}
        {currentView === "article-detail" && selectedArticleId && (
          <ArticleView
            articles={articles}
            selectedArticleId={selectedArticleId}
            onSelectArticle={(id) => {
              setSelectedArticleId(id);
              if (!id) {
                setCurrentView("articles");
              }
            }}
            searchQuery={articleQuery}
            onSearchChange={setArticleQuery}
          />
        )}

        {/* VIEW 5: USER WISHLIST */}
        {currentView === "wishlist" && (
          <div className="max-w-7xl mx-auto px-6 py-12 space-y-8 animate-fade-in font-sans">
            <div className="text-center space-y-1">
              <span className="text-[10px] uppercase tracking-[0.4em] text-slate-400">Save List</span>
              <h1 className="text-4xl font-light tracking-tight font-serif text-[#141414]">My Premium Wishlist</h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">Items added here will remain stored safely in your physical database cookies for instant retrieval.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 pt-6">
              {products.filter(p => wishlist.includes(p.id)).map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelect={handleProductSelect}
                  isWishlisted={true}
                  onToggleWishlist={handleToggleWishlist}
                  onInstantAddToCart={(p, e) => {
                    e.stopPropagation();
                    handleAddToCart(p, p.variants[0]?.colorName || "Standard", p.sizes[0] || "Standard", 1);
                  }}
                />
              ))}

              {products.filter(p => wishlist.includes(p.id)).length === 0 && (
                <div className="col-span-full py-16 text-center text-slate-400 space-y-4">
                  <Heart className="w-10 h-10 stroke-zinc-300 mx-auto" />
                  <p className="font-normal text-sm">Your luxury wishlist is currently empty.</p>
                  <button 
                    onClick={() => setCurrentView("catalog")}
                    className="px-6 py-2.5 bg-[#141414] text-white text-[10px] uppercase font-semibold"
                  >
                    View collections katalog
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 6: SHOPPING CART */}
        {currentView === "cart" && (
          <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-sans">
            <h1 className="text-3xl font-light tracking-tight font-serif text-[#141414] mb-8">Shopping Basket</h1>

            {cart.length === 0 ? (
              <div className="text-center py-20 bg-white border border-[#141414]/5 space-y-4">
                <ShoppingBag className="w-10 h-10 stroke-zinc-300 mx-auto" />
                <p className="text-slate-500 text-sm">You have no pending items inside your active basket.</p>
                <button
                  onClick={() => setCurrentView("catalog")}
                  className="px-6 py-3 bg-black text-white text-[10px] uppercase tracking-widest font-semibold"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                
                {/* Cart list columns */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white border border-[#141414]/5 divide-y divide-black/5">
                    {cart.map((item, index) => {
                      const matchProduct = products.find(p => p.id === item.productId);
                      const displayImg = matchProduct?.variants.find(v => v.colorName === item.selectedColor)?.imageColorUrl 
                        || matchProduct?.variants[0]?.imageColorUrl 
                        || "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200";

                      return (
                        <div key={index} className="p-4 flex gap-4 items-center">
                          <img src={displayImg} className="w-16 h-20 object-cover bg-stone-100 border" alt="" />
                          
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] uppercase tracking-widest text-[#141414]/40 font-semibold font-mono block">
                              Category Index: {matchProduct?.subCategory}
                            </span>
                            <h4 className="font-light text-base text-[#141414] leading-snug truncate">
                              {item.productName}
                            </h4>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-0.5">
                              Size: {item.selectedSize} &bull; Shade: {item.selectedColor}
                            </span>
                          </div>

                          <div className="flex flex-col items-end gap-2.5">
                            {/* Quantity buttons */}
                            <div className="flex border border-black/10 text-xs">
                              <button 
                                onClick={() => handleUpdateCartQuantity(index, -1)}
                                className="px-2 py-0.5 bg-slate-50 hover:bg-slate-200"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="px-2.5 font-mono font-medium">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateCartQuantity(index, 1)}
                                className="px-2 py-0.5 bg-slate-50 hover:bg-slate-200"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <span className="font-semibold text-xs text-[#141414]">
                              {(item.price * item.quantity).toLocaleString("id-ID")} IDR
                            </span>

                            <button
                              onClick={() => handleRemoveFromCart(index)}
                              className="text-[9px] text-red-500 uppercase tracking-widest hover:underline cursor-pointer font-semibold flex items-center gap-0.5"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtotal Invoice summary checklist */}
                <div className="bg-white p-6 border border-[#141414]/10 space-y-6">
                  <span className="text-xs uppercase tracking-widest font-semibold block border-b pb-2">Order Summary</span>
                  
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Items Subtotal</span>
                      <span>
                        {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString("id-ID")} IDR
                      </span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Standard Packaging</span>
                      <span className="text-emerald-700 uppercase tracking-widest text-[10px]">Complimentary</span>
                    </div>

                    <div className="flex justify-between text-slate-500">
                      <span>Standard Shipping</span>
                      <span className="italic text-slate-400">Calculated on checkout</span>
                    </div>
                  </div>

                  <div className="border-t border-black/5 pt-4 flex justify-between items-center text-sm font-semibold">
                    <span>Estimated total</span>
                    <span className="text-lg text-black font-semibold font-sans">
                      {cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString("id-ID")} IDR
                    </span>
                  </div>

                  <button
                    onClick={() => setCurrentView("checkout")}
                    className="w-full bg-black text-white hover:bg-black/95 text-center text-[10px] uppercase font-semibold py-3.5 tracking-[0.2em]"
                  >
                    Proceed to elegant checkout
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

        {/* VIEW 7: CHECKOUT & INVOICING */}
        {currentView === "checkout" && (
          <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in font-sans">
            <h1 className="text-3xl font-light tracking-tight font-serif text-[#141414] mb-8">Shipping Billing & Checkout</h1>

            <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
              
              {/* Checkout detailed input form */}
              <div className="lg:col-span-2 bg-white p-6 border border-[#141414]/10 space-y-6">
                <div>
                  <h3 className="text-sm uppercase tracking-widest font-semibold text-[#141414] border-b pb-2.5">Shipping Target Destination</h3>
                  <p className="text-[10px] text-slate-400 mt-1">Please specify full recipient identification and logistics contact number.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Recipient Full Name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.name}
                      onChange={e => setCheckoutForm({ ...checkoutForm, name: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Contact Email address *</label>
                    <input
                      type="email"
                      required
                      value={checkoutForm.email}
                      onChange={e => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                    />
                  </div>

                  <div className="col-span-1 sm:col-span-2 space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Delivery Address Line *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.address}
                      onChange={e => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                      placeholder="Street name, building suite, house identifier"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">City name *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.city}
                      onChange={e => setCheckoutForm({ ...checkoutForm, city: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Postal Code / ZIP *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.zip}
                      onChange={e => setCheckoutForm({ ...checkoutForm, zip: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1 col-span-1 sm:col-span-2">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Phone Number *</label>
                    <input
                      type="text"
                      required
                      value={checkoutForm.phone}
                      onChange={e => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-[#F9F8F6] text-xs outline-none"
                      placeholder="e.g. 0812XXXXXXXX"
                    />
                  </div>
                </div>

                {/* Shipping Tier selections & prices */}
                <div className="space-y-3">
                  <h4 className="text-[10px] uppercase font-semibold tracking-widest text-[#141414]">Logistics Carrier tier</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <label className="p-3 border rounded-sm flex justify-between items-center cursor-pointer bg-slate-50 border-black/10">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          className="accent-black"
                          name="shipping"
                          checked={checkoutForm.shippingCategory === "Regular Courier (Standard)"}
                          onChange={() => setCheckoutForm({ ...checkoutForm, shippingCategory: "Regular Courier (Standard)" })}
                        />
                        <div>
                          <strong>Regular Courier</strong>
                          <span className="block text-[9px] text-slate-400">Estimated delivery: 3–5 working days</span>
                        </div>
                      </div>
                      <span>35.000 IDR</span>
                    </label>

                    <label className="p-3 border rounded-sm flex justify-between items-center cursor-pointer bg-slate-50 border-black/10">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          className="accent-black"
                          name="shipping"
                          checked={checkoutForm.shippingCategory === "Premium Express (Courier)"}
                          onChange={() => setCheckoutForm({ ...checkoutForm, shippingCategory: "Premium Express (Courier)" })}
                        />
                        <div>
                          <strong>Premium Express Line</strong>
                          <span className="block text-[9px] text-slate-400">Priority local courier: 1–2 working days</span>
                        </div>
                      </div>
                      <span>75.000 IDR</span>
                    </label>
                  </div>
                </div>

                {/* PAYMENT METHOD CHOICES */}
                <div className="space-y-3 border-t pt-4 border-black/5">
                  <h4 className="text-[10px] uppercase font-semibold tracking-widest text-[#141414]">Selected Settlement Method</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <label className="p-3 bg-white border border-black/10 rounded flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="accent-black"
                        name="payment"
                        checked={checkoutForm.paymentMethod === "Bank Transfer (Virtual Account)"}
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: "Bank Transfer (Virtual Account)" })}
                      />
                      <div>
                        <strong>Bank Transfer</strong>
                        <span className="block text-[9px] text-slate-400">Manual verification</span>
                      </div>
                    </label>

                    <label className="p-3 bg-white border border-black/10 rounded flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="accent-black"
                        name="payment"
                        checked={checkoutForm.paymentMethod === "Midtrans (E-Wallet)"}
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: "Midtrans (E-Wallet)" })}
                      />
                      <div>
                        <strong>Midtrans Instants</strong>
                        <span className="block text-[9px] text-slate-400">Auto verify</span>
                      </div>
                    </label>

                    <label className="p-3 bg-white border border-black/10 rounded flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        className="accent-black"
                        name="payment"
                        checked={checkoutForm.paymentMethod === "Security Card (Stripe)"}
                        onChange={() => setCheckoutForm({ ...checkoutForm, paymentMethod: "Security Card (Stripe)" })}
                      />
                      <div>
                        <strong>Stripe Settlement</strong>
                        <span className="block text-[9px] text-slate-400">Credit or debit</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Order total checkout overview */}
              <div className="bg-[#FAF8F5] p-6 border border-[#141414]/10 space-y-6">
                <span className="text-xs uppercase tracking-widest font-semibold block border-b pb-2 text-slate-500">Invoice Items Review</span>

                <div className="max-h-48 overflow-y-auto divide-y divide-[#141414]/5">
                  {cart.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between text-xs items-center">
                      <div className="min-w-0 pr-2">
                        <span className="font-semibold block truncate text-[#141414]">{item.productName}</span>
                        <span className="text-[10px] text-slate-500">{item.selectedColor} &bull; {item.selectedSize} x{item.quantity}</span>
                      </div>
                      <span className="font-semibold">{ (item.price * item.quantity).toLocaleString("id-ID") } IDR</span>
                    </div>
                  ))}
                </div>

                {/* Calculated totals */}
                {(() => {
                  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                  const shippingFee = checkoutForm.shippingCategory.includes("Premium") ? 75000 : 35000;
                  const total = subtotal + shippingFee;

                  return (
                    <div className="space-y-2 border-t pt-4 border-black/5 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Items Subtotal</span>
                        <span>{subtotal.toLocaleString("id-ID")} IDR</span>
                      </div>
                      <div className="flex justify-between text-slate-500">
                        <span>Logistics Cost</span>
                        <span>{shippingFee.toLocaleString("id-ID")} IDR</span>
                      </div>
                      <div className="flex justify-between text-black font-semibold text-sm border-t border-black/5 pt-3">
                        <span>Grand Cash Total</span>
                        <span>{total.toLocaleString("id-ID")} IDR</span>
                      </div>
                    </div>
                  );
                })()}

                {/* Form submit button triggers API insertion */}
                <button
                  type="submit"
                  className="w-full bg-[#141414] text-white hover:bg-black text-[10px] uppercase font-semibold tracking-widest py-3.5"
                >
                  Authorize settlement & Order
                </button>

                <div className="p-4 bg-white border border-[#141414]/5 rounded text-[10px] leading-relaxed text-slate-500 font-serif">
                  * Note: In this simulated Sandbox environment, choosing Manual Transfer triggers immediate verified statuses upon admin confirmation dashboard tests.
                </div>
              </div>

            </form>
          </div>
        )}

        {/* VIEW 8: ORDER TRACKING CONSOLE */}
        {currentView === "order-tracking" && selectedOrderId && (
          <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in font-sans">
            <h1 className="text-3xl font-light font-serif text-[#141414] tracking-tight text-center mb-8">Shipping Tracking Panel</h1>

            {(() => {
              // Retrieve order status from matching client records
              return (
                <div className="bg-white border p-6 md:p-10 border-black/10 space-y-8 max-w-2xl mx-auto">
                  
                  <div className="text-center border-b pb-6 space-y-1">
                    <span className="text-[10px] uppercase tracking-widest text-[#141414]/40">Thank you for your purchase</span>
                    <h3 className="text-2xl font-light font-serif text-slate-800">Order Placed successfully</h3>
                    <div className="text-xs font-mono font-bold text-[#141414] pt-2">Invoice Code: {selectedOrderId}</div>
                  </div>

                  {/* Real-world timeline tracking visualization progress bars */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] uppercase tracking-widest font-semibold border-b pb-1 text-slate-500">Live Delivery History</h4>

                    <div className="relative pt-2">
                      <div className="absolute left-3 top-2 h-[80%] w-0.5 bg-slate-200"></div>

                      <div className="space-y-8">
                        <div className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center text-xs ml-0.5 scale-110">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <strong className="text-xs uppercase tracking-wider block">1. Settlement Authorization verified</strong>
                            <p className="text-[11px] text-slate-500 font-light mt-0.5">Order logged securely into VERA systems. Material collection initiated.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-[#141414]/15 text-[#141414] flex items-center justify-center text-xs ml-0.5">
                            <Package className="w-3.5 h-3.5 text-[#141414]" />
                          </div>
                          <div>
                            <strong className="text-xs uppercase tracking-wider block text-slate-400">2. Professional packaging stage</strong>
                            <p className="text-[11px] text-slate-300 font-light mt-0.5">Items polished, gift wrap embossed, prepared for logistics hand-off.</p>
                          </div>
                        </div>

                        <div className="flex gap-4 relative">
                          <div className="w-6 h-6 rounded-full bg-[#141414]/15 text-[#141414] flex items-center justify-center text-xs ml-0.5">
                            <Truck className="w-3.5 h-3.5 text-[#141414]" />
                          </div>
                          <div>
                            <strong className="text-xs uppercase tracking-wider block text-slate-400">3. In-Transit Dispatch courier</strong>
                            <p className="text-[11px] text-slate-300 font-light mt-0.5">Carrier tracking identifier will compile automatically inside Admin Console logs.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                    <button
                      onClick={() => setCurrentView("landing")}
                      className="px-6 py-2.5 bg-black text-white text-[10px] uppercase font-semibold tracking-wider text-center cursor-pointer"
                    >
                      Return to Landing Page
                    </button>
                    <button
                      onClick={() => setCurrentView("order-history")}
                      className="px-6 py-2.5 border border-black/15 text-[10px] uppercase font-semibold text-slate-800 hover:border-black text-center cursor-pointer"
                    >
                      View Invoice lists
                    </button>
                  </div>

                </div>
              );
            })()}
          </div>
        )}

        {/* VIEW 9: TRANSACTION Invoice lists HISTORY */}
        {currentView === "order-history" && (
          <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in font-sans">
            <h1 className="text-3xl font-light font-serif text-[#141414] mb-8">My Transaction Invoices</h1>

            {currentUser ? (
              <div className="space-y-6">
                {/* Embedded Client order retrieval list */}
                <span className="text-[10px] uppercase tracking-widest text-[#141414]/50 border-b pb-1 block">Account Logged: {currentUser.email}</span>
                
                {(() => {
                  // Fallback simulation order if server database call failed
                  return (
                    <div className="space-y-6">
                      <div className="bg-white border p-6 border-black/10 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Historic Invoice Ref</span>
                            <h4 className="text-base font-semibold text-[#141414] font-mono">ORD-9021</h4>
                          </div>
                          <span className="px-3 py-1 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-semibold rounded-full mt-2 sm:mt-0 font-mono">
                            Delivered successfully & Verified
                          </span>
                        </div>

                        <div className="space-y-2">
                          <strong className="text-xs uppercase tracking-widest block text-slate-400">Purchased Items Details</strong>
                          <div className="text-xs py-1 space-y-1">
                            <div>&bull; **Classic Trench Dress** (Sand Beige, Size M) x1 — 2.450.000 IDR</div>
                            <div>&bull; **Rosé Velvet Matte Lipstick** (Siren Scarlet, Standard Size) x2 — 1.298.000 IDR</div>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-black/5 text-xs text-slate-500">
                          <div>
                            <strong>Estimated Carrier Delivery Arrived:</strong> May 28, 2026 &bull; Tracking identifier: VERA-JKT-100293
                          </div>
                          <button
                            onClick={() => handleReorder("ORD-9021")}
                            className="px-4 py-2 bg-black text-white text-[9px] uppercase tracking-widest mt-3 sm:mt-0"
                          >
                            Re-order Timeless Package
                          </button>
                        </div>
                      </div>

                      {/* Render order status for Audrey Hepburn simulation */}
                      <div className="bg-stone-50 border p-6 border-black/5 space-y-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-slate-400">Verification Pending Invoice</span>
                            <h4 className="text-base font-semibold text-slate-800 font-mono">ORD-5481</h4>
                          </div>
                          <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[10px] uppercase font-semibold rounded-full mt-2 sm:mt-0 font-mono">
                            Pending Manual verification
                          </span>
                        </div>

                        <div className="space-y-2">
                          <strong className="text-xs uppercase tracking-widest block text-slate-400">Purchased Item Detail</strong>
                          <div className="text-xs py-1">
                            &bull; **Mulberry Pleat Silk Dress** (Emerald Green, Size S) x1 — 3.100.000 IDR
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-4 border-t border-black/5 text-xs text-slate-500">
                          <div>
                            <strong>Logistics Status:</strong> Verified and Scheduled for June Packaging
                          </div>
                          <button
                            onClick={() => handleReorder("ORD-5481")}
                            className="px-4 py-2 bg-slate-900 text-white text-[9px] uppercase tracking-widest mt-3 sm:mt-0"
                          >
                            Load to Active Cart
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>
            ) : (
              <div className="text-center py-16 bg-white border max-w-lg mx-auto p-8 space-y-4">
                <ShieldAlert className="w-10 h-10 text-amber-600 mx-auto" />
                <p className="text-sm">Please validate login authentication to pull dynamic e-commerce histories.</p>
                <button
                  onClick={() => setCurrentView("login")}
                  className="px-6 py-2.5 bg-black text-white text-[10px] uppercase font-semibold block mx-auto"
                >
                  Log in now
                </button>
              </div>
            )}
          </div>
        )}

        {/* VIEW 10: USER LOGIN / AUTH WORKFLOWS */}
        {(currentView === "login" || currentView === "register") && (
          <div className="max-w-md mx-auto px-6 py-20 animate-fade-in font-sans">
            <div className="bg-white p-8 border border-black/10 shadow-2xl space-y-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-stone-400 to-black"></div>
              
              <div className="text-center space-y-1">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/30 font-semibold block">Aesthetic Platform security</span>
                <h2 className="text-2xl font-light font-serif text-[#141414]">
                  {authMode === "login" ? "Verify VERA Account" : "Enlist Customer Account"}
                </h2>
              </div>

              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs text-center font-mono">
                  {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4 text-xs">
                {authMode === "register" && (
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">Profile Display Name *</label>
                    <input
                      type="text"
                      required
                      value={authForm.name}
                      onChange={e => setAuthForm({ ...authForm, name: e.target.value })}
                      className="w-full border p-2.5 bg-[#F9F8F6] outline-none"
                      placeholder="e.g. Audrey Hepburn"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">Security Email Address *</label>
                  <input
                    type="email"
                    required
                    value={authForm.email}
                    onChange={e => setAuthForm({ ...authForm, email: e.target.value })}
                    className="w-full border p-2.5 bg-[#F9F8F6] outline-none"
                    placeholder="customer@vera.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold text-slate-500">Password *</label>
                  <input
                    type="password"
                    required
                    value={authForm.password}
                    onChange={e => setAuthForm({ ...authForm, password: e.target.value })}
                    className="w-full border p-2.5 bg-[#F9F8F6] outline-none"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-black text-white text-[10px] uppercase font-semibold hover:opacity-90 tracking-widest pt-3.5"
                >
                  {authMode === "login" ? "Request Platform Entry" : "Create My VERA Account"}
                </button>
              </form>

              {/* Seamless presets logins */}
              {authMode === "login" && (
                <div className="border-t pt-4 border-black/5 space-y-2.5">
                  <span className="text-[9px] uppercase tracking-widest text-[#141414]/40 font-semibold block text-center">Fast-Track Test Credentials</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[9px] uppercase tracking-wider">
                    <button
                      onClick={() => {
                        setAuthForm({ email: "customer@vera.com", password: "password", name: "" });
                        throwToast("Loaded Audrey Hepburn client credentials.");
                      }}
                      className="p-1 px-2 border rounded hover:bg-slate-50 text-center font-semibold cursor-pointer"
                    >
                      Customer
                    </button>
                    <button
                      onClick={() => {
                        setAuthForm({ email: "admin@vera.com", password: "password", name: "" });
                        throwToast("Loaded Claire Redfield staff credentials.");
                      }}
                      className="p-1 px-2 border rounded hover:bg-slate-50 text-center font-semibold cursor-pointer"
                    >
                      Admin
                    </button>
                    <button
                      onClick={() => {
                        setAuthForm({ email: "super@vera.com", password: "password", name: "" });
                        throwToast("Loaded Constantine Vera founder credentials.");
                      }}
                      className="p-1 px-2 border rounded hover:bg-slate-50 text-center font-semibold cursor-pointer"
                    >
                      Super Admin
                    </button>
                  </div>
                </div>
              )}

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setAuthMode(authMode === "login" ? "register" : "login");
                    setAuthError(null);
                  }}
                  className="text-[10px] uppercase tracking-widest text-slate-400 hover:text-black hover:underline cursor-pointer"
                >
                  {authMode === "login" ? "No account? Build one instantly &raquo;" : "Already have accounts validated? Login"}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* VIEW 11: FULL ADMINISTRATIVE PANEL */}
        {currentView === "admin-dashboard" && currentUser && (
          <AdminPanel
            currentUser={currentUser}
            onNavigate={(view) => {
              setCurrentView(view);
              setSelectedProductId(null);
              setSelectedArticleId(null);
            }}
            products={products}
            articles={articles}
            onRefreshProducts={loadProducts}
            onRefreshArticles={loadArticles}
          />
        )}

      </div>

      {/* Elegant Bottom Footer area */}
      <Footer onNavigate={(view) => {
        setCurrentView(view);
        setSelectedArticleId(null);
        setSelectedProductId(null);
      }} />
    </div>
  );
}

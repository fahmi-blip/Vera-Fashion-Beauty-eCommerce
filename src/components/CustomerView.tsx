import React, { useState } from "react";
import { ShoppingBag, Check, User, TruckIcon } from "lucide-react";

import {
  Product,
  CartItem,
  Order,
  Article,
  CurrentUser,
  TabName,
  ActiveRole,
} from "../types";

// Sub-page imports
import CustomerShopView from "./customer/CustomerShopView";
import CustomerProductDetailView from "./customer/CustomerProductDetailView";
import CustomerCheckoutView from "./customer/CustomerCheckoutView";
import CustomerEditorialView from "./customer/CustomerEditorialView";
import CustomerWishlistView from "./customer/CustomerWishlistView";
import CustomerOrdersView from "./customer/CustomerOrdersView";
import CustomerProfileView from "./customer/CustomerProfileView";
import CartDrawer from "./customer/CustomerCartDrawer";
import CustomerLoginForm from "./customer/CustomerLoginForm";
import CustomerRegisterForm from "./customer/CustomerRegisterForm";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CustomerViewProps {
  products: Product[];
  orders: Order[];
  onAddOrder: (order: Order) => void;
  wishlist: string[];
  onToggleWishlist: (id: string) => void;
  cart: CartItem[];
  onUpdateCart: (cart: CartItem[]) => void;
  articles: Article[];
  onStaffRedirect: (role: ActiveRole, staffName: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerView({
  products,
  orders,
  onAddOrder,
  wishlist,
  onToggleWishlist,
  cart,
  onUpdateCart,
  articles,
  onStaffRedirect,
}: CustomerViewProps) {
  // ── Navigation State ──────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<TabName>("shop");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [chosenSize, setChosenSize] = useState<string>("");
  const [chosenColor, setChosenColor] = useState<string>("");
  const [detailQty, setDetailQty] = useState<number>(1);


  const handleClearSearch = () => setSearchQuery("");

  const renderProductIllustration = (id: string, category: string) => (
    <div className="text-stone-300 font-mono text-[10px] uppercase">
      {category} IMAGE
    </div>
  );

  // ── Auth / User State ─────────────────────────────────────────────────────
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>({
    name: "Maya Anindita",
    email: "maya.anindita@outlook.id",
    phone: "+62 812-3456-7890",
    address: "Gedung Cyber, Lt. 12, Kuningan Barat, Jakarta Selatan, 12710",
  });

  // ── Profile / Auth State ──────────────────────────────────────────────────
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  // ── Auth & Profile Handlers ───────────────────────────────────────────────
  const handleLoginSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    triggerToast("Login Berhasil! Selamat datang kembali.");
    goToShop(); // Otomatis kembali ke shop setelah login
  };

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    triggerToast("Registrasi Berhasil! Akun VIP Anda telah aktif.");
    goToShop();
  };

  const handleSaveProfile = (event: React.FormEvent) => {
    event.preventDefault();
    triggerToast("Profil berhasil diperbarui!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    triggerToast("Anda telah keluar (Logout).");
    goToShop();
  };

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setShippingName(user.name);
    setShippingAddress(user.address);
    setShippingPhone(user.phone);
    goToShop(); // Otomatis redirect ke halaman katalog belanja
  };

  const handleUnifiedLoginIntercept = (role: ActiveRole, user: any) => {
    if (role === "customer") {
      // Jika customer, amankan state lokal dan pindah ke halaman katalog belanja
      setCurrentUser(user);
      setShippingName(user.name);
      setShippingAddress(user.address);
      setShippingPhone(user.phone);
      goToShop();
      triggerToast(`Autentikasi Sukses. Selamat datang kembali, ${user.name}.`);
    } else {
      onStaffRedirect(role, user.name);
    }
  };
  // ── UI State ──────────────────────────────────────────────────────────────
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string>("");

  // ── Helpers ───────────────────────────────────────────────────────────────

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  const navigate = (tab: TabName) => {
    setActiveTab(tab);
    setIsCartOpen(false);
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false); // Tutup drawer keranjang
    navigate("checkout"); // Pindah ke halaman checkout
  };

  // ── Checkout Form State ───────────────────────────────────────────────────
  const [shippingName, setShippingName] = useState<string>(currentUser?.name || "");
  const [shippingAddress, setShippingAddress] = useState<string>(currentUser?.address || "");
  const [shippingPhone, setShippingPhone] = useState<string>(currentUser?.phone || "");
  const [paymentMethod, setPaymentMethod] = useState<string>("verapay");
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  // ── Checkout Calculations ─────────────────────────────────────────────────
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingCharge = cartSubtotal > 0 ? 25000 : 0; // Contoh: Ongkir flat Rp 25.000
  const grandTotal = cartSubtotal + shippingCharge;

  // ── Checkout Submit Handler ───────────────────────────────────────────────
  const handleSubmitOrder = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (cart.length === 0) {
      triggerToast("Keranjang Anda kosong!");
      return;
    }

    // Buat objek pesanan baru
    const newOrder: Order = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      customerName: shippingName,
      address: shippingAddress,
      phone: shippingPhone,
      paymentMethod,
      date: new Date().toISOString(),
      status: "pending",
      total: grandTotal,
      items: [...cart],
    };

    handlePlaceOrder(newOrder); // Panggil fungsi bawaan Anda yang sudah ada
  };
  // ── Cart Actions ──────────────────────────────────────────────────────────

  const handleAddToCart = (
    product: Product,
    size?: string,
    color?: string,
    count: number = 1,
  ) => {
    if (product.stock <= 0) {
      triggerToast("Maaf, produk ini sedang habis.");
      return;
    }
    const sizeVal = size || product.sizes?.[0];
    const colorVal = color || product.colors?.[0];
    const existingIndex = cart.findIndex(
      (item) =>
        item.product.id === product.id &&
        item.selectedSize === sizeVal &&
        item.selectedColor === colorVal,
    );
    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += count;
    } else {
      updatedCart.push({
        product,
        quantity: count,
        selectedSize: sizeVal,
        selectedColor: colorVal,
      });
    }
    onUpdateCart(updatedCart);
    triggerToast(`Ditambahkan ke keranjang: ${product.name}`);
  };

  const handleRemoveFromCart = (index: number) => {
    onUpdateCart(cart.filter((_, i) => i !== index));
  };

  const handleUpdateQty = (index: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = [...cart];
    updated[index].quantity = newQty;
    onUpdateCart(updated);
  };
  
  // ── Order Placement ───────────────────────────────────────────────────────

  const handlePlaceOrder = (order: Order) => {
    onAddOrder(order);
    onUpdateCart([]);
    setActiveTab("orders");
    triggerToast(`Pembayaran Berhasil! Pesanan ${order.id} diproses segera.`);
  };

  // ─── Nav Helpers ─────────────────────────────────────────────────────────

  const goToShop = () => navigate("shop");

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setChosenSize(product.sizes?.[0] || "");
    setChosenColor(product.colors?.[0] || "");
    setDetailQty(1);
    setActiveTab("product-detail");
  };

  const handleBackFromDetail = () => {
    setSelectedProduct(null);
    setActiveTab("shop");
  };

  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="bg-white text-black flex flex-col min-h-screen relative font-sans selection:bg-black selection:text-white"
      id="customer-view-root"
    >
      {/* Toast */}
      {successToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 bg-black text-white border border-stone-800 px-6 py-3 shadow-2xl flex items-center gap-2.5 max-w-md animate-fade-in text-[10px] uppercase tracking-widest font-mono">
          <Check className="w-4 h-4 text-white" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── Navigation Bar ─────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 bg-white border-b border-stone-200 py-5 px-4 md:px-8 flex justify-between items-center"
        id="main-header"
      >
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={goToShop}>
            <span className="text-2xl font-serif font-black tracking-[0.25em] text-black">
              <a href="https://vera-184e51.webflow.io/">VERA</a>
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-black group-hover:w-full transition-all duration-300" />
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:flex items-center gap-8 text-[11px] tracking-[0.2em] font-light uppercase text-stone-500">
          {[
            { tab: "shop" as TabName, label: "SHOP", badge: null },
            {
              tab: "articles" as TabName,
              label: "ARTICLES",
              badge: null,
            },
            {
              tab: "wishlist" as TabName,
              label: `WISHLIST (${wishlist.length})`,
              badge: null,
            },
            // {
            //   tab: "orders" as TabName,
            //   label: `TRACK ORDERS (${orders.length})`,
            //   badge: null,
            // },
          ].map(({ tab, label }) => (
            <button
              key={tab}
              onClick={() => navigate(tab)}
              className={`hover:text-black transition-colors pb-1 cursor-pointer transition-all ${
                activeTab === tab ||
                (tab === "shop" && activeTab === "product-detail")
                  ? "border-b border-black text-black font-semibold"
                  : ""
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Icon Utilities */}
        <div className="flex items-center gap-3">
          {/* Profile Button */}
            <button
            onClick={() => setActiveTab("orders")}
            className="relative p-2 text-stone-900 border border-stone-200 hover:bg-stone-50 rounded-none transition-all cursor-pointer"
            aria-label="Track orders"
            id="cart-trigger-btn"
          >
            <TruckIcon className="w-4 h-4" />
            {orders.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white font-bold font-mono text-[8px] w-4 h-4 flex items-center justify-center border border-white">
                {orders.length}
              </span>
            )}
          </button>
          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-stone-900 border border-stone-200 hover:bg-stone-50 rounded-none transition-all cursor-pointer"
            aria-label="Keranjang Belanja"
            id="cart-trigger-btn"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalCartQty > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white font-bold font-mono text-[8px] w-4 h-4 flex items-center justify-center border border-white">
                {totalCartQty}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("login-register")}
            className={`p-2 transition-all flex items-center justify-center border cursor-pointer rounded-none ${
              activeTab === "login-register"
                ? "bg-black border-black text-white"
                : "border-stone-200 text-stone-850 hover:bg-stone-50"
            }`}
            title={currentUser ? "Profil VIP Saya" : "Masuk / Daftar Akun"}
            id="login-register-trigger"
          >
            {currentUser ? (
              <div className="text-[10px] tracking-widest uppercase font-mono font-bold px-1 py-0.5">
                {currentUser.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
            ) : (
              <User className={`w-4 h-4 transition-colors ${
                activeTab === "login-register" 
                  ? "text-white"
                  : "text-black" 
                }`} />
            )}
          </button>

          {/* Mobile Quick Nav */}
          <div className="flex md:hidden items-center gap-1 border-l border-stone-200 pl-1">
            {[
              { tab: "shop" as TabName, label: "SHOP" },
              {
                tab: "login-register" as TabName,
                label: currentUser ? "ACCOUNT" : "LOGIN",
              },
              { tab: "wishlist" as TabName, label: `WISH(${wishlist.length})` },
              { tab: "orders" as TabName, label: "TRACK" },
            ].map(({ tab, label }) => (
              <button
                key={tab}
                onClick={() => navigate(tab)}
                className={`p-1 text-[9px] uppercase tracking-wider font-medium ${
                  activeTab === tab ||
                  (tab === "shop" && activeTab === "product-detail")
                    ? "bg-black text-white"
                    : "text-stone-600 hover:bg-stone-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* ── Main Content Area ───────────────────────────────────────────────── */}
      <main
        className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-8"
        id="customer-main-content"
      >
        {/* SHOP */}
        {activeTab === "shop" && (
          <CustomerShopView
            products={products}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={handleAddToCart}
            selectedCategory={selectedCategory}
            searchQuery={searchQuery}
            onSelectCategory={setSelectedCategory}
            onSearchQueryChange={setSearchQuery}
            onClearSearch={handleClearSearch}
            onSelectProduct={handleViewProduct}       // Sesuai interface
            renderProductIllustration={renderProductIllustration}
            onViewProduct={handleViewProduct}
          />
        )}

        {/* PRODUCT DETAIL */}
        {activeTab === "product-detail" && selectedProduct && (
          <CustomerProductDetailView
            selectedProduct={selectedProduct}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={handleAddToCart}
            onBackToShop={handleBackFromDetail}
            chosenSize={chosenSize}
            chosenColor={chosenColor}
            qty={detailQty}
            onChooseSize={setChosenSize}
            onChooseColor={setChosenColor}
            onChangeQty={setDetailQty}
            renderProductIllustration={renderProductIllustration}
          />
        )}

        {/* CHECKOUT */}
        {activeTab === "checkout" && (
          <CustomerCheckoutView
            cart={cart}
            cartSubtotal={cartSubtotal}
            shippingCharge={shippingCharge}
            grandTotal={grandTotal}
            shippingName={shippingName}
            shippingAddress={shippingAddress}
            shippingPhone={shippingPhone}
            paymentMethod={paymentMethod}
            onBackToShop={goToShop}
            onSubmitOrder={handleSubmitOrder}
            onShippingNameChange={setShippingName}
            onShippingAddressChange={setShippingAddress}
            onShippingPhoneChange={setShippingPhone}
            onPaymentMethodChange={setPaymentMethod}
          />
        )}

        {/* EDITORIAL */}
        {activeTab === "articles" && (
          <CustomerEditorialView 
            articles={articles} 
            activeArticle={activeArticle} // Diubah dari hardcoded null
            onSelectArticle={(article) => setActiveArticle(article)} // Diubah dari () => {}
            onClearArticle={() => setActiveArticle(null)} // Diubah dari () => {}
            onOpenShop={goToShop}
          />
        )}

        {/* WISHLIST */}
        {activeTab === "wishlist" && (
          <CustomerWishlistView
            products={products}
            wishlist={wishlist}
            onToggleWishlist={onToggleWishlist}
            onAddToCart={handleAddToCart}
            onOpenShop={goToShop}
          />
        )}

        {/* ORDERS */}
        {activeTab === "orders" && (
          <CustomerOrdersView orders={orders} onOpenShop={goToShop} />
        )}

        {/* PROFILE / LOGIN / REGISTER */}
        {activeTab === "login-register" && (
          <CustomerProfileView
            currentUser={currentUser}
            isRegistering={isRegistering}
            onToggleRegistering={setIsRegistering}
            onUpdateCurrentUser={setCurrentUser}
            onLogout={handleLogout}
            onSaveProfile={handleSaveProfile}
            onShippingNameChange={setShippingName}
            onShippingAddressChange={setShippingAddress}
            onShippingPhoneChange={setShippingPhone}

            // TAMBAHKAN TYPE : any DISINI UNTUK MENYEMBUHKAN ERROR TS(2339)
            onLoginSuccess={(user: any) => handleUnifiedLoginIntercept(user.role, user)}
            onRegisterSuccess={(user: any) => handleUnifiedLoginIntercept("customer", user)}
            triggerToast={triggerToast}
          />
        )}
        
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      {activeTab !== "login-register" && (
        <footer className="bg-white text-black pt-16 pb-0 px-6 md:px-12 mt-24">
          <div className="max-w-[1400px] w-full mx-auto border-t border-stone-300 pt-8 flex flex-col justify-between min-h-[40vh] md:min-h-[50vh]">
            
            {/* ── Navigation Row ── */}
            <div className="flex flex-col md:flex-row justify-between items-center text-[13px] md:text-sm font-sans text-stone-600 gap-8 md:gap-0">
              <a href="tel:+6285236938076" className="hover:text-black transition-colors cursor-pointer">
                (+62) 852-3693-8076
              </a>
              
              <span className="text-stone-400 font-light text-lg hidden md:block select-none">+</span>
              
              <div className="flex items-center gap-8 md:gap-12">
                <button className="hover:text-black transition-colors cursor-pointer">
                  <a href="https://vera-184e51.webflow.io/">Home</a>
                </button>
                <button 
                  onClick={goToShop} 
                  className="hover:text-black transition-colors cursor-pointer"
                >
                  Shop
                </button>
                <button className="hover:text-black transition-colors cursor-pointer">
                  Articles
                </button>
              </div>
              
              <span className="text-stone-400 font-light text-lg hidden md:block select-none">+</span>
              
              <div className="flex items-center gap-8">
                <a href="https://instagram.com/fahmisyhbb" className="hover:text-black transition-colors cursor-pointer">IG</a>
                <a href="#" className="hover:text-black transition-colors cursor-pointer">LI</a>
              </div>
            </div>

            {/* ── Giant Logo Area ── */}
            <div className="mt-24 md:mt-auto pt-12 flex justify-center items-end overflow-hidden">
              <span className="text-xs md:text-sm font-sans text-stone-600 mb-4 md:mb-10 mr-2 md:mr-4">
                ©2026
              </span>
              {/* 
                Menggunakan font-sans, ketebalan maksimal (black), 
                dan tracking sangat rapat untuk meniru gaya logo referensi 
              */}
              <span className="text-[35vw] md:text-[22vw] leading-[0.75] font-sans font-black tracking-tighter text-black select-none">
                Vera
              </span>
            </div>

          </div>
        </footer>
      )}

        {/* ── Cart Drawer Overlay ────────────────────────────────────────────── */}
      {isCartOpen && (
        <CartDrawer
          cart={cart}
          onClose={() => setIsCartOpen(false)}
          onUpdateQty={handleUpdateQty}
          onRemoveItem={handleRemoveFromCart}
          onGoToCheckout={handleGoToCheckout}
          onContinueShopping={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
}

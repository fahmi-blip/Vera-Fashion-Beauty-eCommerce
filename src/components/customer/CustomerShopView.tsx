import { Heart, Search } from "lucide-react";
import type { Product } from "../../types";
import type { CustomerShopViewProps } from "./types";
import { useState, useEffect } from "react";
import {Filter, X} from "lucide-react";

export default function CustomerShopView({
  products,
  wishlist,
  selectedCategory,
  searchQuery,
  onSelectCategory,
  onSearchQueryChange,
  onClearSearch,
  onSelectProduct,
  onToggleWishlist,
  onAddToCart,
  renderProductIllustration,
  onViewProduct,
}: CustomerShopViewProps) {
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  const carouselImages = [
  '/gambar/foto1.jpg', 
  '/gambar/foto2.jpg',
  '/gambar/foto3.jpg'
  ];
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  useEffect(() => {
  const timer = setInterval(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % carouselImages.length);
  }, 4000);

  // Bersihkan timer saat komponen di-unmount agar tidak bocor (memory leak)
  return () => clearInterval(timer);
}, []);
  return (
    <div className="space-y-12" id="customer-shop-view">
      <div className="bg-[#0a0a0a88] rounded-none p-8 md:p-16 text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12 border shadow-none min-h-[600px]">
  
        {/* --- MULAI BAGIAN CAROUSEL BACKGROUND --- */}
        {carouselImages.map((img, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-65' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ))}
        {/* Layer gradasi agar teks tetap terbaca meskipun gambar background terang */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-0" />
        
      
      
        <div className="space-y-6 md:w-2/3 relative z-10 text-center md:text-left">
          <span className="border border-stone-800 text-stone-400 font-mono text-[9px] uppercase tracking-[0.3em] font-light px-3.5 py-1.5 rounded-none bg-black/50 backdrop-blur-sm">
            VERA / CAPSULE SELECTIONS
          </span>
          <h1 className="text-4xl md:text-6xl font-serif tracking-[0.05em] leading-none font-extralight text-white uppercase drop-shadow-md">
            Where Pure Aesthetics <br />
            <span className="italic font-normal font-serif text-stone-300">
              Meets Couture Science
            </span>
          </h1>
          <p className="text-stone-400 text-xs md:text-sm max-w-xl font-light leading-relaxed tracking-wider drop-shadow-md">
            Carefully curated skincare serums and hypoallergenic bespoke apparel
            tailored for elite digital professionals. Apply luxury voucher code{" "}
            <strong className="text-white font-mono font-medium">
              VERAVIP10
            </strong>{" "}
            at checkout to redeem VIP privileges.
          </p>
          <div className="flex flex-wrap gap-4 pt-3 justify-center md:justify-start">
            <button
              onClick={() => {
                onSelectCategory("skincare");
              }}
              className="bg-white text-black font-mono text-[10px] tracking-widest uppercase px-6 py-3 rounded-none hover:bg-stone-200 transition-colors cursor-pointer border border-white"
            >
              SKINCARE
            </button>
            <button
              onClick={() => {
                onSelectCategory("apparel");
              }}
              className="bg-black/50 backdrop-blur-sm text-white border border-stone-700 font-mono text-[10px] tracking-widest uppercase px-6 py-3 rounded-none hover:bg-stone-900/80 transition-colors cursor-pointer"
            >
              COUTURE APPAREL
            </button>
          </div>
        </div>
            
      </div>

      <div
        className="bg-white rounded-none p-6 border border-stone-200/80 flex flex-col lg:flex-row gap-6 items-center justify-between"
        id="catalog-controls"
      >
        
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {[
            { id: "all", label: "ALL COLLECTIONS" },
            { id: "skincare", label: "SKINCARE" },
            { id: "cosmetics", label: "COSMETICS" },
            { id: "accessories", label: "ACCESSORIES" },
            { id: "apparel", label: "COUTURE APPAREL" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2.5 rounded-none text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-black text-white border border-black"
                  : "bg-white text-stone-500 hover:text-black border border-stone-200 hover:border-black"
              }`}
            >
              {cat.label}
            </button>
          ))}

        </div> 
        
        {/* {isFilterOpen && (
      <div className="fixed inset-0 z-50 bg-white p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold">Filter Produk</h2>
          <button onClick={() => setIsFilterOpen(false)}><X /></button>
        </div>
        {[
            { id: "all", label: "ALL COLLECTIONS" },
            { id: "skincare", label: "SKINCARE" },
            { id: "cosmetics", label: "COSMETICS" },
            { id: "accessories", label: "ACCESSORIES" },
            { id: "apparel", label: "COUTURE APPAREL" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-5 py-2.5 rounded-none text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-black text-white border border-black"
                  : "bg-white text-stone-500 hover:text-black border border-stone-200 hover:border-black"
              }`}
            >
              {cat.label}
            </button>
          ))}
      </div>
    )} */}

        <div className="relative w-full lg:w-80">
          <span className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-stone-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="SEARCH VERA CREATIONS..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full bg-white border border-stone-200 rounded-none pl-10 pr-4 py-3 text-[10px] tracking-wider uppercase font-mono focus:outline-none focus:border-black placeholder-stone-400"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-black text-[9px] font-mono tracking-widest uppercase font-semibold"
            >
              CLEAR
            </button>
          )}
        </div>
      </div>
      

      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-8 border-b border-stone-200 pb-4">
          <h3 className="text-[11px] font-mono tracking-[0.2em] text-stone-800 uppercase font-light">
            CATALOGUE COLLECTION ({filteredProducts.length} Items)
          </h3>
          <span className="text-[10px] text-stone-400 tracking-wider font-light uppercase font-mono">
            SELECT PIECE FOR SIZE GUIDES, COMPOSITIONS & RITUALS
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8">
            <p className="text-stone-500 text-sm">
              Tidak menemukan kecocokan produk untuk "{searchQuery}".
            </p>
            <button
              onClick={() => {
                onSelectCategory("all");
                onClearSearch();
              }}
              className="mt-4 text-xs font-semibold text-amber-600 hover:underline"
            >
              Bersihkan Filter & Reset Pencarian
            </button>
          </div>
        ) : (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            id="products-grid"
          >
            {filteredProducts.map((product) => {
              const isInWish = wishlist.includes(product.id);
              const isOutOfStock = product.stock <= 0;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-none border border-stone-200 p-5 hover:border-black transition-all duration-300 flex flex-col justify-between group relative"
                  id={`product-card-${product.id}`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product.id);
                    }}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 border border-stone-200 text-stone-500 hover:text-black transition-colors cursor-pointer rounded-none"
                    title="Save to Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 ${isInWish ? "fill-black text-black" : ""}`}
                    />
                  </button>

                  <div
                    className="cursor-pointer"
                    onClick={() => onSelectProduct(product)}
                  >
                    <div className="flex items-center justify-center min-h-[200px]">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className='w-full h-full max-h-[260px] object-fill mix-blend-multiply ' 
                        />
                      ) : (
                        renderProductIllustration(product.id, product.category)
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 mt-4">
                      <span className="text-[8px] tracking-widest uppercase font-mono font-light border border-stone-200 px-2 py-0.5 bg-white text-stone-500">
                        {product.category}
                      </span>
                      {isOutOfStock ? (
                        <span className="text-[8px] font-mono border border-red-200 text-red-650 px-2 py-0.5 uppercase tracking-wider font-semibold bg-red-50/30">
                          OUT OF STOCK
                        </span>
                      ) : product.stock < 15 ? (
                        <span className="text-[8px] font-mono border border-stone-400 text-stone-800 px-2 py-0.5 uppercase tracking-wider bg-stone-50">
                          ONLY {product.stock} LEFT
                        </span>
                      ) : (
                        <span className="text-[8px] font-mono border border-stone-200 text-stone-400 px-2 py-0.5 uppercase tracking-wider font-light">
                          IN STOCK
                        </span>
                      )}
                    </div>

                    <h4 className="font-serif text-[12px] tracking-widest text-black mt-3 font-semibold uppercase line-clamp-1 group-hover:text-stone-600 transition-colors">
                      {product.name}
                    </h4>
                    <p className="text-stone-500 text-[11px] mt-1 line-clamp-2 leading-relaxed font-light">
                      {product.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-stone-400 text-[8px] font-mono tracking-widest uppercase block">
                        PRICE
                      </span>
                      <span className="font-serif font-bold text-black text-xs tracking-wider">
                        Rp {product.price.toLocaleString("id-ID")}
                      </span>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      disabled={isOutOfStock}
                      className={`px-4 py-2 text-[9px] font-mono tracking-widest uppercase transition-colors rounded-none font-medium border ${
                        isOutOfStock
                          ? "bg-stone-50 text-stone-300 border-stone-150 cursor-not-allowed"
                          : "bg-black text-white hover:bg-stone-900 border-black"
                      }`}
                      title="Add to Canvas Cart"
                    >
                      <span>ADD</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

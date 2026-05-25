import React from "react";
import { Heart, ShoppingCart } from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  key?: string | number;
  product: Product;
  onSelect: (id: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (id: string, e: React.MouseEvent) => void;
  onInstantAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export default function ProductCard({
  product,
  onSelect,
  isWishlisted,
  onToggleWishlist,
  onInstantAddToCart
}: ProductCardProps) {
  // Use the first color variant as thumbnail if available
  const defaultImage = product.variants && product.variants.length > 0 
    ? product.variants[0].imageColorUrl 
    : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600";

  const isOutOfStock = product.stock === 0;

  return (
    <div 
      onClick={() => onSelect(product.id)}
      className="group flex flex-col bg-white border border-[#141414]/5 hover:border-[#141414]/15 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 cursor-pointer p-3 select-none animate-fade-in"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-[3/4] bg-[#F4F2EE] w-full overflow-hidden mb-4">
        <img
          src={defaultImage}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge Indicator */}
        {isOutOfStock ? (
          <div className="absolute top-3 left-3 bg-black text-white text-[8px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5">
            Sold Out
          </div>
        ) : product.stock <= 5 ? (
          <div className="absolute top-3 left-3 bg-orange-600 text-white text-[8px] uppercase tracking-[0.2em] font-semibold px-2 py-0.5">
            Last {product.stock} items
          </div>
        ) : product.isFeatured ? (
          <div className="absolute top-3 left-3 bg-[#141414] text-white text-[8px] uppercase tracking-[0.2em] font-semibold px-20 py-0.5 w-[75px] text-center">
            New
          </div>
        ) : null}

        {/* Floating Quick Action Overlays */}
        <div className="absolute right-3 bottom-3 flex flex-col gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={(e) => onToggleWishlist(product.id, e)}
            className={`p-2 bg-white/90 backdrop-blur rounded-full hover:bg-white transition-colors cursor-pointer shadow-sm`}
            title={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
          >
            <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-red-500 stroke-red-500" : "text-[#141414]"}`} />
          </button>

          {!isOutOfStock && (
            <button
              onClick={(e) => onInstantAddToCart(product, e)}
              className="p-2 bg-white/90 backdrop-blur rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer shadow-sm"
              title="Add to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Info labels */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="space-y-1">
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#141414]/40 font-semibold block">
            {product.category} &bull; {product.subCategory}
          </span>
          <h3 className="text-sm font-light leading-tight text-[#141414] tracking-tight group-hover:opacity-80 transition-opacity">
            {product.name}
          </h3>
          
          {/* Color pick indicators */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 py-1">
              {product.variants.map((v, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full inline-block border border-black/5"
                  style={{ backgroundColor: v.hex }}
                  title={v.colorName}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#141414]/5 font-sans">
          <span className="text-xs font-semibold text-[#141414]">
            {product.price.toLocaleString("id-ID")} IDR
          </span>
          <span className="text-[9px] uppercase tracking-[0.2em] text-[#141414]/60 border-b border-black/30 pb-0.5 group-hover:border-black transition-all">
            Discover
          </span>
        </div>
      </div>
    </div>
  );
}

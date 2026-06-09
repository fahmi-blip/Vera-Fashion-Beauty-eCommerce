import { Heart, ShoppingBag } from "lucide-react";
import type { CustomerWishlistViewProps } from "./types";

export default function CustomerWishlistView({
  products,
  wishlist,
  onOpenShop,
  onToggleWishlist,
  onAddToCart,
}: CustomerWishlistViewProps) {
  return (
    <div className="space-y-6" id="customer-wishlist-view">
      <div>
        <h2 className="text-2xl font-serif text-black font-light tracking-wide uppercase">
          YOUR WISHLIST
        </h2>
        <p className="text-stone-500 text-xs mt-1 uppercase font-mono tracking-wider">
          Save coveted pieces here to acquire them in future curation releases.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="bg-white rounded-none border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-none border border-stone-200 bg-stone-50 flex items-center justify-center mx-auto text-stone-700">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-light text-black uppercase tracking-wider">
              WISHLIST IS CURRENTLY EMPTY
            </h4>
            <p className="text-stone-400 text-xs mt-1 font-mono tracking-wide">
              You have not marked any pieces. Explore our couture showcase
              catalogues now.
            </p>
          </div>
          <button
            onClick={onOpenShop}
            className="bg-black text-white px-6 py-3 rounded-none text-[10px] font-mono tracking-widest uppercase hover:bg-stone-900 border border-black transition-colors cursor-pointer"
          >
            EXPLORE ATELIER
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products
            .filter((product) => wishlist.includes(product.id))
            .map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-none border border-stone-200 p-5 flex gap-4 items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-stone-50 border border-stone-200 rounded-none overflow-hidden flex items-center justify-center font-bold text-xs text-stone-900 font-serif">
                    {product.id === "prod-1"
                      ? "🌹 Rose"
                      : product.id === "prod-2"
                        ? "💄 Lip"
                        : product.id === "prod-3"
                          ? "⚜️ Gold"
                          : "👕 Blazer"}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] uppercase font-mono tracking-widest text-stone-400 block">
                      {product.category}
                    </span>
                    <h4 className="font-serif font-semibold text-black text-sm uppercase tracking-wider line-clamp-1">
                      {product.name}
                    </h4>
                    <p className="font-semibold text-black text-xs font-mono">
                      Rp {product.price.toLocaleString("id-ID")}
                    </p>
                    <span className="text-[9px] text-stone-600 block bg-stone-50 max-w-max px-2 py-0.5 border border-stone-200 uppercase font-mono">
                      AVAILABLE ({product.stock})
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 font-sans">
                  <button
                    onClick={() => onAddToCart(product)}
                    disabled={product.stock <= 0}
                    className="bg-black text-white border border-black hover:bg-stone-900 text-[10px] font-mono tracking-widest uppercase px-4 py-2.5 rounded-none flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>ADD</span>
                  </button>

                  <button
                    onClick={() => onToggleWishlist(product.id)}
                    className="text-stone-400 hover:text-black text-[9px] font-mono uppercase tracking-widest py-1 text-center cursor-pointer"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

import { Heart } from "lucide-react";
import type { CustomerProductDetailViewProps } from "./types";

export default function CustomerProductDetailView({
  selectedProduct,
  wishlist,
  chosenSize,
  chosenColor,
  qty,
  onBackToShop,
  onChooseSize,
  onChooseColor,
  onChangeQty,
  onToggleWishlist,
  onAddToCart,
  renderProductIllustration,
}: CustomerProductDetailViewProps) {
  const currentImage = chosenColor && selectedProduct.colorImages?.[chosenColor] 
  ? selectedProduct.colorImages[chosenColor] 
  : selectedProduct.image;
  return (
    <div className="space-y-8 animate-fade-in" id="product-detail-view-page">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-550 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Back to Shop
        </button>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          VERA Exclusive Beauty Detail
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white rounded-none p-6 md:p-12  border-stone-200 shadow-none">
        <div className="space-y-4">
          <div className="rounded-none overflow-hidden border border-stone-200 flex items-center justify-center  bg-stone-50/50 min-h-80 relative">
            {currentImage ? (
              <img 
                src={currentImage}
                alt={`${selectedProduct.name} ${chosenColor || ''}`} 
                className="w-full h-full object-fill mix-blend-multiply transition-all duration-300" 
              />
            ) : (
              renderProductIllustration(
                selectedProduct.id,
                selectedProduct.category
              )
            )}
            <span className="absolute top-4 left-4 text-[9px] font-mono uppercase bg-black text-white font-light tracking-widest px-3 py-1 rounded-none border border-black">
              {selectedProduct.category}
            </span>
          </div>

          {selectedProduct.ingredients && (
            <div className="bg-stone-50 border border-stone-200 p-5 rounded-none space-y-2 mt-4 text-xs font-sans">
              <h5 className="font-bold text-black tracking-[0.2em] font-mono uppercase text-[9px]">
                COMPOSITION & INGREDIENTS:
              </h5>
              <p className="text-stone-500 leading-relaxed font-light">
                {selectedProduct.ingredients}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1 font-mono text-[10px] tracking-wider text-stone-500">
              <span className="text-black font-semibold">
                ★ {selectedProduct.rating} / 5
              </span>
              <span>•</span>
              <span>({selectedProduct.reviewCount} REVIEWS)</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-serif font-light text-black mt-2 tracking-wide uppercase">
              {selectedProduct.name}
            </h2>
            <div className="text-xl font-bold font-mono text-black mt-2">
              Rp {selectedProduct.price.toLocaleString("id-ID")}
            </div>
          </div>

          <p className="text-stone-600 leading-relaxed font-light text-xs tracking-wide">
            {selectedProduct.description}
          </p>

          <div className="grid grid-cols-2 gap-4 border-t border-b border-stone-100 py-4 font-mono text-xs">
            <div>
              <span className="text-stone-400 block uppercase text-[8px] tracking-widest">
                STOCK STATUS
              </span>
              <span
                className={`font-semibold tracking-wider ${selectedProduct.stock > 0 ? "text-stone-900 border-b border-black" : "text-red-500"}`}
              >
                {selectedProduct.stock > 0
                  ? `${selectedProduct.stock} UNITS AVAILABLE`
                  : "OUT OF STOCK"}
              </span>
            </div>
            <div>
              <span className="text-stone-400 block uppercase text-[8px] tracking-widest">
                DELIVERY LOGISTICS
              </span>
              <span className="text-stone-800 font-semibold tracking-wider">
                CARGO & SAMEDAY SECURE
              </span>
            </div>
          </div>

          {selectedProduct.sizes && (
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-stone-400 uppercase block tracking-widest font-semibold">
                SELECT SIZE GUIDE:
              </span>
              <div className="flex gap-2">
                {selectedProduct.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => onChooseSize(size)}
                    className={`px-4 py-2 border rounded-none text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                      chosenSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-stone-600 hover:bg-stone-50 border-stone-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedProduct.colors && (
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-stone-400 uppercase block tracking-widest font-semibold">
                SELECT COLOUR TONE:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedProduct.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => onChooseColor(color)}
                    className={`px-4 py-2 border rounded-none text-[10px] font-mono tracking-widest uppercase transition-colors cursor-pointer ${
                      chosenColor === color
                        ? "bg-black text-white border-black"
                        : "bg-white text-stone-600 hover:bg-stone-50 border-stone-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 pt-2">
            <span className="font-mono text-[9px] text-stone-400 uppercase tracking-widest font-semibold">
              QUANTITY:
            </span>
            <div className="flex items-center border border-stone-200 rounded-none overflow-hidden bg-stone-50">
              <button
                onClick={() => onChangeQty(Math.max(1, qty - 1))}
                className="px-3.5 py-2 hover:bg-stone-200/50 text-stone-600 font-bold transition-colors cursor-pointer"
              >
                -
              </button>
              <span className="px-3 text-xs font-semibold font-mono w-8 text-center">
                {qty}
              </span>
              <button
                onClick={() => onChangeQty(qty + 1)}
                className="px-3.5 py-2 hover:bg-stone-200/50 text-stone-600 font-bold transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-stone-100">
            <button
              onClick={() => onToggleWishlist(selectedProduct.id)}
              className="px-6 py-3.5 border border-stone-200 rounded-none text-[10px] font-mono tracking-widest uppercase transition-all flex items-center justify-center gap-2 cursor-pointer bg-white text-stone-900 hover:border-black shrink-0"
            >
              <Heart
                className={`w-3.5 h-3.5 ${wishlist.includes(selectedProduct.id) ? "fill-black text-black" : "text-stone-400"}`}
              />
              {wishlist.includes(selectedProduct.id)
                ? "SAVED TO WISHLIST"
                : "SAVE TO WISHLIST"}
            </button>

            <button
              onClick={() => {
                onAddToCart(selectedProduct, chosenSize, chosenColor, qty);
                onBackToShop();
              }}
              disabled={selectedProduct.stock <= 0}
              className="flex-1 bg-black text-white border border-black rounded-none py-3.5 text-[10px] font-mono tracking-widest uppercase hover:bg-stone-900 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:bg-stone-100 disabled:text-stone-300 disabled:border-stone-150"
            >
              <span>ADD TO SHOPPING CART</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

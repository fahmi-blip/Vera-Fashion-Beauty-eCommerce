// components/customer/CartDrawer.tsx
// Komponen drawer keranjang belanja: slide dari kanan, bisa update qty, hapus item, checkout.

import React from 'react';
import { ShoppingBag, X, Trash2, ArrowRight } from 'lucide-react';
import { CartItem } from '../../types';

interface CartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onGoToCheckout: () => void;
  onContinueShopping: () => void;
}

const PRODUCT_EMOJIS: Record<string, string> = {
  'prod-1': '🌹',
  'prod-2': '💄',
  'prod-3': '⚜️',
  'prod-4': '👕',
};

export default function CartDrawer({
  cart,
  onClose,
  onUpdateQty,
  onRemoveItem,
  onGoToCheckout,
  onContinueShopping,
}: CartDrawerProps) {
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shippingCharge = cartSubtotal > 500000 ? 0 : 35000;
  const grandTotal = cartSubtotal + shippingCharge;

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex justify-end">
      <div className="bg-white w-full max-w-md h-full flex flex-col justify-between border-l border-stone-200 animate-slide-left rounded-none">

        {/* Header */}
        <div className="p-6 border-b border-stone-200 flex justify-between items-center bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-black" />
            <h3 className="font-serif font-light text-sm text-black tracking-widest uppercase">YOUR SELECTION BAG</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-stone-50 border border-transparent hover:border-stone-200 transition-colors cursor-pointer rounded-none"
            id="close-cart-btn"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>

        {/* Items */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {cart.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-12 h-12 border border-stone-200 bg-stone-50 flex items-center justify-center mx-auto text-stone-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="font-serif font-light text-xs uppercase tracking-widest text-black">YOUR BAG IS VACANT</h5>
                <p className="text-stone-400 font-mono text-[9px] uppercase tracking-wider">No exquisite formulations or silhouettes loaded yet.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-stone-200 font-mono">
              {cart.map((item, index) => (
                <div key={index} className="py-4 flex gap-4 justify-between items-start">
                  <div className="flex gap-3.5 items-center">
                    <div className="w-14 h-14 bg-stone-50 border border-stone-200 flex items-center justify-center text-xl shrink-0 select-none rounded-none">
                      {PRODUCT_EMOJIS[item.product.id] || '🛍️'}
                    </div>
                    <div className="text-xs space-y-1">
                      <h4 className="font-serif font-semibold text-black uppercase tracking-wider line-clamp-1">{item.product.name}</h4>
                      <span className="font-mono text-black block text-[10px]">IDR {item.product.price.toLocaleString('id-ID')}</span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-1 text-[9px] uppercase tracking-wider text-stone-500 font-mono">
                        {item.selectedSize && (
                          <span className="border border-stone-200 bg-stone-50 px-1.5 py-0.5 rounded-none font-medium">SIZE: {item.selectedSize}</span>
                        )}
                        {item.selectedColor && (
                          <span className="border border-stone-200 bg-stone-50 px-1.5 py-0.5 rounded-none font-medium">TONE: {item.selectedColor}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between gap-3 h-full self-stretch">
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-stone-300 hover:text-black p-1 cursor-pointer transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center border border-stone-200 rounded-none overflow-hidden bg-white text-[10px]">
                      <button
                        onClick={() => onUpdateQty(index, item.quantity - 1)}
                        className="px-2.5 py-1 text-black font-medium hover:bg-stone-50 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-1.5 font-semibold text-black">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(index, item.quantity + 1)}
                        className="px-2.5 py-1 text-black font-medium hover:bg-stone-50 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 space-y-4 bg-stone-50 font-mono">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-stone-500 uppercase tracking-widest text-[9px]">
                <span>BAG SUBTOTAL</span>
                <span>IDR {cartSubtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-stone-500 uppercase tracking-widest text-[9px]">
                <span>PRIORITY DISPATCH</span>
                <span>{shippingCharge === 0 ? 'FREE (VIP COURIER)' : `IDR ${shippingCharge.toLocaleString('id-ID')}`}</span>
              </div>
              {shippingCharge > 0 && (
                <p className="text-[9px] text-stone-400 italic text-right">Orders above IDR 500,000 benefit from complimentary shipping</p>
              )}
              <div className="flex justify-between font-semibold text-black text-xs pt-3 border-t border-stone-200 uppercase tracking-widest">
                <span>GRAND TOTAL AMOUNT</span>
                <span>IDR {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
            <div className="flex gap-2.5 pt-1">
              <button
                onClick={onContinueShopping}
                className="flex-1 py-3.5 text-[9px] font-mono tracking-widest uppercase text-stone-700 bg-white border border-stone-300 hover:bg-stone-50 transition-colors text-center cursor-pointer rounded-none"
              >
                CONTINUE SHOPPING
              </button>
              <button
                onClick={onGoToCheckout}
                className="flex-1 py-3.5 bg-black hover:bg-stone-900 text-white font-mono text-[9px] tracking-widest uppercase text-center flex items-center justify-center gap-2 cursor-pointer rounded-none border border-black"
                id="checkout-trigger-btn"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
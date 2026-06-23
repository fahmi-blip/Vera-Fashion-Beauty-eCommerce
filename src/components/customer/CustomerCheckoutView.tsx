import { CreditCard } from "lucide-react";
import type { CustomerCheckoutViewProps } from "./types";

export default function CustomerCheckoutView({
  cart,
  cartSubtotal,
  shippingCharge,
  grandTotal,
  shippingName,
  shippingAddress,
  shippingPhone,
  paymentMethod,
  onBackToShop,
  onSubmitOrder,
  onShippingNameChange,
  onShippingAddressChange,
  onShippingPhoneChange,
  onPaymentMethodChange,
}: CustomerCheckoutViewProps) {
  return (
    <div className="space-y-8 animate-fade-in" id="checkout-view-page">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBackToShop}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-550 hover:text-slate-900 transition-colors cursor-pointer"
        >
          Kembali Belanja
        </button>
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
          VERA Secure Checkout Portal
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-none p-6 md:p-8 border border-stone-200 shadow-none space-y-6">
          <div>
            <h3 className="text-lg font-serif font-light text-black tracking-[0.1em] uppercase">
              SHIPPING IDENTIFICATION
            </h3>
          </div>

          <form
            onSubmit={onSubmitOrder}
            className="space-y-4 text-xs font-mono"
          >
            <div>
              <label className="font-semibold text-stone-500 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                RECIPIENT NAME
              </label>
              <input
                type="text"
                required
                value={shippingName}
                onChange={(e) => onShippingNameChange(e.target.value)}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors uppercase font-mono tracking-wider placeholder-stone-400 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-500 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                MOBILE CONTACT NUMBER
              </label>
              <input
                type="text"
                required
                value={shippingPhone}
                onChange={(e) => onShippingPhoneChange(e.target.value)}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors font-mono tracking-wider placeholder-stone-400 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-500 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                DETAILED PARCEL DISTRIBUTION ADDRESS
              </label>
              <textarea
                rows={3}
                required
                value={shippingAddress}
                onChange={(e) => onShippingAddressChange(e.target.value)}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors leading-relaxed uppercase font-mono tracking-wider text-xs placeholder-stone-400"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-500 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                SECURE PAYMENT PORTAL CHANNEL
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  "VeraPay (Secure Balance)",
                  "Credit/Debit Card (Visa/Mastercard Verified)",
                ].map((method) => (
                  <button
                    type="button"
                    key={method}
                    onClick={() => onPaymentMethodChange(method)}
                    className={`p-4 border rounded-none text-left cursor-pointer transition-all ${
                      paymentMethod === method
                        ? "border-black bg-stone-50 text-black font-semibold"
                        : "border-stone-250 bg-white hover:bg-stone-50 text-stone-500"
                    }`}
                  >
                    <div className="text-[8px] uppercase tracking-widest font-mono font-medium text-stone-450">
                      SECURE CHANNEL
                    </div>
                    <div className="text-[10px] mt-1 tracking-wider uppercase font-mono">
                      {method}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="w-full bg-black text-white hover:bg-stone-900 border border-black rounded-none py-4 font-mono text-[10px] tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
              >
                <CreditCard className="w-3.5 h-3.5 text-white" /> SUBMIT SECURE
                SECURE TRANSACTION
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-none p-6 border border-stone-200 shadow-none space-y-4 h-fit">
          <span className="text-[9px] font-mono tracking-widest uppercase font-light text-stone-700 block border-b border-stone-200 pb-3">
            CART ITEMS SUMMARY
          </span>
          <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${idx}`}
                className="flex gap-4 text-xs items-center pb-2 border-b border-stone-100"
              >
                <div className="w-10 h-10 rounded-none border border-stone-200 shrink-0 flex items-center justify-center font-mono font-bold text-[8px] tracking-widest uppercase text-stone-500">
                  VERA
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif font-semibold text-black uppercase tracking-wider text-[11px] line-clamp-1">
                    {item.product.name}
                  </h4>
                  <span className="text-[9px] text-stone-400 block font-mono">
                    SIZE: {item.selectedSize || "FREE-SIZE"} | QTY:{" "}
                    {item.quantity}
                  </span>
                </div>
                <span className="font-mono text-black shrink-0 font-medium text-[11px]">
                  IDR{" "}
                  {(item.product.price * item.quantity).toLocaleString("id-ID")}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-stone-550">
              <span>SUBTOTAL:</span>
              <span>IDR {cartSubtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between text-stone-550">
              <span>PRIORITY DELIVERY:</span>
              <span>
                {shippingCharge === 0
                  ? "FREE"
                  : `IDR ${shippingCharge.toLocaleString("id-ID")}`}
              </span>
            </div>
            <div className="flex justify-between text-xs text-black border-t border-stone-200 pt-3 font-semibold">
              <span>TOTAL AMOUNT:</span>
              <span>IDR {grandTotal.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
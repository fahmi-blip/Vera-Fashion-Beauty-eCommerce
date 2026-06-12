import { Box, Check, CreditCard, Info, Truck } from "lucide-react";
import type { CustomerOrdersViewProps } from "./types";

export default function CustomerOrdersView({
  orders,
  onOpenShop,
}: CustomerOrdersViewProps) {
  return (
    <div className="space-y-6" id="customer-orders-view">
      <div>
        <h2 className="text-2xl font-serif text-black font-light tracking-wide uppercase">
          ORDER LOGISTICS TRACKER
        </h2>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-none border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-none border border-stone-200 bg-stone-50 flex items-center justify-center mx-auto text-stone-700">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-serif font-light text-black uppercase tracking-wider">
              NO ACTIVE SHIPMENTS FOUND
            </h4>
            <p className="text-stone-450 text-xs mt-1 font-mono tracking-wide leading-relaxed">
              You have not committed any checkout orders yet. Please add items
              to your secure cart to process direct premium courier dispatch.
            </p>
          </div>
          <button
            onClick={onOpenShop}
            className="bg-black text-white px-6 py-3 rounded-none text-[10px] font-mono tracking-widest uppercase hover:bg-stone-900 border border-black transition-colors cursor-pointer"
          >
            START CULTIVATING
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-none border border-stone-200 overflow-hidden shadow-none flex flex-col"
              id={`active-order-card-${order.id}`}
            >
              <div className="bg-stone-50 p-5 border-b border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-mono">
                <div>
                  <span className="text-stone-400 font-mono tracking-widest block uppercase text-[8px]">
                    TRANSACTION ID
                  </span>
                  <strong className="text-black text-xs font-semibold">
                    {order.id}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block tracking-widest text-[8px] uppercase">
                    DATE AND TIME
                  </span>
                  <span className="font-medium text-stone-800">
                    {order.date}
                  </span>
                </div>
                <div>
                  <span className="text-stone-400 block tracking-widest text-[8px] uppercase">
                    TOTAL AMOUNT
                  </span>
                  <strong className="text-black font-mono text-xs font-bold">
                    IDR {order.total.toLocaleString("id-ID")}
                  </strong>
                </div>
                <div>
                  <span className="text-stone-400 block tracking-widest text-[8px] uppercase">
                    PAYMENT CHANNEL
                  </span>
                  <span className="border border-stone-300 text-stone-700 bg-white font-mono px-2 py-0.5 text-[9px] uppercase tracking-wider">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h4 className="text-[10px] font-mono tracking-widest uppercase font-light text-stone-400">
                    LOGISTICS DISPATCH TRACKER
                  </h4>

                  <div className="relative pt-2">
                    <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-stone-200 block" />

                    <div className="space-y-6 relative z-10">
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-none flex items-center justify-center border ${
                            order.status === "pending"
                              ? "bg-stone-50 border-stone-800 text-black"
                              : "bg-black border-black text-white"
                          }`}
                        >
                          <Box className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <h5 className="font-serif font-semibold text-black uppercase tracking-wider text-sm">
                            ORDER RECEIVED & STAGE DIRECTIVE
                          </h5>
                          <p className="text-stone-500 font-light leading-relaxed">
                            System successfully registered the invoice. Direct
                            dispatching logs are preparing harian slots
                            verification.
                          </p>
                          <span className="text-[9px] text-stone-400 font-mono block">
                            STATUS: COMPLETE
                          </span>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-none flex items-center justify-center border ${
                            ["paid", "shipped", "delivered"].includes(
                              order.status,
                            )
                              ? "bg-black border-black text-white"
                              : "bg-stone-50 border-stone-200 text-stone-400"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <h5 className="font-serif font-semibold text-black uppercase tracking-wider text-sm">
                            SECURITY CONFLICT AUDITED & APPROVED
                          </h5>
                          <p className="text-stone-500 font-light leading-relaxed">
                            Funds captured securely by {order.paymentMethod}{" "}
                            gateway. Cleared from any system verification hold.
                          </p>
                          {["paid", "shipped", "delivered"].includes(
                            order.status,
                          ) && (
                            <span className="text-[9px] text-stone-400 font-mono block">
                              VERIFIED TRANSACTION ID
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-none flex items-center justify-center border ${
                            ["shipped", "delivered"].includes(order.status)
                              ? "bg-black border-black text-white"
                              : "bg-stone-50 border-stone-200 text-stone-400"
                          }`}
                        >
                          <Truck className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <h3 className="font-serif font-semibold text-black uppercase tracking-wider text-sm">
                            CONVEYANCE UNDER MITRA HIGHWAY DISPATCH
                          </h3>
                          <p className="text-stone-500 font-light leading-relaxed">
                            Handed over to secure premium luxury carrier
                            dispatchers. TRACKING ID: VR-9384-DIOR
                          </p>
                          {["shipped", "delivered"].includes(order.status) && (
                            <span className="text-[9px] font-mono border border-stone-300 text-stone-700 bg-stone-50 px-2 py-0.5 uppercase">
                              DISPATCH TRAVEL ACTIVE
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-none flex items-center justify-center border ${
                            order.status === "delivered"
                              ? "bg-black border-black text-white"
                              : "bg-stone-50 border-stone-200 text-stone-400"
                          }`}
                        >
                          <Check className="w-4 h-4" />
                        </div>
                        <div className="text-xs space-y-0.5">
                          <h5 className="font-serif font-semibold text-black uppercase tracking-wider text-sm">
                            HANDOVER COURIER TRANSIT COMPLETED
                          </h5>
                          <p className="text-stone-500 font-light leading-relaxed">
                            Secure digital confirmation signature recorded by
                            lobby desk attendant.
                          </p>
                          {order.status === "delivered" && (
                            <span className="text-[9px] text-stone-500 font-mono block">
                              SECURELY DELIVERED TO PORTAL APARTMENT
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div className="bg-stone-50 rounded-none p-4.5 border border-stone-200 flex gap-2.5 text-stone-600 text-xs font-mono">
                    <Info className="w-4 h-4 text-black shrink-0" />
                    <p className="leading-relaxed">
                      <strong>SYSTEM STATUS SIMULATION:</strong> Switch role to{" "}
                      <strong className="text-black font-semibold">
                        Admin (Budi Santoso)
                      </strong>{" "}
                      via the corner panel to transition shipping timelines
                      (e.g. "Pending" to "Shipped" or "Delivered"). Changes sync
                      immediately.
                    </p>
                  </div> */}
                </div>

                <div className="bg-stone-50/50 rounded-none p-5 border border-stone-200 space-y-4 font-mono">
                  <h4 className="text-[10px] font-mono tracking-widest uppercase font-light text-stone-400">
                    PIECE CONTENTS DETAILS
                  </h4>

                  <div className="divide-y divide-stone-250">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="py-3 flex justify-between text-xs"
                      >
                        <div>
                          <span className="font-serif font-semibold text-black uppercase tracking-wider">
                            {item.product.name}
                          </span>
                          <div className="text-[9px] text-stone-400 space-y-0.5 mt-1 font-mono uppercase tracking-wider">
                            <div>QTY: {item.quantity}X</div>
                            {item.selectedSize && (
                              <div>SIZE: {item.selectedSize}</div>
                            )}
                            {item.selectedColor && (
                              <div>TONE: {item.selectedColor}</div>
                            )}
                          </div>
                        </div>
                        <span className="font-mono text-black font-medium">
                          IDR{" "}
                          {(item.product.price * item.quantity).toLocaleString(
                            "id-ID",
                          )}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
                    <div className="flex justify-between text-stone-500">
                      <span>SUBTOTAL:</span>
                      <span>IDR {order.total.toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between text-stone-500">
                      <span>PROTECTIVE DELIVERY:</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between font-semibold text-black text-[13px] pt-3 border-t border-stone-200">
                      <span>GRAND TOTAL:</span>
                      <span>IDR {order.total.toLocaleString("id-ID")}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-3 border-t border-stone-200">
                    <span className="text-[8px] font-mono uppercase text-stone-400 block tracking-widest">
                      DELIVERY DESTINATION CODES
                    </span>
                    <p className="text-[11px] text-stone-600 leading-relaxed font-light uppercase tracking-wider">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

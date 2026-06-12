import React from "react";
import CustomerLoginForm from "./CustomerLoginForm";
import CustomerRegisterForm from "./CustomerRegisterForm";
import { CustomerUser } from "./types";

interface UpgradedProfileViewProps {
  currentUser: CustomerUser | null;
  isRegistering: boolean;
  onToggleRegistering: (value: boolean) => void;
  onUpdateCurrentUser: (user: CustomerUser | null) => void;
  onLogout: () => void;
  onSaveProfile: (event: React.FormEvent) => void;
  onShippingNameChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
  
  // Callback tambahan untuk integrasi data dummy
  onLoginSuccess: (user: any) => void;
  onRegisterSuccess: (user: any) => void;
  triggerToast: (msg: string) => void;
}

export default function CustomerProfileView({
  currentUser,
  isRegistering,
  onToggleRegistering,
  onUpdateCurrentUser,
  onLogout,
  onSaveProfile,
  onShippingNameChange,
  onShippingAddressChange,
  onShippingPhoneChange,
  onLoginSuccess,
  onRegisterSuccess,
  triggerToast,
}: UpgradedProfileViewProps) {
  return (
    <div
      className="max-w-2xl mx-auto space-y-12 animate-fade-in"
      id="login-register-view-page"
    >
      <div className="text-center pt-8 space-y-3">
        
        <h2 className="text-2xl font-serif font-light text-black tracking-[0.1em] uppercase">
          {currentUser
            ? "ACCOUNT PROFILE"
            : "VERA: FASHION & BEAUTY"}
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto tracking-wide font-light leading-relaxed">
          {currentUser
            ? "Verify or refine your bespoke registration credentials below."
            : "Identify yourself or sign up to access wishlist curation, express checkout, and VIP concessions."}
        </p>
      </div>

      {currentUser ? (
        /* ── KONDISI SUDAH LOGIN: Tampilkan Form Edit Profil ── */
        <div className="bg-white rounded-none p-6 md:p-8 border border-stone-200 shadow-none space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-200 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-none bg-stone-900 text-white font-serif font-normal text-lg flex items-center justify-center">
                {currentUser.name
                  .split(" ")
                  .map((name) => name[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <h4 className="text-sm font-serif font-semibold text-black uppercase tracking-wider">
                  {currentUser.name}
                </h4>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-white text-stone-700 hover:text-black hover:border-black text-[9px] font-mono uppercase tracking-widest rounded-none border border-stone-300 transition-colors cursor-pointer"
            >
              Logout Akun
            </button>
          </div>

          <form
            onSubmit={onSaveProfile}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono"
          >
            <div>
              <label className="font-semibold text-stone-550 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                FULL NAME
              </label>
              <input
                type="text"
                required
                value={currentUser.name}
                onChange={(e) => {
                  onUpdateCurrentUser({ ...currentUser, name: e.target.value });
                  onShippingNameChange(e.target.value);
                }}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors font-mono tracking-wider text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-550 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                PRIMARY EMAIL ADDRESS
              </label>
              <input
                type="email"
                required
                value={currentUser.email}
                onChange={(e) =>
                  onUpdateCurrentUser({ ...currentUser, email: e.target.value })
                }
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors font-mono tracking-wider text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-550 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                CONTACT PHONE
              </label>
              <input
                type="text"
                required
                value={currentUser.phone}
                onChange={(e) => {
                  onUpdateCurrentUser({ ...currentUser, phone: e.target.value });
                  onShippingPhoneChange(e.target.value);
                }}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors font-mono tracking-wider text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-stone-550 block mb-1 uppercase text-[8px] tracking-[0.2em]">
                VERIFIED POSTAL ADDRESS
              </label>
              <input
                type="text"
                required
                value={currentUser.address}
                onChange={(e) => {
                  onUpdateCurrentUser({ ...currentUser, address: e.target.value });
                  onShippingAddressChange(e.target.value);
                }}
                className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black transition-colors font-mono tracking-wider text-xs"
              />
            </div>
            <div className="md:col-span-2 pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3.5 bg-black text-white border border-black hover:bg-stone-950 font-mono text-[9px] tracking-widest uppercase cursor-pointer rounded-none"
              >
                SAVE PROFILE DETAILS
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* ── KONDISI BELUM LOGIN: Render Selektor Tab & Form Terpisah ── */
        <div className="bg-white rounded-none p-6 md:p-8 border border-stone-200 shadow-none space-y-6 max-w-sm mx-auto">
          <div className="grid grid-cols-2 gap-1 border border-stone-200 p-1 rounded-none bg-stone-50">
            <button
              onClick={() => onToggleRegistering(false)}
              className={`py-2 text-center text-[10px] uppercase tracking-widest font-mono font-medium rounded-none cursor-pointer transition-all ${
                !isRegistering
                  ? "bg-black text-white"
                  : "text-stone-400 hover:text-black"
              }`}
            >
              MASUK VIP
            </button>
            <button
              onClick={() => onToggleRegistering(true)}
              className={`py-2 text-center text-[10px] uppercase tracking-widest font-mono font-medium rounded-none cursor-pointer transition-all ${
                isRegistering
                  ? "bg-black text-white"
                  : "text-stone-400 hover:text-black"
              }`}
            >
              DAFTAR AKUN
            </button>
          </div>

          {!isRegistering ? (
      <CustomerLoginForm 
        onLoginSuccess={onLoginSuccess} // Sekarang nama prop sudah sinkron & tidak error
        onToast={triggerToast} 
      />
    ) : (
      <CustomerRegisterForm 
        onRegisterSuccess={onRegisterSuccess} 
        onToast={triggerToast} 
      />
    )}
        </div>
      )}
    </div>
  );
}
import type { CustomerProfileViewProps } from "./types";

export default function CustomerProfileView({
  currentUser,
  isRegistering,
  onToggleRegistering,
  onUpdateCurrentUser,
  onLogout,
  onSaveProfile,
  onLoginSubmit,
  onRegisterSubmit,
  onShippingNameChange,
  onShippingAddressChange,
  onShippingPhoneChange,
}: CustomerProfileViewProps) {
  return (
    <div
      className="max-w-2xl mx-auto space-y-12 animate-fade-in"
      id="login-register-view-page"
    >
      <div className="text-center pt-8 space-y-3">
        <span className="text-[9px] font-mono border border-stone-200 text-stone-600 bg-white px-3.5 py-1.5 uppercase tracking-widest">
          SECURE AUTHENTICATION GATEWAY
        </span>
        <h2 className="text-2xl font-serif font-light text-black tracking-[0.1em] uppercase">
          {currentUser
            ? "VERA PARTNER STATUS: ACTIVE"
            : "ACCESS PORTAL & MEMBERSHIP"}
        </h2>
        <p className="text-xs text-stone-500 max-w-sm mx-auto tracking-wide font-light leading-relaxed">
          {currentUser
            ? "Verify or refine your bespoke registration credentials below."
            : "Identify yourself or sign up to access wishlist curation, express checkout, and VIP concessions."}
        </p>
      </div>

      {currentUser ? (
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
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-1.5 h-1.5 bg-black rounded-none" />
                  <span className="text-[9px] text-stone-550 font-mono uppercase tracking-[0.15em] font-medium">
                    PLATINUM PARTNER VIP
                  </span>
                </div>
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
                onChange={(e) =>
                  onUpdateCurrentUser({ ...currentUser, name: e.target.value })
                }
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
                onChange={(e) =>
                  onUpdateCurrentUser({ ...currentUser, phone: e.target.value })
                }
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
                onChange={(e) =>
                  onUpdateCurrentUser({
                    ...currentUser,
                    address: e.target.value,
                  })
                }
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
            <form
              onSubmit={onLoginSubmit}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  VIP EMAIL ID
                </label>
                <input
                  type="email"
                  required
                  placeholder="maya.anindita@outlook.id"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  SECURE PASSWORD
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black font-mono text-xs placeholder-stone-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-stone-900 border border-black text-white py-4 rounded-none font-medium uppercase text-[9px] tracking-widest transition-colors cursor-pointer font-mono"
              >
                AUTHORIZE AND ENTER
              </button>
            </form>
          ) : (
            <form
              onSubmit={onRegisterSubmit}
              className="space-y-4 text-xs font-mono"
            >
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  FULL NAME
                </label>
                <input
                  name="regName"
                  type="text"
                  required
                  placeholder="Example: Maya Anindita"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  OFFICIAL EMAIL ADDRESS
                </label>
                <input
                  name="regEmail"
                  type="email"
                  required
                  placeholder="Example: customer@email.id"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  MOBILE PHONE NUMBER
                </label>
                <input
                  name="regPhone"
                  type="text"
                  required
                  placeholder="Example: +62 812-xxxx-xxxx"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black font-mono text-xs placeholder-stone-400"
                />
              </div>
              <div>
                <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
                  PARCEL DELIVERY ADDRESS
                </label>
                <input
                  name="regAddress"
                  type="text"
                  required
                  placeholder="Example: Jln. Sudirman No 10, Jakarta"
                  className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-black hover:bg-stone-900 border border-black text-white py-4 rounded-none font-medium uppercase text-[9px] tracking-widest transition-colors cursor-pointer font-mono"
              >
                CREATE ACCOUNT & JOIN
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

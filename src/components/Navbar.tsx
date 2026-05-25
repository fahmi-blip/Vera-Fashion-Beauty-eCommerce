import React from "react";
import { Search, ShoppingBag, Heart, User, LogOut, Check, Briefcase } from "lucide-react";
import { User as UserType } from "../types";

interface NavbarProps {
  currentUser: UserType | null;
  onNavigate: (view: string) => void;
  cartCount: number;
  wishlistCount: number;
  currentView: string;
  onLogout: () => void;
}

export default function Navbar({
  currentUser,
  onNavigate,
  cartCount,
  wishlistCount,
  currentView,
  onLogout
}: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-20 border-b border-[#141414]/5 bg-[#F9F8F6]/80 backdrop-blur-md select-none">
      {/* Left Menu Items */}
      <div className="hidden md:flex gap-8 text-[11px] uppercase tracking-[0.2em] font-medium text-[#141414]">
        <button
          onClick={() => onNavigate("catalog")}
          className={`hover:opacity-60 transition-opacity cursor-pointer ${
            currentView === "catalog" ? "underline underline-offset-4" : ""
          }`}
        >
          Shop
        </button>
        <button
          onClick={() => onNavigate("articles")}
          className={`hover:opacity-60 transition-opacity cursor-pointer ${
            currentView === "articles" ? "underline underline-offset-4" : ""
          }`}
        >
          Editorial
        </button>
        <button
          onClick={() => {
            onNavigate("catalog");
          }}
          className="hover:opacity-60 transition-opacity cursor-pointer"
        >
          Collections
        </button>
      </div>

      {/* Brand Logo */}
      <div
        onClick={() => onNavigate("landing")}
        className="text-2xl md:text-3xl font-light tracking-[0.3em] text-[#141414] hover:opacity-80 transition-opacity cursor-pointer pl-0 md:pl-16 font-display select-none"
      >
        VERA
      </div>

      {/* Right Menu Items */}
      <div className="flex gap-4 md:gap-7 items-center text-[11px] uppercase tracking-[0.2em] font-medium text-[#141414]">
        {/* Search Dummy Toggle for premium feel */}
        <button
          onClick={() => onNavigate("catalog")}
          className="hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1"
          title="Search catalog"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Search</span>
        </button>

        {/* Wishlist Link */}
        <button
          onClick={() => onNavigate("wishlist")}
          className="relative hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1 text-xs"
          title="View Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 ${wishlistCount > 0 ? "fill-red-500 stroke-red-500" : ""}`} />
          <span className="hidden lg:inline">Wishlist</span>
          {wishlistCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#141414] text-[8px] text-white">
              {wishlistCount}
            </span>
          )}
        </button>

        {/* Cart Link */}
        <button
          onClick={() => onNavigate("cart")}
          className="relative hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1.5"
          title="View Cart"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart ({cartCount})</span>
        </button>

        {/* User Account State */}
        {currentUser ? (
          <div className="flex items-center gap-2 border-l border-[#141414]/10 pl-4 md:pl-6">
            {(currentUser.role === "admin" || currentUser.role === "superadmin") ? (
              <button
                onClick={() => onNavigate("admin-dashboard")}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#141414] text-white hover:bg-[#141414]/90 transition-all cursor-pointer text-[9px] uppercase tracking-[0.1em]"
              >
                <Briefcase className="w-2.5 h-2.5" />
                Console
              </button>
            ) : (
              <button
                onClick={() => onNavigate("order-history")}
                className="hover:opacity-75 transition-opacity cursor-pointer flex items-center gap-1 lowercase text-xs italic font-serif text-slate-600"
              >
                <User className="w-3 h-3 translate-y-[-1px]" />
                {currentUser.name.split(" ")[0]}
              </button>
            )}

            <button
              onClick={onLogout}
              className="hover:text-red-600 transition-colors ml-1 cursor-pointer"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => onNavigate("login")}
            className="hover:opacity-60 transition-opacity cursor-pointer flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
}

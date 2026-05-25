import React from "react";

interface FooterProps {
  onNavigate?: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="h-20 px-6 md:px-12 flex flex-col md:flex-row gap-4 items-center justify-between border-t border-[#141414]/5 bg-[#F9F8F6] text-[9px] uppercase tracking-[0.2em] font-medium text-[#141414]/70 mb-0">
      <div>&copy; 2026 VERA Digital Limited. All Rights Reserved.</div>
      <div className="flex gap-6 md:gap-8">
        <button
          onClick={() => onNavigate?.("articles")}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          Editorial
        </button>
        <button
          onClick={() => onNavigate?.("catalog")}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          Sustainability
        </button>
        <button
          onClick={() => onNavigate?.("catalog")}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          Shipping & Returns
        </button>
        <button
          onClick={() => onNavigate?.("catalog")}
          className="hover:opacity-100 transition-opacity cursor-pointer"
        >
          Privacy Policy
        </button>
      </div>
      <div className="font-light italic tracking-widest font-serif normal-case">
        Designed for Excellence
      </div>
    </footer>
  );
}

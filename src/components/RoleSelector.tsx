import React from 'react';
import { User, ShieldCheck, Briefcase, Sparkles } from 'lucide-react';
import { ActiveRole } from '../types';

interface RoleSelectorProps {
  currentRole: ActiveRole;
  onChangeRole: (role: ActiveRole) => void;
}

export default function RoleSelector({ currentRole, onChangeRole }: RoleSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm font-mono" id="role-selector-container">
      {/* Absolute Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-black text-white hover:bg-stone-900 text-[9px] uppercase tracking-widest px-4 py-3 rounded-none shadow-none transition-all border border-black font-medium"
          id="toggle-selector-open"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>ROLE SELECTOR SIMULATOR</span>
        </button>
      )}

      {isOpen && (
        <div 
          className="bg-black text-stone-300 p-5 shadow-none border border-stone-800 rounded-none transition-all duration-300 font-mono"
          id="selector-card"
        >
          <div className="flex justify-between items-center mb-3 border-b border-stone-800 pb-2.5">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white" />
              <h4 className="text-[10px] font-semibold tracking-widest uppercase text-white">VERA MULTI-ROLE CONSOLE</h4>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-stone-800 hover:bg-stone-900 transition-all font-mono"
              id="hide-selector-btn"
            >
              Hide
            </button>
          </div>

          <p className="text-[10px] text-stone-450 mb-3.5 leading-relaxed uppercase tracking-wide">
            Switch simulation layers instantly to trace different client, administrative, or audit panel frameworks.
          </p>

          <div className="space-y-2.5" id="persona-list">
            {/* Customer Persona */}
            <button
              onClick={() => onChangeRole('customer')}
              className={`w-full text-left p-3 rounded-none border flex items-start gap-3 transition-all ${
                currentRole === 'customer'
                  ? 'bg-stone-900 border-stone-600 text-white'
                  : 'bg-stone-950 border-stone-900 hover:border-stone-800 text-stone-400'
              }`}
              id="select-customer-btn"
            >
              <div className={`p-1.5 rounded-none ${currentRole === 'customer' ? 'bg-white text-black' : 'bg-stone-900 text-stone-400'}`}>
                <User className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-white uppercase tracking-wider">1. CUSTOMER PORTAL</span>
                  {currentRole === 'customer' && <span className="text-[8px] bg-white text-black px-1.5 py-0.2 rounded-none font-bold tracking-widest font-mono">ACTIVE</span>}
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5 leading-snug font-mono uppercase">
                  Persona: Maya Anindita (Bespespoke skincare curation tracking wishlist).
                </p>
              </div>
            </button>

            {/* Admin Persona */}
            <button
              onClick={() => onChangeRole('admin')}
              className={`w-full text-left p-3 rounded-none border flex items-start gap-3 transition-all ${
                currentRole === 'admin'
                  ? 'bg-stone-900 border-stone-600 text-white'
                  : 'bg-stone-950 border-stone-900 hover:border-stone-800 text-stone-400'
              }`}
              id="select-admin-btn"
            >
              <div className={`p-1.5 rounded-none ${currentRole === 'admin' ? 'bg-white text-black' : 'bg-stone-900 text-stone-400'}`}>
                <Briefcase className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-white uppercase tracking-wider">2. OPERATIONS ADMIN</span>
                  {currentRole === 'admin' && <span className="text-[8px] bg-white text-black px-1.5 py-0.2 rounded-none font-bold tracking-widest font-mono">ACTIVE</span>}
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5 leading-snug font-mono uppercase">
                  Persona: Budi Santoso (Catalogue stock controls, logistics dispatching, sales stats).
                </p>
              </div>
            </button>

            {/* Super Admin Persona */}
            <button
              onClick={() => onChangeRole('super_admin')}
              className={`w-full text-left p-3 rounded-none border flex items-start gap-3 transition-all ${
                currentRole === 'super_admin'
                  ? 'bg-stone-900 border-stone-600 text-white'
                  : 'bg-stone-950 border-stone-900 hover:border-stone-800 text-stone-400'
              }`}
              id="select-super-admin-btn"
            >
              <div className={`p-1.5 rounded-none ${currentRole === 'super_admin' ? 'bg-white text-black' : 'bg-stone-900 text-stone-400'}`}>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[10px] text-white uppercase tracking-wider">3. SUPER SYSTEM ADMIN</span>
                  {currentRole === 'super_admin' && <span className="text-[8px] bg-white text-black px-1.5 py-0.2 rounded-none font-bold tracking-widest font-mono">ACTIVE</span>}
                </div>
                <p className="text-[9px] text-stone-500 mt-0.5 leading-snug font-mono uppercase">
                  Persona: System Root (User accounts roster management, telemetry audit logs).
                </p>
              </div>
            </button>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-stone-850 flex justify-between items-center text-[8px] text-stone-500 font-mono tracking-wider">
            <span>SYNC: REAL-TIME SECURE</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-none bg-stone-300"></span>
              <span>SIMULATOR LIVE</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

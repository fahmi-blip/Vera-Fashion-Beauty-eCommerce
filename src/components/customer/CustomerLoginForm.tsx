import React, { useState } from "react";
import { ActiveRole } from "../../types";

// Database Dummy Terpadu (Satu Pintu untuk Semua Role)
export const unifiedDummyUsers = [
  {
    name: "Maya Anindita (Customer VIP)",
    email: "maya.anindita@outlook.id",
    password: "password123",
    role: "customer" as ActiveRole,
    phone: "+62 812-3456-7890",
    address: "Gedung Cyber, Lt. 12, Kuningan Barat, Jakarta Selatan, 12710",
  },
  {
    name: "Budi Santoso (Staff Admin)",
    email: "budi.operations@vera.com",
    password: "password123",
    role: "admin" as ActiveRole,
    phone: "+62 855-4321-8765",
    address: "Vera Operations Hub, Slipi, Jakarta",
  },
  {
    name: "Management Root (Super Admin)",
    email: "maya.anindita@vera.com",
    password: "password123",
    role: "super_admin" as ActiveRole,
    phone: "+62 811-9999-8888",
    address: "Vera Central Core Archive",
  }
];

interface CustomerLoginFormProps {
  onLoginSuccess: (user: any) => void; // Disamakan namanya dengan file profile
  onToast: (msg: string) => void;
}

export default function CustomerLoginForm({ onLoginSuccess, onToast }: CustomerLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const matched = unifiedDummyUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (matched) {
      // Langsung kirim full object matched user ke parent
      onLoginSuccess(matched); 
      onToast(`Login Berhasil! Selamat datang kembali, ${matched.name}.`);
    } else {
      setError("Akses Ditolak. Email atau password tidak terdaftar pada sistem.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
      {error && (
        <div className="p-3 bg-stone-950 text-white text-[9px] uppercase font-bold tracking-widest border border-black">
          [ AUTH_ERROR ]: {error}
        </div>
      )}
      
      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          PORTAL EMAIL ID
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="username@email.com"
          className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black font-mono text-xs placeholder-stone-400 uppercase"
        />
      </div>

      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          SECURE ACCESS KEY
        </label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••••••••"
          className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black font-mono text-xs placeholder-stone-400"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-black hover:bg-stone-900 border border-black text-white py-4 rounded-none font-medium uppercase text-[9px] tracking-widest transition-colors cursor-pointer font-mono"
      >
        VALIDATE AND ENTER SYSTEM
      </button>

      {/* Simulator Shortcut Panel (Klik untuk isi otomatis) */}
      <div className="mt-6 pt-4 border-t border-stone-200">
        <span className="block text-[7px] text-stone-400 uppercase tracking-widest font-bold mb-2">
          SIMULATOR QUICK INTEGRATION SHORTCUT
        </span>
        <div className="space-y-1.5">
          {unifiedDummyUsers.map((u) => (
            <button
              key={u.email}
              type="button"
              onClick={() => {
                setEmail(u.email);
                setPassword(u.password);
              }}
              className="w-full text-left p-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 flex justify-between items-center transition-all text-[9px]"
            >
              <div className="flex flex-col">
                <span className="font-bold text-stone-800">{u.name}</span>
                <span className="text-stone-400 text-[8px] font-normal lowercase">{u.email}</span>
              </div>
              <span className="text-[7px] bg-white border border-stone-300 px-1.5 py-0.5 uppercase tracking-widest font-bold text-stone-700">
                {u.role}
              </span>
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
import React, { useState } from "react";
import { CustomerUser } from "./types";

interface CustomerRegisterFormProps {
  onRegisterSuccess: (user: CustomerUser) => void;
  onToast: (msg: string) => void;
}

export default function CustomerRegisterForm({ onRegisterSuccess, onToast }: CustomerRegisterFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterSuccess({ name, email, phone, address });
    onToast("Registrasi Berhasil! Akun VIP Anda telah aktif.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          FULL NAME
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Example: Maya Anindita"
          className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
        />
      </div>

      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          OFFICIAL EMAIL ADDRESS
        </label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Example: customer@email.id"
          className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black uppercase font-mono text-xs placeholder-stone-400"
        />
      </div>

      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          MOBILE PHONE NUMBER
        </label>
        <input
          type="text"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Example: +62 812-xxxx-xxxx"
          className="w-full bg-white border border-stone-200 p-3 rounded-none focus:outline-none focus:border-black font-mono text-xs placeholder-stone-400"
        />
      </div>

      <div>
        <label className="font-semibold text-stone-500 block mb-1 uppercase tracking-[0.2em] text-[8px]">
          PARCEL DELIVERY ADDRESS
        </label>
        <input
          type="text"
          required
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
  );
}
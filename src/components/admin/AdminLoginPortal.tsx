// import React, { useState } from 'react';
// import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
// import { ActiveRole } from '../../types';

// // Data Kredensial Dummy khusus Admin & Super Admin Vera
// export const dummyStaffs = [
//   {
//     email: 'budi.operations@vera.com',
//     password: 'password123',
//     role: 'admin' as ActiveRole,
//     name: 'Budi Santoso',
//     title: 'OPERATIONS ADMIN'
//   },
//   {
//     email: 'maya.anindita@vera.com',
//     password: 'password123',
//     role: 'super_admin' as ActiveRole,
//     name: 'Maya Anindita',
//     title: 'SUPER SYSTEM ROOT'
//   }
// ];

// interface AdminLoginPortalProps {
//   onLoginSuccess: (role: ActiveRole, staffName: string) => void;
//   onCancel: () => void;
// }

// export default function AdminLoginPortal({ onLoginSuccess, onCancel }: AdminLoginPortalProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     setError('');

//     const matched = dummyStaffs.find(
//       (s) => s.email.toLowerCase() === email.toLowerCase() && s.password === password
//     );

//     if (matched) {
//       onLoginSuccess(matched.role, matched.name);
//     } else {
//       setError('Kredensial Administrasi Ditolak. Periksa kembali email & kode akses.');
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-stone-100 font-mono px-4 select-none">
//       <div className="w-full max-w-md bg-white p-8 border border-stone-200 shadow-none rounded-none relative">
        
//         {/* Tombol Kembali ke Shop */}
//         <button
//           onClick={onCancel}
//           className="absolute top-6 right-6 text-stone-400 hover:text-black transition-colors flex items-center gap-1 text-[9px] uppercase tracking-wider border border-stone-200 px-2 py-1 rounded-none bg-stone-50"
//         >
//           <ArrowLeft className="w-3 h-3" /> Shop
//         </button>

//         {/* Header Portal */}
//         <div className="flex items-center gap-2.5 mb-6 border-b border-stone-200 pb-4 pt-2">
//           <ShieldCheck className="w-5 h-5 text-black" />
//           <h2 className="text-xs font-bold tracking-widest uppercase text-black">
//             VERA CORE CONTROL GATEWAY
//           </h2>
//         </div>

//         <p className="text-[10px] text-stone-500 uppercase tracking-wide mb-6 leading-relaxed">
//           Area Terproteksi. Masukkan tanda pengenal digital staff untuk mengakses manajemen pergudangan, telemetri log, dan kontrol akun.
//         </p>

//         {/* Error Alert */}
//         {error && (
//           <div className="mb-5 p-3 bg-stone-950 text-white text-[9px] uppercase tracking-widest font-bold border border-black">
//             [ AUTH_ERR ]: {error}
//           </div>
//         )}

//         {/* Login Form */}
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1.5">
//               Staff Email Address
//             </label>
//             <div className="relative">
//               <Mail className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
//               <input
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 placeholder="name.operations@vera.com"
//                 className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-stone-500 text-stone-900 placeholder-stone-400 rounded-none uppercase"
//                 required
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1.5">
//               Secure Access Key
//             </label>
//             <div className="relative">
//               <Lock className="absolute left-3 top-3.5 w-3.5 h-3.5 text-stone-400" />
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 placeholder="••••••••"
//                 className="w-full pl-9 pr-4 py-3 bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-stone-500 text-stone-900 placeholder-stone-400 rounded-none"
//                 required
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-black text-white text-[10px] uppercase tracking-widest font-bold py-4 hover:bg-stone-900 transition-all rounded-none border border-black"
//           >
//             AUTHORIZE STAFF ENTRY
//           </button>
//         </form>

//         {/* Quick Simulator Accelerator Panels */}
//         <div className="mt-8 pt-5 border-t border-stone-200">
//           <span className="block text-[7px] uppercase tracking-widest text-stone-400 font-bold mb-3">
//             QUICK DASHBOARD DISPATCHER (SIMULATOR MODE)
//           </span>
//           <div className="grid grid-cols-1 gap-2">
//             {dummyStaffs.map((staff) => (
//               <button
//                 key={staff.email}
//                 type="button"
//                 onClick={() => onLoginSuccess(staff.role, staff.name)}
//                 className="w-full text-left p-3 bg-stone-50 hover:bg-stone-900 border border-stone-200 flex flex-col justify-between transition-all group text-stone-700 hover:text-white rounded-none"
//               >
//                 <div className="flex justify-between items-center w-full">
//                   <span className="text-[9px] font-bold uppercase tracking-wider group-hover:text-white text-stone-900">
//                     {staff.name}
//                   </span>
//                   <span className="text-[7px] font-bold bg-white group-hover:bg-black group-hover:text-white border border-stone-300 group-hover:border-stone-700 px-1.5 py-0.5 uppercase tracking-widest text-stone-800">
//                     {staff.title}
//                   </span>
//                 </div>
//                 <span className="text-[8px] text-stone-400 mt-1 font-mono group-hover:text-stone-400">
//                   ID: {staff.email} | Key: {staff.password}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }
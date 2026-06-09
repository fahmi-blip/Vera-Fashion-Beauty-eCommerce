import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Settings, 
  FileLock2, 
  Sparkles, 
  UserPlus, 
  Search, 
  Trash2, 
  CloudLightning, 
  Check, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Product, Order, Article, AdminUser, AuditLog } from '../types';
import AdminView from './AdminView';

interface SuperAdminViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'paid' | 'shipped' | 'delivered') => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  adminUsers: AdminUser[];
  onAddAdminUser: (adm: AdminUser) => void;
  onToggleAdminStatus: (id: string) => void;
  auditLogs: AuditLog[];
  onAddAuditLog: (action: string, details: string) => void;
}

export default function SuperAdminView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  articles,
  onAddArticle,
  onDeleteArticle,
  adminUsers,
  onAddAdminUser,
  onToggleAdminStatus,
  auditLogs,
  onAddAuditLog
}: SuperAdminViewProps) {
  
  const [superTab, setSuperTab] = useState<'system-controls' | 'operations'>('system-controls');

  // New admin user input states
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    role: 'admin' as 'admin' | 'super_admin'
  });

  // Settings mock states
  const [backupGateways, setBackupGateways] = useState(true);
  const [apiVersion, setApiVersion] = useState('V2.4.2-Release');
  const [loyaltyThreshold, setLoyaltyThreshold] = useState(500000); // 500,000 IDR for free delivery
  const [loyaltyMultipliers, setLoyaltyMultipliers] = useState('1.5x VIP multiplier');

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name.trim() || !newStaff.email.trim()) return;

    const formattedStaff: AdminUser = {
      id: `adm-${Math.floor(100 + Math.random() * 900)}`,
      name: newStaff.name,
      email: newStaff.email,
      role: newStaff.role,
      avatar: newStaff.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      status: 'active'
    };

    onAddAdminUser(formattedStaff);
    onAddAuditLog('Staff Account Added', `Super Admin provisioned access to ${formattedStaff.name} with role ${formattedStaff.role}.`);
    
    setNewStaff({
      name: '',
      email: '',
      role: 'admin'
    });
    setIsAddStaffOpen(false);
  };

  const handleToggleState = (id: string, name: string) => {
    onToggleAdminStatus(id);
    const target = adminUsers.find(a => a.id === id);
    const intent = target?.status === 'active' ? 'Suspend' : 'Activate';
    onAddAuditLog('Staff Credentials Toggled', `Toggled authority status for ${name} to ${intent === 'Suspend' ? 'Suspended' : 'Active'}.`);
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen text-[#000000] font-sans flex flex-col" id="super-admin-root">
      
      {/* Super Top selector tab to shift workspace */}
      <div className="bg-[#000000] text-white border-b border-[#000000] px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-stone-300" />
          <p className="text-[10px] font-mono uppercase tracking-widest text-stone-300">
            SUPERUSER SANDBOX CODE — FULL COUTURE ROOT PARAMETERS AUTHORIZATION
          </p>
        </div>

        <div className="flex bg-stone-900 border border-stone-850 p-1 rounded-none cursor-pointer font-mono" id="superuser-tab-selectors">
          <button
            onClick={() => setSuperTab('system-controls')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none transition-all cursor-pointer ${
              superTab === 'system-controls' 
                ? 'bg-white text-black' 
                : 'text-stone-400 hover:text-white'
            }`}
          >
            SYSTEM CONTROLS
          </button>
          <button
            onClick={() => setSuperTab('operations')}
            className={`px-3 py-1 text-[9px] font-bold uppercase tracking-widest rounded-none transition-all cursor-pointer ${
              superTab === 'operations' 
                ? 'bg-white text-black' 
                : 'text-stone-400 hover:text-white'
            }`}
          >
            BUDI COUTURE VIEW
          </button>
        </div>
      </div>

      {/* RENDER THE CORRESPONDING TAB VIEWS */}
      {superTab === 'operations' ? (
        <div className="flex-1">
          <div className="p-3 bg-stone-50 text-[9px] text-[#000000] border-b border-stone-200 text-center font-mono uppercase tracking-wider">
            Displaying the standard operational screens of Budi Santoso under superuser clearance.
          </div>
          <AdminView
            products={products}
            onAddProduct={(p) => { onAddProduct(p); onAddAuditLog('Product Created', `Added "${p.name}" to inventory.`); }}
            onUpdateProduct={(p) => { onUpdateProduct(p); onAddAuditLog('Product Modified', `Updated specifications for "${p.name}".`); }}
            onDeleteProduct={(id) => { onDeleteProduct(id); onAddAuditLog('Product Deleted', `Removed SKU id ${id} from database.`); }}
            orders={orders}
            onUpdateOrderStatus={(id, stat) => { onUpdateOrderStatus(id, stat); onAddAuditLog('Order Status Changed', `Modified status of order ${id} to "${stat}".`); }}
            articles={articles}
            onAddArticle={(art) => { onAddArticle(art); onAddAuditLog('Article Published', `Published new article: "${art.title}"`); }}
            onDeleteArticle={(id) => { onDeleteArticle(id); onAddAuditLog('Article Deleted', `Removed article reference id ${id}.`); }}
            isSuperAdmin={true}
          />
        </div>
      ) : (
        <div className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-8" id="super-admin-configurations">
          
          {/* Top visual summary banner */}
          <div className="bg-[#000000] text-white p-8 rounded-none border border-stone-850 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <span className="text-[9px] border border-stone-600 text-stone-300 font-bold font-mono px-2 py-0.5 rounded-none uppercase tracking-widest bg-stone-900">SYSTEM LEVEL CLEARANCE</span>
              <h2 className="text-xl font-serif font-light tracking-widest text-white uppercase">VERA Global Systems Configuration</h2>
              <p className="text-[11px] text-stone-300 max-w-lg font-mono leading-relaxed uppercase tracking-wider">
                Provision staff accounts, adjust gateway connection nodes, and audit real-time log histories.
              </p>
            </div>
            <div className="flex items-center gap-2 text-stone-450 text-[10px] font-mono uppercase tracking-widest">
              <CloudLightning className="w-4 h-4 text-stone-300" />
              <span>SSL PROTOCOL: SECURED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                       {/* System settings and parameters col */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-black uppercase">1. SYSTEM INTEGRATION METRICS</h3>
              
              <div className="bg-white rounded-none border border-stone-200 p-6 space-y-5">
                
                {/* Selector 1: API Release version */}
                <div className="space-y-1.5 text-[9px] font-mono tracking-widest uppercase text-stone-500">
                  <label className="font-semibold text-black block">VeraPay Gateway Node API Version</label>
                  <select
                    value={apiVersion}
                    onChange={(e) => {
                      setApiVersion(e.target.value);
                      onAddAuditLog('API Gateway Upgraded', `Migrated default API version parameters to version ${e.target.value}.`);
                    }}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase text-black cursor-pointer focus:outline-none focus:ring-1 focus:ring-black"
                  >
                    <option value="V2.4.2-Release">V2.4.2-Release (Standard Encripted)</option>
                    <option value="V3.0.0-Beta-HMR">V3.0.0-Beta (VeraPay High-Frequency Mode)</option>
                    <option value="V2.1.0-Legacy">V2.1.0-Legacy (Backward Compatible)</option>
                  </select>
                </div>

                {/* Switcher 2: Webhook proxy toggles */}
                <div className="pt-2 flex items-center justify-between border-t border-stone-100 text-[10px] font-mono tracking-widest uppercase">
                  <div>
                    <strong className="text-black font-semibold block">API Backup Core Gateways</strong>
                    <span className="text-[9px] text-stone-400 font-light block normal-case">Activate reserve nodes during load latencies</span>
                  </div>
                  <button
                    onClick={() => {
                      setBackupGateways(!backupGateways);
                      onAddAuditLog('Backup Loop Toggled', `Toggled back-up Core API routing status to ${!backupGateways ? 'active' : 'inactive'}.`);
                    }}
                    className={`px-3 py-1.5 text-[9px] font-bold rounded-none uppercase transition-all tracking-widest border cursor-pointer border-black bg-black text-white`}
                  >
                    {backupGateways ? 'ACTIVE' : 'STANDBY'}
                  </button>
                </div>

                {/* Config 3: Free delivery price point */}
                <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[9px] font-mono tracking-widest uppercase">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-500">Free Delivery Threshold</span>
                    <strong className="text-black font-serif text-xs">Rp {loyaltyThreshold.toLocaleString('id-ID')}</strong>
                  </div>
                  <input
                    type="range"
                    min={200000}
                    max={1000000}
                    step={100000}
                    value={loyaltyThreshold}
                    onChange={(e) => {
                      setLoyaltyThreshold(Number(e.target.value));
                    }}
                    onMouseUp={() => {
                      onAddAuditLog('Promo Threshold Set', `Adjusted Free Shipping Minimum value threshold to Rp ${loyaltyThreshold.toLocaleString('id-ID')}`);
                    }}
                    className="w-full accent-[#000000] bg-stone-100 rounded-none h-1 cursor-pointer"
                  />
                  <p className="text-[8px] text-stone-400 normal-case leading-relaxed">Specify the minimum catalog threshold to grant global delivery waivers.</p>
                </div>

                {/* Config 4: VIP status modifiers */}
                <div className="pt-3 border-t border-stone-100 space-y-1.5 text-[9px] font-mono tracking-widest uppercase">
                  <label className="font-semibold text-stone-500 block">VIP Loyalty Point Multipliers</label>
                  <input
                    type="text"
                    value={loyaltyMultipliers}
                    onChange={(e) => setLoyaltyMultipliers(e.target.value)}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase text-black focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

              </div>
            </div>

            {/* Admin staff management column */}
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-[10px] font-mono font-bold tracking-widest text-[#000000] uppercase">2. ACCESS PROVISIONED OFFICERS ({adminUsers.length})</h3>
                
                <button
                  onClick={() => setIsAddStaffOpen(true)}
                  className="bg-black hover:bg-stone-900 border border-black text-white rounded-none p-1.5 text-xs font-bold font-mono uppercase tracking-widest cursor-pointer transition-colors"
                  title="Provision New Staff Account"
                  id="add-staff-trigger"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-none border border-stone-200 p-6 space-y-3.5">
                {adminUsers.map(st => (
                  <div 
                    key={st.id} 
                    className="flex justify-between items-center text-[10px] p-4 bg-stone-50 border border-stone-150 rounded-none font-mono uppercase tracking-wider"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-black text-white font-light flex items-center justify-center font-mono text-[10px]">
                        {st.avatar}
                      </div>

                      <div>
                        <strong className="text-black font-semibold tracking-wider block">{st.name}</strong>
                        <span className="text-[8px] text-stone-400 block lowercase normal-case">{st.role} • {st.email}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 font-mono text-[9px]">
                      <span className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none border ${st.status === 'active' ? 'bg-white border-black text-black' : 'bg-neutral-50 border-stone-300 text-stone-400'}`}>
                        {st.status.toUpperCase()}
                      </span>

                      <button
                        onClick={() => handleToggleState(st.id, st.name)}
                        className={`text-[8px] font-mono font-bold px-2.5 py-1.5 rounded-none uppercase transition-colors cursor-pointer border ${st.status === 'active' ? 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100' : 'bg-black border-black text-white hover:bg-[#111111]'}`}
                        id={`toggle-staff-${st.id}`}
                      >
                        {st.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audit log column */}
            <div className="space-y-6">
              <h3 className="text-[10px] font-mono font-bold tracking-widest text-[#000000] uppercase">3. LIVE AUDIT SECURITIES REGISTRY</h3>
              
              <div className="bg-white rounded-none border border-stone-200 p-6 max-h-[420px] overflow-y-auto font-mono text-[9px] uppercase tracking-wider space-y-3">
                
                {auditLogs.map((log, idx) => (
                  <div key={log.id || idx} className="p-4 bg-stone-50 rounded-none space-y-1.5 border border-stone-150">
                    <div className="flex justify-between text-[8px] text-black font-semibold border-b border-stone-200/50 pb-1 mr-1">
                      <span>{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed pt-1 select-all select-text font-sans font-light capitalize normal-case text-[10px]">
                      {log.details}
                    </p>
                    <span className="text-[8px] text-stone-400 block pt-0.5 font-semibold">EXECUTOR: {log.user.toUpperCase()}</span>
                  </div>
                ))}

              </div>
            </div>

          </div>

        </div>
      )}

      {/* POPUP STAFF REGISTER FORM TYPE */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200 animate-slide-up text-xs">
            <div className="p-5 border-b border-stone-150 bg-stone-50 flex justify-between items-center">
              <strong className="text-stone-900 font-serif text-sm">Provision New Staf Access Credentials</strong>
              <button onClick={() => setIsAddStaffOpen(false)} className="p-1 hover:bg-stone-200 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-5 space-y-4">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">Nama Lengkap Staf</label>
                <input 
                  type="text" 
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  placeholder="Contoh: Siti Rahma"
                  className="w-full bg-stone-50 border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Email Karyawan (@vera.com)</label>
                <input 
                  type="email" 
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="siti.rahma@vera.com"
                  className="w-full bg-stone-50 border p-2 rounded-lg"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">Hak Akses Sistem</label>
                <select 
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  className="w-full bg-stone-50 border p-2 rounded-lg font-semibold"
                >
                  <option value="admin">Admin Biasa (Operasional)</option>
                  <option value="super_admin">Super Admin (System Owner)</option>
                </select>
              </div>

              <div className="pt-3 border-t flex justify-end gap-2 font-semibold">
                <button type="button" onClick={() => setIsAddStaffOpen(false)} className="px-4 py-2 border rounded-xl">Batal</button>
                <button type="submit" className="px-4 py-2 bg-stone-900 text-gold-400 text-white rounded-xl hover:bg-stone-800" id="save-staff-btn">Provision Account</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Briefcase, TrendingUp, Layers, ShoppingCart, FileText, 
  Users, Plus, Edit, Trash2, Check, Inbox, DollarSign, 
  Send, ChevronDown, LogOut, X, UserPlus
} from 'lucide-react';
import { Product, Order, Article, AdminUser } from '../types';

interface AdminViewProps {
  products: Product[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: 'pending' | 'paid' | 'shipped' | 'delivered') => void;
  articles: Article[];
  onAddArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  isSuperAdmin?: boolean;
  currentStaffName: string;
  onLogout: () => void;
  
  // Props kelola pengguna admin
  adminUsers: AdminUser[];
  onAddAdminUser: (admin: AdminUser) => void;
  onToggleAdminStatus: (id: string) => void;
}

export default function AdminView({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  orders,
  onUpdateOrderStatus,
  articles,
  onAddArticle,
  onDeleteArticle,
  isSuperAdmin = false,
  currentStaffName,
  onLogout,
  adminUsers,
  onAddAdminUser,
  onToggleAdminStatus
}: AdminViewProps) {
  
  // Navigation State
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'catalog' | 'orders' | 'articles' | 'support' | 'staff'>('dashboard');
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Support simulator state
  const [supportTickets, setSupportTickets] = useState([
    { id: 't-1', name: 'Maya Anindita', email: 'maya.a@outlook.id', query: 'Halo Admin, apakah serum Rose Barrier-nya aman dipakai berbarengan dengan retinol 0.5% saya setiap malam?', status: 'pending', reply: '' },
    { id: 't-2', name: 'Dewi Lestari', email: 'dewi.lest@gmail.com', query: 'Saya memesan blazer ukuran M, tapi khawatir kekecilan di lingkar ketiak. Bisakah tolong dikirim ukuran L saja?', status: 'replied', reply: 'Sudah kami ubah ke ukuran L ya Kak Dewi! Paket sedang disiapkan oleh tim logistik.' }
  ]);
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Product Form states (Add & Edit)
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'skincare' as 'skincare' | 'cosmetics' | 'accessories' | 'apparel',
    price: 0,
    description: '',
    stock: 20,
    ingredients: '',
    sizes: '',
    colors: '',
  });

  // Article Form states
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [artData, setArtData] = useState({
    title: '',
    category: 'beauty' as 'beauty' | 'fashion' | 'lifestyle',
    excerpt: '',
    content: '',
    readTime: '5 min read',
    tags: 'Skincare, Barrier'
  });

  // New admin user input states (Khusus Super Admin)
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin');

  // Menghitung Analytics
  const totalRevenue = orders
    .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;

  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: 'replied', reply: replyText } : t));
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const formattedProduct: Product = {
      id: editingId || `prod-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      description: formData.description,
      rating: editingId ? (products.find(p => p.id === editingId)?.rating || 4.5) : 4.8,
      reviewCount: editingId ? (products.find(p => p.id === editingId)?.reviewCount || 10) : 1,
      image: 'generic_product',
      categoryColor: formData.category === 'skincare' ? 'from-blue-100 to-indigo-100 text-indigo-800' : 'from-pink-100 to-rose-200 text-rose-800',
      stock: Number(formData.stock),
      ingredients: formData.category === 'skincare' ? formData.ingredients : undefined,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : undefined,
      colors: formData.colors ? formData.colors.split(',').map(s => s.trim()) : undefined,
    };

    if (editingId) onUpdateProduct(formattedProduct);
    else onAddProduct(formattedProduct);

    setFormData({ name: '', category: 'skincare', price: 0, description: '', stock: 20, ingredients: '', sizes: '', colors: '' });
    setEditingId(null);
    setIsProductModalOpen(false);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name, category: product.category, price: product.price,
      description: product.description, stock: product.stock, ingredients: product.ingredients || '',
      sizes: product.sizes?.join(', ') || '', colors: product.colors?.join(', ') || '',
    });
    setIsProductModalOpen(true);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artData.title.trim()) return;

    onAddArticle({
      id: `art-${Date.now()}`, title: artData.title, category: artData.category,
      excerpt: artData.excerpt, content: artData.content, readTime: artData.readTime,
      author: currentStaffName, date: new Date().toISOString().split('T')[0],
      image: 'generic_blog', tags: artData.tags.split(',').map(t => t.trim())
    });
    setArtData({ title: '', category: 'beauty', excerpt: '', content: '', readTime: '5 min read', tags: 'Skincare, Barrier' });
    setIsArticleModalOpen(false);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;

    onAddAdminUser({
      id: `adm-${Math.floor(100 + Math.random() * 900)}`,
      name: newAdminName,
      email: newAdminEmail,
      role: newAdminRole,
      avatar: newAdminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      status: 'active'
    });

    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPass('');
    alert(`Staff account ${newAdminName.toUpperCase()} successfully deployed to infrastructure registry.`);
  };

  // Menyusun Menu Sidebar Secara Dinamis Sesuai Otoritas Role
  const sidebarMenu = [
    { id: 'dashboard', label: 'SUMMARY ANALYTICS', icon: TrendingUp },
    { id: 'catalog', label: 'PRODUCT CATALOGUE', icon: Layers },
    { id: 'orders', label: 'ORDERS REGISTRY', icon: ShoppingCart },
    { id: 'articles', label: 'EDITORS\' JOURNAL', icon: FileText },
    { id: 'support', label: 'CRM SYSTEM AUDIT', icon: Inbox },
  ];

  if (isSuperAdmin) {
    sidebarMenu.push({ id: 'staff', label: 'STAFF REGISTRY CONTROL', icon: Users });
  }

  return (
    <div className="bg-stone-50 text-black min-h-screen font-mono flex flex-col md:flex-row" id="admin-view-root">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-full md:w-64 bg-black text-stone-300 border-r border-stone-850 flex flex-col md:h-screen sticky top-0 shrink-0 z-40 rounded-none">
        <div className="px-6 py-5 border-b border-stone-850 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-serif font-light tracking-[0.2em] text-white uppercase">VERA</span>
            <span className="text-[8px] font-mono bg-stone-900 text-stone-300 border border-stone-800 px-2 py-0.5 tracking-wider font-semibold uppercase">
              {isSuperAdmin ? 'ROOT' : 'ADMIN'}
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1.5">
          {sidebarMenu.map(sb => {
            const IconComp = sb.icon;
            const isActive = activeSubTab === sb.id;
            return (
              <button
                key={sb.id}
                onClick={() => setActiveSubTab(sb.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-[10px] tracking-widest uppercase transition-all text-left cursor-pointer rounded-none border ${
                  isActive 
                    ? 'bg-white text-black border-white font-bold' 
                    : 'text-stone-400 border-transparent hover:text-white hover:bg-stone-900'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{sb.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      {/* RIGHT SIDE WORKSTATION */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 overflow-y-auto">
        
        {/* TOOLBAR HEADER */}
        <header className="bg-white border-b border-stone-250 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 relative">
          <div>
            <h1 className="text-xs font-serif font-bold text-black tracking-[0.2em] uppercase">
              WORKSPACE PANEL &raquo; {activeSubTab === 'staff' ? 'STAFF REGISTRY CONTROL' : activeSubTab}
            </h1>
            <p className="text-[9px] text-stone-500 font-mono uppercase tracking-wider mt-0.5">
              Access level: <strong className="text-black font-semibold">{isSuperAdmin ? 'SUPER SYSTEM ROOT' : 'COUTURE MANAGEMENT'}</strong> &bull; Total records: {products.length} catalog items.
            </p>
          </div>

          <div className="flex items-center gap-4 flex-wrap text-xs font-mono">
            <span className="hidden md:inline-block text-[8px] bg-white text-stone-700 border border-stone-200 px-3 py-1.5 rounded-none tracking-widest uppercase">
              INGRESS SECURE SSL ✔
            </span>

            {/* Profile Dropdown */}
            <div className="relative" id="admin-profile-dropdown-root">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-3 px-3 py-2 border transition-all rounded-none text-left cursor-pointer bg-white text-black ${
                  isProfileDropdownOpen ? 'border-black bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-bold text-[9px] rounded-none select-none">
                  {currentStaffName ? currentStaffName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "ST"}
                </div>
                <div className="hidden sm:block">
                  <p className="text-[9px] font-bold tracking-wider uppercase leading-none text-stone-900 truncate max-w-[120px]">
                    {currentStaffName}
                  </p>
                  <p className="text-[7px] text-stone-400 tracking-widest uppercase mt-1">
                    {isSuperAdmin ? "SYSTEM ROOT" : "OPERATIONS"}
                  </p>
                </div>
                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform ${isProfileDropdownOpen ? 'rotate-180 text-black' : ''}`} />
              </button>

              {isProfileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-stone-200 shadow-none rounded-none z-50 py-1">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-[9px] font-bold tracking-widest uppercase text-red-600 hover:bg-stone-950 hover:text-white transition-all rounded-none flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3 h-3 shrink-0" />
                      <span>DISCONNECT CONSOLE</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 p-6 md:p-8 space-y-6" id="admin-main-viewport">
          
          {/* TAB 1: SUMMARY ANALYTICS */}
          {activeSubTab === 'dashboard' && (() => {
            const soldOrders = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
            const soldOrdersCount = soldOrders.length;
            const totalItemsSold = soldOrders.reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);
            const inStockRatio = products.length > 0 ? Math.round((products.filter(p => p.stock > 0).length / products.length) * 100) : 100;

            const currentJuneRevenue = 6800000 + totalRevenue;
            const junCoordY = Math.max(20, Math.min(160, 160 - (currentJuneRevenue / 15000000) * 130));

            return (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white p-5 border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1"><span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">SALES VALUE COMPLETED</span><h3 className="text-lg font-serif font-light text-black">IDR {totalRevenue.toLocaleString('id-ID')}</h3></div>
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center"><DollarSign className="w-4 h-4" /></div>
                  </div>
                  <div className="bg-white p-5 border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1"><span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">SETTLED INVOICES</span><h3 className="text-lg font-serif font-light text-black">{soldOrdersCount} VERIFIED</h3></div>
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center"><Check className="w-4 h-4" /></div>
                  </div>
                  <div className="bg-white p-5 border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1"><span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">DISPATCH PIECES</span><h3 className="text-lg font-serif font-light text-black">{totalItemsSold} UNITS</h3></div>
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center"><Briefcase className="w-4 h-4" /></div>
                  </div>
                  <div className="bg-white p-5 border border-stone-200 flex items-center justify-between">
                    <div className="space-y-1"><span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">COMPOSITIONAL RATIO</span><h3 className="text-lg font-serif font-light text-black">{inStockRatio}% AVAILABLE</h3></div>
                    <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center"><Layers className="w-4 h-4" /></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white p-6 border border-stone-200 lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center mb-2 text-[9px] uppercase tracking-wider">
                      <span className="text-stone-600 font-semibold">Revenue Trend (S2 fiscal 2026)</span>
                    </div>
                    <svg className="w-full h-44 overflow-visible" viewBox="0 0 480 180" preserveAspectRatio="none">
                      <line x1="40" y1="160" x2="440" y2="160" stroke="#e7e5e4" strokeWidth="1" />
                      <path d={`M 40 135 L 120 115 L 200 95 L 280 70 L 360 50 L 440 ${junCoordY}`} fill="none" stroke="#000000" strokeWidth="1.5" />
                      <circle cx="440" cy={junCoordY} r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="bg-white p-5 border border-stone-200 space-y-4">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest">REVENUE STREAM</h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {soldOrders.map(order => (
                        <div key={order.id} className="p-3 bg-stone-50 border border-stone-200 uppercase text-[9px]">
                          <div className="flex justify-between font-bold"><span>{order.customerName}</span><span>IDR {order.total.toLocaleString('id-ID')}</span></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* TAB 2: PRODUCT CATALOGUE */}
          {activeSubTab === 'catalog' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center flex-wrap gap-4 font-mono">
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">PRODUCT INVENTORY ({products.length} ITEMS)</h3>
                <button onClick={() => { setEditingId(null); setIsProductModalOpen(true); }} className="bg-black hover:bg-stone-900 border border-black text-white px-5 py-3 text-[9px] uppercase font-semibold rounded-none cursor-pointer">
                  <Plus className="w-3.5 h-3.5 inline mr-1.5" /> REGISTER NEW ARTICLE
                </button>
              </div>

              <div className="bg-white border border-stone-200 rounded-none overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-stone-100 border-b border-stone-200 text-[8px] font-bold uppercase tracking-widest text-stone-600">
                    <tr><th className="p-4">ART_TYPE</th><th className="p-4">CLASSIFY</th><th className="p-4">PRICE</th><th className="p-4">ALLOCATED</th><th className="p-4 text-right">ACTIONS</th></tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-[10px]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/50">
                        <td className="p-4 font-bold uppercase text-stone-900">{p.name}</td>
                        <td className="p-4 uppercase text-stone-500">{p.category}</td>
                        <td className="p-4 font-semibold text-black">IDR {p.price.toLocaleString('id-ID')}</td>
                        <td className="p-4"><span className="border border-stone-800 bg-black text-white px-2 py-0.5 text-[8px] font-bold">{p.stock} UNITS</span></td>
                        <td className="p-4 text-right">
                          <button onClick={() => handleOpenEdit(p)} className="p-1 hover:text-black mr-2 cursor-pointer"><Edit className="w-3.5 h-3.5 inline" /></button>
                          <button onClick={() => onDeleteProduct(p.id)} className="p-1 text-red-600 hover:text-red-900 cursor-pointer"><Trash2 className="w-3.5 h-3.5 inline" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS REGISTRY */}
          {activeSubTab === 'orders' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">INCOMING ACQUISITIONS PORTFOLIO</h3>
              <div className="grid grid-cols-1 gap-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white border border-stone-200 p-5 uppercase text-[9px] space-y-3">
                    <div className="flex justify-between border-b pb-2">
                      <div><span className="text-stone-400">ORDER ID:</span> <strong className="text-black text-xs">{order.id}</strong></div>
                      <div><span className="text-stone-400">CLIENT:</span> <span className="font-semibold">{order.customerName}</span></div>
                      <div><span className="text-stone-400">TOTAL:</span> <span className="font-bold">IDR {order.total.toLocaleString('id-ID')}</span></div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="text-stone-500">ADDRESS: <strong className="text-black">{order.address}</strong></div>
                      <div className="flex gap-1 bg-white border border-stone-200">
                        {['paid', 'shipped', 'delivered'].map((st: any) => (
                          <button key={st} onClick={() => onUpdateOrderStatus(order.id, st)} className={`px-2 py-1 text-[8px] font-bold uppercase cursor-pointer ${order.status === st ? 'bg-black text-white' : 'text-stone-500 hover:bg-stone-50'}`}>{st}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: EDITORS' JOURNAL */}
          {activeSubTab === 'articles' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">EDITORIAL JOURNAL RELEASES</h3>
                <button onClick={() => setIsArticleModalOpen(true)} className="bg-black text-white px-5 py-3 text-[9px] font-bold tracking-widest uppercase rounded-none cursor-pointer">PUBLISH NEW EDIT</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {articles.map(art => (
                  <div key={art.id} className="bg-white border border-stone-200 p-5 space-y-2">
                    <div className="flex justify-between text-[8px]"><span className="bg-stone-100 px-2 py-0.5 font-bold uppercase">{art.category}</span><button onClick={() => onDeleteArticle(art.id)} className="text-stone-400 hover:text-red-600 cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button></div>
                    <h4 className="text-sm font-serif font-semibold text-stone-900 uppercase">{art.title}</h4>
                    <p className="text-xs text-stone-400 font-light">{art.excerpt}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CRM SYSTEM AUDIT */}
          {activeSubTab === 'support' && (
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">CLIENT SUPPORT LEDGER</h3>
              <div className="bg-white border border-stone-200 p-6 space-y-6">
                {supportTickets.map(ticket => (
                  <div key={ticket.id} className="p-4 bg-stone-50 border border-stone-200 uppercase text-[9px] space-y-2">
                    <div className="flex justify-between font-bold border-b pb-1"><span>{ticket.name} ({ticket.status})</span><span className="lowercase normal-case text-stone-400">{ticket.email}</span></div>
                    <p className="italic text-stone-700 font-serif normal-case text-xs">"{ticket.query}"</p>
                    {ticket.reply && <p className="bg-white p-2 border border-stone-200 text-stone-900 font-mono">RESPONSE: "{ticket.reply}"</p>}
                    {ticket.status === 'pending' && (
                      <div className="pt-2 text-right">
                        {activeReplyId === ticket.id ? (
                          <div className="space-y-2">
                            <textarea rows={2} value={replyText} onChange={e => setReplyText(e.target.value)} placeholder="Write formal response..." className="w-full bg-white border p-2 text-xs rounded-none focus:outline-none focus:border-black" />
                            <button onClick={() => handleSendReply(ticket.id)} className="bg-black text-white px-3 py-1.5 font-bold uppercase tracking-widest text-[8px] cursor-pointer"><Send className="w-3 h-3 inline mr-1" /> SUBMIT</button>
                          </div>
                        ) : (
                          <button onClick={() => setActiveReplyId(ticket.id)} className="bg-black text-white px-3 py-1.5 font-bold uppercase tracking-widest text-[8px] cursor-pointer">TRANSMIT RESPONSE</button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB SPECIAL 6: KELOLA PENGGUNA ADMIN (Hanya Tampil Jika isSuperAdmin === true) */}
          {activeSubTab === 'staff' && isSuperAdmin && (
            <div className="space-y-8 animate-fade-in" id="staff-registry-workspace">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                
                {/* Form Registrasi Akun Staff Baru */}
                <div className="bg-white border border-stone-200 p-6 rounded-none space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <UserPlus className="w-4 h-4 text-black" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-black">DEPLOY NEW STAFF ACCOUNT</h3>
                  </div>
                  <form onSubmit={handleCreateStaff} className="space-y-4 font-mono text-[11px]">
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1">Full Name</label>
                      <input type="text" required value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} placeholder="Alexander Light" className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-none focus:outline-none focus:border-black uppercase text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1">Corporate Email</label>
                      <input type="email" required value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} placeholder="username@vera.com" className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-none focus:outline-none focus:border-black text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1">Secure Passkey Code</label>
                      <input type="password" required value={newAdminPass} onChange={(e) => setNewAdminPass(e.target.value)} placeholder="••••••••" className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-none focus:outline-none focus:border-black text-xs"/>
                    </div>
                    <div>
                      <label className="block text-[8px] uppercase tracking-widest text-stone-500 font-bold mb-1">Privilege Level</label>
                      <select value={newAdminRole} onChange={(e) => setNewAdminRole(e.target.value as any)} className="w-full bg-stone-50 border border-stone-200 p-2.5 rounded-none focus:outline-none focus:border-black text-xs font-mono uppercase">
                        <option value="admin">Operations Admin Operator</option>
                        <option value="super_admin">Super System Admin Root</option>
                      </select>
                    </div>
                    <button type="submit" className="w-full bg-black text-white py-3 font-bold text-[9px] uppercase tracking-widest hover:bg-stone-900 border border-black transition-colors rounded-none cursor-pointer">INITIALIZE ACCOUNT</button>
                  </form>
                </div>

                {/* Tabel Daftar Database Admin Aktif */}
                <div className="bg-white border border-stone-200 p-6 rounded-none lg:col-span-2 space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <Users className="w-4 h-4 text-black" />
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-black">ACTIVE SYSTEM OPERATORS RECORD</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse font-mono text-[10px]">
                      <thead>
                        <tr className="border-b border-stone-200 bg-stone-50 text-stone-500 uppercase text-[8px] font-bold tracking-wider">
                          <th className="p-3">Staff Profile</th>
                          <th className="p-3">Designation Role</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Actions Panel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {adminUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-stone-50/50 transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 bg-stone-100 border border-stone-200 text-stone-800 font-bold flex items-center justify-center text-[9px] rounded-none">
                                  {user.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-bold text-stone-900 uppercase">{user.name}</p>
                                  <p className="text-stone-400 text-[8px] lowercase">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider border ${
                                user.role === 'super_admin' ? 'bg-stone-950 text-white border-black' : 'bg-white text-stone-700 border-stone-300'
                              }`}>{user.role === 'super_admin' ? 'ROOT_ROOT' : 'OPERATOR_OPS'}</span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5 font-bold">
                                <span className={`w-1.5 h-1.5 rounded-none ${user.status === 'active' ? 'bg-black animate-pulse' : 'bg-stone-300'}`} />
                                <span className={user.status === 'active' ? 'text-stone-900 uppercase' : 'text-stone-400 uppercase line-through'}>{user.status}</span>
                              </div>
                            </td>
                            <td className="p-3 text-right">
                              <button onClick={() => onToggleAdminStatus(user.id)} className={`px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-widest border transition-colors rounded-none cursor-pointer ${
                                user.status === 'active' ? 'bg-white text-red-600 border-stone-200 hover:border-red-600 hover:bg-red-50' : 'bg-black text-white border-black hover:bg-stone-900'
                              }`}>{user.status === 'active' ? 'SUSPEND SESSION' : 'REVIVE ACCOUNT'}</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* MODAL POPUPS FOR ADD/EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-xl w-full border border-stone-300 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest">{editingId ? 'EDIT ITEM' : 'ADD NEW PRODUCT'}</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleProductSubmit} className="space-y-3">
              <input type="text" placeholder="Product Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full border p-2 text-xs rounded-none" required/>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder="Price" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full border p-2 text-xs rounded-none" required/>
                <input type="number" placeholder="Stock" value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full border p-2 text-xs rounded-none" required/>
              </div>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as any})} className="w-full border p-2 text-xs rounded-none uppercase">
                <option value="skincare">Skincare</option>
                <option value="cosmetics">Cosmetics</option>
                <option value="accessories">Accessories</option>
                <option value="apparel">Apparel</option>
              </select>
              <button type="submit" className="w-full bg-black text-white py-3 text-[9px] tracking-widest font-bold uppercase rounded-none">COMMIT TO COUTURE</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL POPUPS FOR DRAFT ARTICLE */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-xl w-full border border-stone-300 p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest">PUBLISH JOURNAL ENTRY</h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleArticleSubmit} className="space-y-3">
              <input type="text" placeholder="Article Title" value={artData.title} onChange={e => setArtData({...artData, title: e.target.value})} className="w-full border p-2 text-xs rounded-none uppercase" required/>
              <textarea placeholder="Write full content here..." value={artData.content} onChange={e => setArtData({...artData, content: e.target.value})} rows={4} className="w-full border p-2 text-xs rounded-none font-serif resize-none" required />
              <button type="submit" className="w-full bg-black text-white py-3 text-[9px] tracking-widest font-bold uppercase rounded-none">BROADCAST EDITORIAL</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
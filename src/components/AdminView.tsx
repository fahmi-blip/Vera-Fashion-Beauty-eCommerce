import React, { useState } from 'react';
import { 
  Briefcase, 
  TrendingUp, 
  Layers, 
  ShoppingCart, 
  FileText, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  Truck, 
  Inbox, 
  Sparkles, 
  DollarSign, 
  AlertTriangle,
  Send,
  Eye,
  Settings,
  X,
  ChevronDown,
  LogOut,
  UserPlus
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
  currentStaffName?: string;
  onLogout: () => void;
  // Props untuk Super Admin - Staff Management
  adminUsers?: AdminUser[];
  onAddAdminUser?: (admin: AdminUser) => void;
  onToggleAdminStatus?: (id: string) => void;
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
  isSuperAdmin=false,
  currentStaffName,
  onLogout,
  adminUsers = [],
  onAddAdminUser,
  onToggleAdminStatus
}: AdminViewProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'catalog' | 'orders' | 'articles' | 'support' | 'staff'>('dashboard');
   console.log("IS SUPER ADMIN:", isSuperAdmin);
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
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

  // Staff Management states (Super Admin only)
  const [newAdminName, setNewAdminName] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPass, setNewAdminPass] = useState('');
  const [newAdminRole, setNewAdminRole] = useState<'admin' | 'super_admin'>('admin');

  // Calculate high quality analytics indicators
  const totalRevenue = orders
    .filter(o => ['paid', 'shipped', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(o => o.status === 'pending').length;
  const outOfStockProductsCount = products.filter(p => p.stock <= 0).length;

  // Support Tickets update handler
  const handleSendReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return { ...t, status: 'replied', reply: replyText };
      }
      return t;
    }));
    setReplyText('');
    setActiveReplyId(null);
  };

  // Product Submit (Create / Edit) helper
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
      categoryColor: formData.category === 'skincare' 
        ? 'from-blue-100 to-indigo-100 text-indigo-800' 
        : formData.category === 'cosmetics' 
        ? 'from-pink-100 to-rose-200 text-rose-800'
        : 'from-amber-100 to-amber-200 text-amber-800',
      stock: Number(formData.stock),
      ingredients: formData.category === 'skincare' ? formData.ingredients : undefined,
      sizes: formData.sizes ? formData.sizes.split(',').map(s => s.trim()) : undefined,
      colors: formData.colors ? formData.colors.split(',').map(s => s.trim()) : undefined,
    };

    if (editingId) {
      onUpdateProduct(formattedProduct);
    } else {
      onAddProduct(formattedProduct);
    }

    // Reset Form
    setFormData({
      name: '',
      category: 'skincare',
      price: 0,
      description: '',
      stock: 20,
      ingredients: '',
      sizes: '',
      colors: '',
    });
    setEditingId(null);
    setIsProductModalOpen(false);
  };

  // Populate form for editing
  const handleOpenEdit = (product: Product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      description: product.description,
      stock: product.stock,
      ingredients: product.ingredients || '',
      sizes: product.sizes?.join(', ') || '',
      colors: product.colors?.join(', ') || '',
    });
    setIsProductModalOpen(true);
  };

  // Article Submit helper
  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artData.title.trim()) return;

    const newArticle: Article = {
      id: `art-${Date.now()}`,
      title: artData.title,
      category: artData.category,
      excerpt: artData.excerpt,
      content: artData.content,
      readTime: artData.readTime,
      author: 'Budi Santoso (Operations Manager)',
      date: new Date().toISOString().split('T')[0],
      image: 'generic_blog',
      tags: artData.tags.split(',').map(t => t.trim())
    };

    onAddArticle(newArticle);
    setArtData({
      title: '',
      category: 'beauty',
      excerpt: '',
      content: '',
      readTime: '5 min read',
      tags: 'Skincare, Barrier'
    });
    setIsArticleModalOpen(false);
  };

  // Staff Management helper (Super Admin only)
  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminName.trim() || !newAdminEmail.trim()) return;

    if (onAddAdminUser) {
      onAddAdminUser({
        id: `adm-${Math.floor(100 + Math.random() * 900)}`,
        name: newAdminName,
        email: newAdminEmail,
        role: newAdminRole,
        avatar: newAdminName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
        status: 'active'
      });
    }

    setNewAdminName('');
    setNewAdminEmail('');
    setNewAdminPass('');
    alert(`Staff account ${newAdminName.toUpperCase()} successfully deployed to infrastructure registry.`);
  };

  // Dynamic sidebar menu based on role
  const sidebarMenu = [
    { id: 'dashboard', label: 'DASHBOARD', icon: TrendingUp },
    { id: 'catalog', label: 'PRODUCTS', icon: Layers },
    { id: 'orders', label: 'ORDERS', icon: ShoppingCart },
    { id: 'articles', label: 'ARTICLES', icon: FileText },
    { id: 'support', label: 'INBOX', icon: Inbox },
  ];

  if (isSuperAdmin) {
    sidebarMenu.push({ id: 'staff', label: 'STAFF REGISTRY CONTROL', icon: Users });
  }
  

  return (
    <div className="bg-stone-50 text-black min-h-screen font-mono flex flex-col md:flex-row" id="admin-view-root">
      
      {/* LEFT SIDEBAR (Classic Dashboard Sidebar) */}
      <aside className="w-64 bg-black border-r border-stone-800 flex flex-col shrink-0 min-h-screen">
        {/* Area Logo Premium (Hanya logo di bagian atas sidebar) */}
        <div className="p-6 border-b border-stone-900 flex items-center gap-2">
          <span className="text-lg font-serif font-black tracking-[0.3em] text-white">
            VERA
          </span>
          <span className="text-[7px] font-mono bg-stone-900 border border-stone-800 text-stone-400 px-1.5 py-0.5 tracking-widest font-bold">
            CORE
          </span>
        </div>

        {/* Menu Navigasi Utama */}
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

      {/* RIGHT SIDE PANEL WORKSTATION */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 overflow-y-auto">
        
        {/* Toolbar header */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0 relative">
          
          {/* Sisi Kiri: Informasi Judul & Akses Kontrol */}
          <div>
            <h1 className="text-xs font-serif font-bold text-black tracking-[0.2em] uppercase">
              {activeSubTab}
            </h1>
            <p className="text-[9px] text-stone-500 font-mono uppercase tracking-wider mt-0.5">
              Access level: <strong className="text-black font-semibold">{isSuperAdmin ? 'SUPER SYSTEM ROOT' : 'COUTURE MANAGEMENT'}</strong> &bull; Total records: {products.length} catalog items.
            </p>
          </div>

          {/* Sisi Kanan: Widget Utilitas SSL & Dropdown Profil Akun Staff */}
          <div className="flex items-center gap-4 flex-wrap text-xs font-mono">

            {/* Dropdown Menu Container */}
            <div className="relative" id="admin-profile-dropdown-root">
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className={`flex items-center gap-3 px-3 py-2 border transition-all rounded-none text-left cursor-pointer bg-white text-black ${
                  isProfileDropdownOpen ? 'border-black bg-stone-50' : 'border-stone-200 hover:border-stone-400'
                }`}
              >
                {/* Avatar Initial Kotak Monokrom */}
                <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-bold text-[9px] rounded-none select-none">
                  {currentStaffName ? currentStaffName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "ST"}
                </div>
                
                {/* Informasi Nama */}
                <div className="hidden sm:block">
                  <p className="text-[9px] font-bold tracking-wider uppercase leading-none text-stone-900">
                    {currentStaffName || "Active Operator"}
                  </p>
                  <p className="text-[7px] text-stone-400 tracking-widest uppercase mt-1">
                    {isSuperAdmin ? "SYSTEM ROOT" : "OPERATIONS"}
                  </p>
                </div>

                <ChevronDown className={`w-3 h-3 text-stone-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180 text-black' : ''}`} />
              </button>

              {/* Lapisan Dropdown Overlay Menu */}
              {isProfileDropdownOpen && (
                <>
                  {/* Backdrop transparan untuk menutup dropdown ketika klik di luar area */}
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsProfileDropdownOpen(false)} 
                  />
                  
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-stone-200 shadow-none rounded-none z-50 py-1 divide-y divide-stone-100 animate-fade-in animate-duration-150">
                    
                    {/* Ringkasan Akun Untuk Tampilan Mobile */}
                    <div className="px-3.5 py-2.5 sm:hidden bg-stone-50">
                      <p className="text-[9px] font-bold tracking-wider uppercase text-stone-900 truncate">{currentStaffName}</p>
                      <p className="text-[7px] text-stone-400 tracking-widest uppercase mt-0.5">{isSuperAdmin ? "SUPER ADMIN" : "STAFF ADMIN"}</p>
                    </div>

                    {/* Tombol Logout Utama Panel */}
                    <div className="py-0.5">
                      <button
                        onClick={() => {
                            setIsProfileDropdownOpen(false);
                            onLogout(); 
                          }}
                          className="w-full text-left px-3.5 py-2.5 text-[9px] font-bold tracking-widest uppercase text-red-600 hover:bg-stone-950 hover:text-white transition-all rounded-none font-mono cursor-pointer flex items-center gap-2"
                        >
                        <LogOut className="w-3 h-3 shrink-0" />
                        <span>LogOut</span>
                      </button>
                    </div>

                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Main Admin Workstation Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6" id="admin-main-viewport">
        
        {/* SUBTAB: ANALYTICS DASHBOARD */}
        {activeSubTab === 'dashboard' && (() => {
          // Calculate dynamic live workspace statistics 
          const soldOrders = orders.filter(o => ['paid', 'shipped', 'delivered'].includes(o.status));
          const soldOrdersCount = soldOrders.length;
          const totalItemsSold = soldOrders.reduce((sum, o) => sum + o.items.reduce((acc, item) => acc + item.quantity, 0), 0);
          const inStockCount = products.filter(p => p.stock > 0).length;
          const inStockRatio = products.length > 0 ? Math.round((inStockCount / products.length) * 100) : 100;

          // Compute dynamic coordinate for SVG June node based on revenue 
          const currentJuneRevenue = 6800000 + totalRevenue;
          const maxScale = 15000000;
          const junCoordY = Math.max(20, Math.min(160, 160 - (currentJuneRevenue / maxScale) * 130));
          const linePath = `M 40 135 L 120 115 L 200 95 L 280 70 L 360 50 L 440 ${junCoordY}`;
          const areaPath = `${linePath} L 440 160 L 40 160 Z`;

          return (
            <div className="space-y-8" id="subtab-dashboard">
              
              {/* Row: Main Metric Cards (Visual Summary) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metric 1: Total Sales Revenue */}
                <div className="bg-white rounded-none p-5 border border-stone-200 flex items-center justify-between hover:border-black transition-colors">
                  <div className="space-y-1 font-mono">
                    <span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">SALES VALUE COMPLETED</span>
                    <h3 className="text-lg font-serif font-light text-black">
                      IDR {totalRevenue.toLocaleString('id-ID')}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[8px] text-stone-600 font-semibold uppercase tracking-wider">
                      <span className="w-1.5 h-1.5 bg-black" />
                      <span>SSL AUDITED OK</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 rounded-none flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 2: Completed / Paid Orders */}
                <div className="bg-white rounded-none p-5 border border-stone-200 flex items-center justify-between hover:border-black transition-colors">
                  <div className="space-y-1 font-mono">
                    <span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">SETTLED INVOICES</span>
                    <h3 className="text-lg font-serif font-light text-black">
                      {soldOrdersCount} VERIFIED
                    </h3>
                    <div className="text-[9px] text-stone-500 uppercase tracking-widest">OF {orders.length} LOGGED ORDERS</div>
                  </div>
                  <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 rounded-none flex items-center justify-center">
                    <Check className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 3: Items volume sold */}
                <div className="bg-white rounded-none p-5 border border-stone-200 flex items-center justify-between hover:border-black transition-colors">
                  <div className="space-y-1 font-mono">
                    <span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">DISPATCH PIECES</span>
                    <h3 className="text-lg font-serif font-light text-black">
                      {totalItemsSold} SHIPPED UNITS
                    </h3>
                    <div className="text-[9px] text-stone-500 uppercase tracking-widest">DISPATCH TERMINAL READY</div>
                  </div>
                  <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 rounded-none flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                </div>

                {/* Metric 4: Inventory Health Rate */}
                <div className="bg-white rounded-none p-5 border border-stone-200 flex items-center justify-between hover:border-black transition-colors">
                  <div className="space-y-1 font-mono">
                    <span className="text-stone-400 text-[9px] tracking-widest block uppercase font-light">COMPOSITIONAL RATIO</span>
                    <h3 className="text-lg font-serif font-light text-black">
                      {inStockRatio}% AVAILABLE
                    </h3>
                    <div className="text-[9px] text-stone-500 uppercase tracking-widest">{inStockCount} OF {products.length} COMMITTED</div>
                  </div>
                  <div className="w-10 h-10 bg-stone-50 border border-stone-200 text-stone-700 rounded-none flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>

              </div>

              {/* Grid: Charts & Reports Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Chart Block 1 (Wide): Live Revenue and categories graph */}
                <div className="bg-white rounded-none p-6 border border-stone-200 shadow-none lg:col-span-2 space-y-6">
                  <div className="font-mono">
                    <h4 className="text-[10px] tracking-widest uppercase font-semibold text-stone-400">FINANCIAL VELOCITY & CATEGORY RATINGS</h4>
                    <p className="text-xs text-stone-500 mt-1 uppercase tracking-wider font-light">Active revenue velocity and product distribution statistics.</p>
                  </div>

                  {/* Horizontal Bar Chart showing Category Revenue Split */}
                  <div className="space-y-4 font-mono uppercase text-[10px] tracking-wider">
                    <span className="text-stone-500 font-semibold block">Distribution Analysis according to VERA segments</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { cat: 'Skincare Barrier', percentage: '45%', color: 'bg-stone-900', money: 'IDR 6.420.000', count: products.filter(p => p.category === 'skincare').length },
                        { cat: 'Cosmetics Glow', percentage: '20%', color: 'bg-stone-700', money: 'IDR 4.120.000', count: products.filter(p => p.category === 'cosmetics').length },
                        { cat: 'Premium Accessories', percentage: '25%', color: 'bg-stone-500', money: 'IDR 3.840.000', count: products.filter(p => p.category === 'accessories').length },
                        { cat: 'Fashion Apparel', percentage: '10%', color: 'bg-stone-300', money: 'IDR 2.100.000', count: products.filter(p => p.category === 'apparel').length },
                      ].map(stat => (
                        <div key={stat.cat} className="p-3 bg-stone-50 border border-stone-200 rounded-none space-y-1.5 font-mono">
                          <div className="flex justify-between text-xs font-semibold text-black uppercase">
                            <span>{stat.cat}</span>
                            <span className="font-mono text-black">{stat.percentage}</span>
                          </div>
                          <div className="w-full h-1 bg-stone-200 overflow-hidden rounded-none">
                            <div className={`h-full ${stat.color} rounded-none`} style={{ width: stat.percentage }} />
                          </div>
                          <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                            <span>{stat.count} ACTIVE VARIANTS</span>
                            <span>VALUATION: {stat.money}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Right Column: Sold Orders Feed and quick logs */}
                <div className="space-y-6">
                  
                  {/* Sold Orders list panel */}
                  <div className="bg-white rounded-none p-5 border border-stone-200 shadow-none space-y-4">
                    <div className="border-b border-stone-200 pb-2.5 flex items-center justify-between">
                      <div className="font-mono">
                        <span className="text-[10px] tracking-widest uppercase font-semibold text-black block">REVENUE STREAM</span>
                        <h4 className="text-[9px] text-stone-400 uppercase tracking-wider font-light">Recent historical ledger entries</h4>
                      </div>
                      <span className="text-[9px] bg-black text-white border border-black font-mono px-2 py-0.5 rounded-none font-semibold">
                        {soldOrders.length}
                      </span>
                    </div>

                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {soldOrders.length === 0 ? (
                        <div className="text-center py-12 font-mono">
                          <ShoppingCart className="w-6 h-6 text-stone-300 mx-auto mb-1.5" />
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-light">No invoice records logged</p>
                        </div>
                      ) : (
                        soldOrders.map((order) => (
                          <div key={order.id} className="p-3.5 bg-stone-50 border border-stone-200 rounded-none space-y-1.5 text-xs hover:border-black transition-colors font-mono uppercase text-[9px]">
                            <div className="flex justify-between font-bold text-black tracking-wide">
                              <span className="line-clamp-1">{order.customerName}</span>
                              <span className="text-black font-semibold text-right shrink-0">IDR {order.total.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-[9px] text-stone-400 font-mono">
                              <span>TRANS_ID: #{order.id.slice(-6)}</span>
                              <span className="bg-black text-white px-1.5 rounded-none font-semibold text-[8px]">
                                {order.status}
                              </span>
                            </div>
                            <div className="text-[9px] text-stone-500 font-light line-clamp-1 italic bg-white p-1.5 rounded-none border border-stone-200 leading-relaxed font-mono">
                              {order.items.map(it => `${it.product.name} (x${it.quantity})`).join(', ')}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* CRM Live Quick Activities status helper */}
                  <div className="bg-white rounded-none p-5 border border-stone-200 shadow-none space-y-4">
                    <div className="flex justify-between items-center border-b border-stone-200 pb-2.5 font-mono">
                      <h4 className="text-[10px] uppercase tracking-widest font-semibold text-black">LOGISTICS INTELLIGENCE</h4>
                      <span className="w-1.5 h-1.5 bg-black" title="Gateway Ready" />
                    </div>

                    <div className="space-y-3 font-mono text-[9px] uppercase tracking-wider text-stone-600">
                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-none flex gap-3">
                        <Inbox className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          CLIENT <strong>Maya Anindita</strong> registered a new invoice awaiting operational dispatch.
                        </p>
                      </div>

                      <div className="bg-stone-50 border border-stone-200 p-3 rounded-none flex gap-3">
                        <Check className="w-3.5 h-3.5 text-stone-850 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          VERAPAY secure channel operating sub-microsecond latency checks with zero friction.
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          );
        })()}

        {/* SUBTAB: CATALOG & INVENTORY MANAGEMENT */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-6 animate-fade-in" id="subtab-catalog">
            <div className="flex justify-between items-center flex-wrap gap-4 font-mono">
              <div>
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">PRODUCT INVENTORY DATABASE ({products.length} ITEMS)</h3>
                <p className="text-stone-500 text-[9px] uppercase font-light tracking-wider mt-1">Configure formulas, specify stock allocations, and direct catalogue additions.</p>
              </div>

              <button
                onClick={() => {
                  setEditingId(null);
                  setFormData({
                    name: '',
                    category: 'skincare',
                    price: 0,
                    description: '',
                    stock: 20,
                    ingredients: '',
                    sizes: '',
                    colors: '',
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-black hover:bg-stone-900 border border-black text-white px-5 py-3 tracking-widest text-[9px] uppercase font-semibold transition-colors cursor-pointer rounded-none"
                id="add-product-btn"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1.5" />
                <span>NEW PRODUCT</span>
              </button>
            </div>

            {/* Catalog list in high-end grid */}
            <div className="bg-white border border-stone-200 rounded-none shadow-none font-mono" id="catalog-table-container">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-100 border-b border-stone-200 uppercase tracking-widest font-semibold text-[8px] text-stone-600">
                    <tr>
                      <th className="p-4">PRODUCT</th>
                      <th className="p-4">CLASSIFY</th>
                      <th className="p-2">PRICE</th>
                      <th className="p-2 text-center">STOCK</th>
                      <th className="p-4">DESCRIPTION & INGREDIENTS</th>
                      <th className="p-4 text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800 text-[10px]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/50" id={`row-product-${p.id}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-none bg-stone-55 border border-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {p.image ? (
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-full h-full object-fill mix-blend-multiply" 
                      />
                    ) : (
                      <span className="text-[9px] text-center px-1 break-words">
                        {p.name}
                      </span>
                    )}
                            </div>
                            <div>
                              <strong className="text-black font-semibold uppercase">{p.name}</strong>
                              <span className="text-[9px] text-stone-400 block font-mono">CODE: {p.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="bg-stone-50 text-stone-800 text-[8px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-none border border-stone-200">
                            {p.category}
                          </span>
                        </td>

                        <td className="p-2 font-semibold text-black">
                          IDR {p.price.toLocaleString('id-ID')}
                        </td>

                        <td className="p-2 text-center">
                          <span className={`px-2 py-1 rounded-none text-[8px] font-semibold uppercase ${
                            p.stock <= 0 
                              ? 'border border-red-500 bg-white text-red-600 font-bold animate-pulse' 
                              : p.stock < 15 
                              ? 'border border-stone-400 bg-stone-50 text-stone-800' 
                              : 'border border-stone-800 bg-black text-white'
                          }`}>
                            {p.stock} UNITS
                          </span>
                        </td>

                        <td className="p-4 max-w-xs leading-normal">
                          <p className="line-clamp-2 text-stone-500 text-[10px] uppercase font-light leading-relaxed">{p.description}</p>
                          {p.ingredients && <span className="text-[8px] text-stone-400 uppercase tracking-widest mt-1 block">✔ Formula Active Matrix</span>}
                          {(p.sizes || p.colors) && <span className="text-[8px] text-stone-400 uppercase tracking-widest block">✔ Standardized Sizing Matrices</span>}
                        </td>

                        <td className="p-4">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(p)}
                              className="p-1.5 border border-transparent hover:border-stone-200 text-stone-450 hover:text-black hover:bg-stone-55 transition-colors rounded-none"
                              title="Ubah Produk"
                              id={`edit-btn-${p.id}`}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteProduct(p.id)}
                              className="p-1.5 border border-transparent hover:border-red-200 text-stone-450 hover:text-red-600 hover:bg-red-50/50 transition-colors rounded-none"
                              title="Hapus Produk"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB: INCOMING ORDERS TRACKING & STATE CHANGE */}
        {activeSubTab === 'orders' && (
          <div className="space-y-6 animate-fade-in" id="subtab-orders">
            <div className="font-mono">
              <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">INCOMING ACQUISITIONS PORTFOLIO ({orders.length} ACTIVE)</h3>
              <p className="text-stone-500 text-[9px] uppercase tracking-wider font-light mt-1">Audit customer proof of settlements, register shipping manifests, and manage delivery steps.</p>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-none border border-stone-200 p-12 text-center text-stone-500 space-y-2 font-mono">
                <ShoppingCart className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-[10px] uppercase tracking-widest">No customer orders logged at this time.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {orders.map(order => (
                  <div 
                    key={order.id}
                    className="bg-white border border-stone-200 rounded-none p-5 shadow-none space-y-4 font-mono uppercase text-[9px]"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[9px] border-b border-stone-200 pb-3">
                      <div>
                        <span className="text-stone-455 font-mono tracking-widest uppercase">ORDER ID</span>
                        <strong className="text-black font-semibold block text-xs">{order.id}</strong>
                      </div>
                      <div>
                        <span className="text-stone-455 font-mono tracking-widest uppercase">CLIENT NAME</span>
                        <span className="font-semibold text-stone-850 block">{order.customerName}</span>
                      </div>
                      <div>
                        <span className="text-stone-455 font-mono tracking-widest uppercase">SETTLEMENT METHOD</span>
                        <span className="text-stone-850 block font-semibold">{order.paymentMethod}</span>
                      </div>
                      <div>
                        <span className="text-stone-455 font-mono tracking-widest uppercase">TOTAL SUBVALUE</span>
                        <span className="text-black block font-semibold">IDR {order.total.toLocaleString('id-ID')}</span>
                      </div>
                      <div>
                        <span className="text-stone-455 font-mono tracking-widest uppercase">DISPATCH STATE</span>
                        <span className={`px-2.5 py-0.5 rounded-none font-semibold block text-center mt-0.5 text-[8px] ${
                          order.status === 'pending' 
                            ? 'border border-red-500 bg-white text-red-600 font-bold' 
                            : order.status === 'paid' 
                            ? 'border border-stone-800 bg-black text-white'
                            : order.status === 'shipped'
                            ? 'border border-stone-400 bg-stone-50 text-stone-800'
                            : 'border border-stone-800 bg-stone-50 text-black'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Products details inside order */}
                    <div className="text-[9px] space-y-1.5 max-w-md font-mono">
                      <span className="text-stone-400 uppercase tracking-widest">Selected articles:</span>
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between font-light uppercase tracking-wider text-stone-605">
                            <span>{item.product.name} (x{item.quantity})</span>
                            <span className="font-mono text-black">IDR {(item.product.price * item.quantity).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Interactive dispatch controls */}
                    <div className="pt-3 border-t border-stone-200 flex flex-wrap gap-2 items-center justify-between font-mono">
                      <div className="text-[9px] text-stone-500">
                        <span>DELIVERY ADDRESS: <strong className="text-black font-semibold">{order.address}</strong></span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[8px] text-stone-500 font-bold tracking-widest font-mono">CHANGE REGISTER STATUS:</span>
                        
                        {/* Status update quick buttons */}
                        <div className="flex rounded-none border border-stone-200 overflow-hidden bg-white font-mono text-[8px] uppercase tracking-wider">
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'paid')}
                            className={`px-3 py-2 border-r border-stone-200 font-bold cursor-pointer uppercase ${
                              order.status === 'paid' ? 'bg-black text-white' : 'hover:bg-stone-50 text-stone-600'
                            }`}
                            id={`status-paid-btn-${order.id}`}
                          >
                            Set Paid (Verify)
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'shipped')}
                            className={`px-3 py-2 border-r border-stone-200 font-bold cursor-pointer uppercase ${
                              order.status === 'shipped' ? 'bg-black text-white' : 'hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            Set Shipped
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateOrderStatus(order.id, 'delivered')}
                            className={`px-3 py-2 font-bold cursor-pointer uppercase ${
                              order.status === 'delivered' ? 'bg-black text-white' : 'hover:bg-stone-50 text-stone-600'
                            }`}
                          >
                            Set Delivered
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB: MAGAZINE ARTICLES */}
        {activeSubTab === 'articles' && (
          <div className="space-y-6" id="subtab-articles">
            <div className="flex justify-between items-center font-mono">
              <div>
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">EDITORIAL JOURNAL RELEASES ({articles.length} RELEASES)</h3>
                <p className="text-stone-500 text-[9px] uppercase font-light tracking-wider mt-1">Compose luxury beauty philosophies, modern streetwear guides, and curated journals.</p>
              </div>

              <button
                onClick={() => setIsArticleModalOpen(true)}
                className="bg-black hover:bg-stone-900 border border-black text-white px-5 py-3 tracking-widest text-[9px] uppercase font-semibold transition-colors cursor-pointer rounded-none"
                id="add-article-btn"
              >
                <Plus className="w-3.5 h-3.5 inline mr-1.5" />
                <span>PUBLISH NEW EDIT</span>
              </button>
            </div>

            {/* List articles available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(art => (
                <div key={art.id} className="bg-white rounded-none border border-stone-200 p-5 shadow-none space-y-3 font-mono">
                  <div className="flex justify-between items-center text-[8px] tracking-wider">
                    <span className="bg-stone-50 border border-stone-200 text-[8px] font-mono uppercase tracking-widest font-semibold px-2 py-0.5 rounded-none text-stone-700">
                      {art.category}
                    </span>
                    <button 
                      onClick={() => onDeleteArticle(art.id)}
                      className="text-stone-400 hover:text-red-500 transition-colors cursor-pointer"
                      title="Deport Article"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-serif font-semibold text-stone-900">{art.title}</h4>
                  <p className="text-xs text-stone-400 leading-relaxed font-light">{art.excerpt}</p>
                  
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-505 font-mono">
                    <span>By: {art.author}</span>
                    <span>{art.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: SUPPORT TICKETS WORKBENCH */}
        {activeSubTab === 'support' && (
          <div className="space-y-6" id="subtab-support">
            <div className="font-mono">
              <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest">CLIENT SUPPORT LEDGER</h3>
              <p className="text-stone-500 text-[9px] uppercase tracking-wider font-light mt-1">Intervene on customer inquiry tickets, log support updates, and sustain brand retention.</p>
            </div>

            <div className="bg-white border border-stone-200 rounded-none p-6 shadow-none space-y-6">
              {supportTickets.map(ticket => (
                <div 
                  key={ticket.id} 
                  className={`p-5 rounded-none border font-mono uppercase text-[9px] ${
                    ticket.status === 'pending' ? 'bg-stone-50 border-stone-300' : 'bg-white border-stone-150'
                  }`}
                  id={`ticket-card-${ticket.id}`}
                >
                  <div className="flex justify-between items-start flex-wrap gap-2 fb-1 border-b pb-2 border-stone-200">
                    <div>
                      <strong className="text-black text-[10px] block font-semibold">{ticket.name}</strong>
                      <span className="text-[8px] text-stone-400 font-mono block lowercase tracking-normal">{ticket.email}</span>
                    </div>

                    <span className={`text-[8px] font-semibold font-mono px-2 py-0.5 rounded-none uppercase ${
                      ticket.status === 'pending' ? 'border border-stone-850 text-stone-900 bg-white' : 'bg-stone-105 text-stone-500'
                    }`}>
                      {ticket.status === 'pending' ? 'Butuh Balasan' : 'Replied'}
                    </span>
                  </div>

                  <div className="mt-3.5 bg-stone-50 border border-stone-200 p-3.5 rounded-none text-[10px] text-stone-705 leading-relaxed italic">
                    "{ticket.query}"
                  </div>

                  {ticket.reply && (
                    <div className="mt-3 text-[10px] bg-stone-100 border border-stone-200 p-3.5 rounded-none text-stone-850 leading-relaxed font-mono">
                      <strong className="block text-black font-semibold text-[8px] tracking-widest uppercase mb-1">OFFICIAL EXCELLENCY RESPONSE:</strong>
                      "{ticket.reply}"
                    </div>
                  )}

                  {ticket.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-stone-200 text-right font-mono text-[9px]">
                      {activeReplyId === ticket.id ? (
                        <div className="space-y-3">
                          <textarea 
                            rows={3}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write formal brand dispatch response..."
                            className="w-full bg-white border border-stone-300 rounded-none p-3 text-[10px] uppercase tracking-wide focus:outline-none focus:ring-1 focus:ring-black"
                          />
                          <div className="flex justify-end gap-2 font-semibold">
                            <button 
                              onClick={() => { setActiveReplyId(null); setReplyText(''); }}
                              className="text-stone-500 hover:text-black uppercase px-4 py-2 text-[9px] tracking-wider"
                            >
                              CANCEL
                            </button>
                            <button 
                              onClick={() => handleSendReply(ticket.id)}
                              className="bg-black text-white hover:bg-stone-900 px-5 py-3 rounded-none text-[9px] tracking-wider uppercase flex items-center gap-1.5"
                              id={`send-reply-btn-${ticket.id}`}
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>SUBMIT DISPATCH</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setActiveReplyId(ticket.id); setReplyText(''); }}
                          className="bg-black hover:bg-stone-900 border border-black text-white text-[8px] font-bold tracking-widest uppercase px-5 py-3 rounded-none cursor-pointer"
                        >
                          TRANSMIT INTERVENTION RESPONSE
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB: STAFF MANAGEMENT (Super Admin Only) */}
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
                            <button onClick={() => onToggleAdminStatus && onToggleAdminStatus(user.id)} className={`px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-widest border transition-colors rounded-none cursor-pointer ${
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

      {/* POPUP MODAL: ADD PRODUCT FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-xl w-full overflow-hidden shadow-none border border-stone-300 animate-slide-up">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center font-mono">
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest">
                {editingId ? `RENEW ENTRY: ${editingId}` : 'REGISTER NEW PLATFORM ITEM'}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 hover:bg-stone-100 rounded-none cursor-pointer"
                id="close-product-editor"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">PROMINENT ITEM NAME</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Rosé Infused Hydro-Glow Serum"
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">CORE CATEGORY</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none"
                  >
                    <option value="skincare">Skincare</option>
                    <option value="cosmetics">Cosmetics</option>
                    <option value="accessories">Accessories</option>
                    <option value="apparel">Fashion Apparel</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">RETAIL VALUE (IDR)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">STOCK ALLOCATION</label>
                  <input 
                    type="number" 
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest">DESCRIPTION BRIEF</label>
                <textarea 
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Deskripsikan formula botanical ataupun ketahanan material premium anda..."
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {formData.category === 'skincare' && (
                <div>
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">INGREDIENTS LIST (DERMATOLOGY RELEVANT)</label>
                  <input 
                    type="text" 
                    value={formData.ingredients || ''}
                    onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                    placeholder="Rose extract, Glycerin, Water, ceramides..."
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              )}

              {['apparel', 'accessories'].includes(formData.category) && (
                <div>
                  <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">SIZE MATRIX ACCENTS</label>
                  <input 
                    type="text" 
                    value={formData.sizes || ''}
                    onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                    placeholder="S, M, L, XL"
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              )}

              <div>
                <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">COLOR INTENSITY VARIANTS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  value={formData.colors || ''}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                  placeholder="Oatmeal, Blush, Crimson, Clear"
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2 text-[9px] font-bold tracking-widest font-mono text-[#000000]">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer rounded-none uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-3 bg-black border border-black hover:bg-stone-900 text-white cursor-pointer rounded-none uppercase font-semibold transition-colors animate-fade-in"
                  id="save-product-editor"
                >
                  {editingId ? 'COMMIT RENEWAL' : 'PUBLISH TO COUTURE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: ADD ARTICLE FORM */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-lg w-full overflow-hidden shadow-none border border-stone-300 animate-slide-up">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center text-xs font-mono">
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest">PUBLISH NEW JOURNAL ARTICLE</h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="p-1 hover:bg-stone-100 rounded-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleArticleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest">JOURNAL ARTICLE TITLE</label>
                <input 
                  type="text" 
                  required
                  value={artData.title}
                  onChange={(e) => setArtData({ ...artData, title: e.target.value })}
                  placeholder="The Sustainable Wardrobe: 5 Capsule Essentials..."
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest">EDITORIAL TOPIC</label>
                  <select 
                    value={artData.category}
                    onChange={(e) => setArtData({ ...artData, category: e.target.value as any })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none"
                  >
                    <option value="beauty">Beauty & Cosmetics</option>
                    <option value="fashion font-medium">Fashion Design</option>
                    <option value="lifestyle">E-commerce Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest">ESTIMATED READ TIMES</label>
                  <input 
                    type="text" 
                    required
                    value={artData.readTime}
                    onChange={(e) => setArtData({ ...artData, readTime: e.target.value })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">EXCERPT SNIPPET</label>
                <input 
                  type="text" 
                  required
                  value={artData.excerpt}
                  onChange={(e) => setArtData({ ...artData, excerpt: e.target.value })}
                  placeholder="Kutipan ringkas yang tampil di daftar artikel rilis..."
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">EDITORIAL COMPOSITION (FULL TEXT)</label>
                <textarea 
                  rows={5}
                  required
                  value={artData.content}
                  onChange={(e) => setArtData({ ...artData, content: e.target.value })}
                  placeholder="Ketik konten rilis secara utuh..."
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-500 block mb-1 font-mono uppercase text-[9px] tracking-widest">SEARCH TAGS (COMMA SEPARATED)</label>
                <input 
                  type="text" 
                  value={artData.tags}
                  onChange={(e) => setArtData({ ...artData, tags: e.target.value })}
                  placeholder="Skincare, Glow, Workwear"
                  className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2 text-[9px] font-bold tracking-widest font-mono text-[#000000]">
                <button 
                  type="button" 
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-5 py-3 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 cursor-pointer rounded-none uppercase transition-colors"
                >
                  CANCEL
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-3 bg-black border border-black hover:bg-stone-900 text-white cursor-pointer rounded-none uppercase font-semibold transition-colors"
                >
                  TRANSMIT JOURNAL ARTICLE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
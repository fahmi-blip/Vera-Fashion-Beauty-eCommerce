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
  X
} from 'lucide-react';
import { Product, Order, Article } from '../types';

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
  isSuperAdmin?: boolean; // We re-use some of this in super admin view!
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
  isSuperAdmin = false
}: AdminViewProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'catalog' | 'orders' | 'articles' | 'support'>('dashboard');

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
    sizes: '', // comma separated string representation
    colors: '', // comma separated string representation
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

  return (
    <div className="bg-stone-50 text-black min-h-screen font-mono flex flex-col md:flex-row" id="admin-view-root">
      
      {/* LEFT SIDEBAR (Classic Dashboard Sidebar) */}
      <aside className="w-full md:w-64 bg-black text-stone-300 border-r border-stone-850 flex flex-col md:h-screen sticky top-0 shrink-0 z-40 shadow-none rounded-none">
        {/* Brand Banner */}
        <div className="px-6 py-5 border-b border-stone-850 flex items-center justify-between bg-black">
          <div className="flex items-center gap-2.5">
            <span className="text-lg font-serif font-light tracking-[0.2em] text-white uppercase">VERA</span>
            <span className="text-[8px] font-mono bg-stone-900 text-stone-300 border border-stone-800 px-2 py-0.5 tracking-wider font-semibold select-none">
              {isSuperAdmin ? 'SYSTEM' : 'ADMIN'}
            </span>
          </div>
        </div>

        {/* Profile Card Summary */}
        <div className="p-5 border-b border-stone-850 bg-stone-950/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-none bg-stone-800 text-white font-medium font-mono text-xs flex items-center justify-center border border-stone-700">
              {isSuperAdmin ? 'SYS' : 'OPS'}
            </div>
            <div>
              <h2 className="text-xs font-semibold tracking-wider text-white uppercase">
                {isSuperAdmin ? 'SUPER ADMIN PRIVILEGE' : 'Budi Santoso'}
              </h2>
              <p className="text-[9px] text-stone-500 font-mono mt-0.5 tracking-wider uppercase">
                {isSuperAdmin ? 'ROOT AUTHOR' : 'OPERATOR PRINCIPAL'}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className="w-1.5 h-1.5 bg-neutral-400 rounded-none" />
                <span className="text-[8px] text-stone-400 uppercase tracking-widest font-mono">Live Session Synced</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vertical Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5">
          {[
            { id: 'dashboard', label: 'SUMMARY ANALYTICS', icon: TrendingUp },
            { id: 'catalog', label: 'PRODUCT CATALOGUE', icon: Layers },
            { id: 'orders', label: 'ORDERS REGISTRY', icon: ShoppingCart },
            { id: 'articles', label: 'EDITORS\' JOURNAL', icon: FileText },
            { id: 'support', label: 'CRM SYSTEM AUDIT', icon: Inbox },
          ].map(sb => {
            const IconComp = sb.icon;
            const isActive = activeSubTab === sb.id;
            return (
              <button
                key={sb.id}
                onClick={() => setActiveSubTab(sb.id as any)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 text-[10px] tracking-widest uppercase transition-all text-left cursor-pointer rounded-none border ${
                  isActive 
                    ? 'bg-white text-black border-white' 
                    : 'text-stone-400 border-transparent hover:text-white hover:bg-stone-900'
                }`}
              >
                <IconComp className="w-3.5 h-3.5 shrink-0" />
                <span>{sb.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Info */}
        <div className="p-4 border-t border-stone-850 text-[9px] text-stone-550 font-mono space-y-1 bg-black">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wider">SECURE ROUTE:</span>
            <span className="text-white">PORT 3000</span>
          </div>
          <div className="text-[8px] font-light text-stone-600 tracking-wider">Built with Antigravity Build Studio</div>
        </div>
      </aside>

      {/* RIGHT SIDE PANEL WORKSTATION */}
      <div className="flex-1 flex flex-col min-w-0 bg-stone-50 overflow-y-auto">
        
        {/* Toolbar header */}
        <header className="bg-white border-b border-stone-250 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div>
            <h1 className="text-xs font-serif font-bold text-black tracking-[0.2em] uppercase">
              WORKSPACE PANEL &raquo; {activeSubTab}
            </h1>
            <p className="text-[9px] text-stone-500 font-mono uppercase tracking-wider mt-0.5">
              Access level: <strong className="text-black font-semibold">{isSuperAdmin ? 'SUPER SYSTEM ROOT' : 'COUTURE MANAGEMENT'}</strong> &bull; Total records: {products.length} catalog items.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap text-xs font-mono">
            <span className="text-[8px] bg-white text-stone-700 border border-stone-200 px-3 py-1.5 rounded-none tracking-widest uppercase">
              INGRESS SECURE SSL ✔
            </span>
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
          const maxScale = 15000000; // 15jt max range 
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

                  {/* Curved Area SVG Chart line */}
                  <div className="border border-stone-200 rounded-none p-4 bg-stone-50/40">
                    <div className="flex justify-between items-center mb-2 font-mono uppercase text-[9px] tracking-wider">
                      <span className="text-stone-600 font-semibold">Revenue Trend (S2 fiscal 2026)</span>
                      <span className="text-black font-semibold">Jun current: IDR {currentJuneRevenue.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="relative">
                      <svg className="w-full h-44 overflow-visible" viewBox="0 0 480 180" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#2e2e2e" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#2e2e2e" stopOpacity="0.00" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="40" y1="20" x2="440" y2="20" stroke="#f5f5f4" strokeWidth="1" />
                        <line x1="40" y1="57.5" x2="440" y2="57.5" stroke="#f5f5f4" strokeWidth="1" />
                        <line x1="40" y1="95" x2="440" y2="95" stroke="#f5f5f4" strokeWidth="1" />
                        <line x1="40" y1="132.5" x2="440" y2="132.5" stroke="#f5f5f4" strokeWidth="1" />
                        <line x1="40" y1="160" x2="440" y2="160" stroke="#e7e5e4" strokeWidth="1" />

                        {/* Chart Area Fill background */}
                        <path d={areaPath} fill="url(#chartGlow)" />

                        {/* Chart Line path */}
                        <path d={linePath} fill="none" stroke="#000000" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter" />

                        {/* Chart Circles (Interaction points) */}
                        <circle cx="40" cy="135" r="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <circle cx="120" cy="115" r="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <circle cx="200" cy="95" r="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <circle cx="280" cy="70" r="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <circle cx="360" cy="50" r="3" fill="#ffffff" stroke="#000000" strokeWidth="1.5" />
                        <circle cx="440" cy={junCoordY} r="4.5" fill="#000000" stroke="#ffffff" strokeWidth="2" />

                        {/* Chart Labels */}
                        <text x="40" y="174" fill="#a8a29e" fontSize="8" textAnchor="middle" fontFamily="monospace">JAN</text>
                        <text x="120" y="174" fill="#a8a29e" fontSize="8" textAnchor="middle" fontFamily="monospace">FEB</text>
                        <text x="200" y="174" fill="#a8a29e" fontSize="8" textAnchor="middle" fontFamily="monospace">MAR</text>
                        <text x="280" y="174" fill="#a8a29e" fontSize="8" textAnchor="middle" fontFamily="monospace">APR</text>
                        <text x="360" y="174" fill="#a8a29e" fontSize="8" textAnchor="middle" fontFamily="monospace">MAY</text>
                        <text x="440" y="174" fill="#000000" fontSize="8.5" fontWeight="bold" textAnchor="middle" fontFamily="monospace">JUN (LIVE)</text>
                      </svg>
                    </div>
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
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest text-[#000000]">PRODUCT INVENTORY DATABASE ({products.length} ITEMS)</h3>
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
                <span>REGISTER NEW ARTICLE</span>
              </button>
            </div>

            {/* Catalog list in high-end grid */}
            <div className="bg-white border border-stone-200 rounded-none shadow-none font-mono" id="catalog-table-container">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-stone-100 border-b border-stone-200 uppercase tracking-widest font-semibold text-[8px] text-stone-600">
                    <tr>
                      <th className="p-4">ART_TYPE</th>
                      <th className="p-4">CLASSIFY</th>
                      <th className="p-2">PRICE_VAL</th>
                      <th className="p-2 text-center">ALLOCATED</th>
                      <th className="p-4">DESCRIPTION & INGREDIENTS</th>
                      <th className="p-4 text-center">PORT ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 text-stone-800 text-[10px]">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-stone-50/50" id={`row-product-${p.id}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-none bg-stone-55 border border-stone-200 font-bold text-xs flex items-center justify-center shrink-0">
                              {p.id === 'prod-1' ? '🌹' : p.id === 'prod-2' ? '💄' : p.id === 'prod-3' ? '⚜️' : '👕'}
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
              <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest text-[#000000]">INCOMING ACQUISITIONS PORTFOLIO ({orders.length} ACTIVE)</h3>
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
                <h3 className="text-xs font-serif font-light text-black uppercase tracking-widest text-[#000000]">EDITORIAL JOURNAL RELEASES ({articles.length} RELEASES)</h3>
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

      </main>
      </div>

      {/* POPUP MODAL: ADD PRODUCT FORM */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#000000]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-none max-w-xl w-full overflow-hidden shadow-none border border-stone-300 animate-slide-up">
            <div className="p-6 border-b border-stone-200 bg-stone-50 flex justify-between items-center font-mono">
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest text-[#000000]">
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">PROMINENT ITEM NAME</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">CORE CATEGORY</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">RETAIL VALUE (IDR)</label>
                  <input 
                    type="number" 
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-200 p-2.5 rounded-none font-mono text-[10px] uppercase focus:outline-none focus:ring-1 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">STOCK ALLOCATION</label>
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
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-[#000000]">DESCRIPTION BRIEF</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500 font-mono">INGREDIENTS LIST (DERMATOLOGY RELEVANT)</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">SIZE MATRIX ACCENTS</label>
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
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">COLOR INTENSITY VARIANTS (COMMA SEPARATED)</label>
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
              <h3 className="font-serif font-light text-black text-xs uppercase tracking-widest text-[#000000]">PUBLISH NEW JOURNAL ARTICLE</h3>
              <button onClick={() => setIsArticleModalOpen(false)} className="p-1 hover:bg-stone-100 rounded-none cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleArticleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-[#000000]">JOURNAL ARTICLE TITLE</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-[#000000]">EDITORIAL TOPIC</label>
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
                  <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-[#000000]">ESTIMATED READ TIMES</label>
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
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">EXCERPT SNIPPET</label>
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
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">EDITORIAL COMPOSITION (FULL TEXT)</label>
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
                <label className="font-semibold text-stone-700 block mb-1 font-mono uppercase text-[9px] tracking-widest text-stone-500">SEARCH TAGS (COMMA SEPARATED)</label>
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

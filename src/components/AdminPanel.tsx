import React, { useState, useEffect } from "react";
import { 
  BarChart, Layers, Tag, BookOpen, Clock, Settings, Users, ArrowUpRight, 
  Trash2, Edit3, Plus, ShieldCheck, CheckCircle, AlertTriangle, X, RefreshCw 
} from "lucide-react";
import { Product, Article, Order, AuditLog, SystemConfig, User, CustomerSummary } from "../types";

interface AdminPanelProps {
  currentUser: User;
  onNavigate: (view: string) => void;
  products: Product[];
  articles: Article[];
  onRefreshProducts: () => void;
  onRefreshArticles: () => void;
}

export default function AdminPanel({
  currentUser,
  onNavigate,
  products,
  articles,
  onRefreshProducts,
  onRefreshArticles
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "articles" | "customers" | "admins" | "system" | "audit">("dashboard");

  // Admin lists data
  const [orders, setOrders] = useState<Order[]>([]);
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [systemConfig, setSystemConfig] = useState<SystemConfig | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  // Form states
  const [productForm, setProductForm] = useState<Partial<Product> | null>(null);
  const [articleForm, setArticleForm] = useState<Partial<Article> | null>(null);
  const [adminForm, setAdminForm] = useState({ email: "", name: "", password: "", targetRole: "admin" });
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderUpdateForm, setOrderUpdateForm] = useState({ paymentStatus: "", orderStatus: "", trackingNumber: "" });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Temporary additions to variant creation
  const [tempVariant, setTempVariant] = useState({ colorName: "", imageColorUrl: "", hex: "#141414" });

  useEffect(() => {
    fetchOrdersData();
    fetchCustomersData();
    if (currentUser.role === "superadmin") {
      fetchAdminsData();
      fetchAuditLogs();
      fetchSystemConfig();
      fetchAnalytics();
    }
  }, [activeTab, currentUser.id]);

  const showFeedback = (type: "success" | "error", message: string) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback(null), 4000);
  };

  const fetchOrdersData = async () => {
    try {
      const resp = await fetch(`/api/orders?email=${currentUser.email}&role=${currentUser.role}`);
      const data = await resp.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (e) {
      console.error("Failed fetching admin orders database", e);
    }
  };

  const fetchCustomersData = async () => {
    try {
      const resp = await fetch(`/api/customers?role=${currentUser.role}`);
      const data = await resp.json();
      if (data.success) {
        setCustomers(data.customers);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAdminsData = async () => {
    try {
      const resp = await fetch(`/api/admins?role=${currentUser.role}`);
      const data = await resp.json();
      if (data.success) {
        setAdmins(data.admins);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      const resp = await fetch(`/api/audit-logs?role=${currentUser.role}`);
      const data = await resp.json();
      if (data.success) {
        setAuditLogs(data.logs);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchSystemConfig = async () => {
    try {
      const resp = await fetch("/api/config");
      const data = await resp.json();
      if (data.success) {
        setSystemConfig(data.config);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const resp = await fetch(`/api/analytics?role=${currentUser.role}`);
      const data = await resp.json();
      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // --- CRUD ACTIONS FOR PRODUCTS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm) return;

    if (!productForm.name || !productForm.category || !productForm.price) {
      showFeedback("error", "Product name, category, and retail price are mandatory.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!productForm.id;
      const url = isEdit ? `/api/products/${productForm.id}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          role: currentUser.role,
          product: productForm
        })
      });

      const resData = await response.json();
      if (resData.success) {
        showFeedback("success", `Product successfully ${isEdit ? "updated" : "created"}.`);
        setProductForm(null);
        onRefreshProducts();
      } else {
        showFeedback("error", resData.message || "Failed saving product features.");
      }
    } catch (error) {
      showFeedback("error", "System configuration or network interrupt occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you confident you want to remove this product and its associated stock count?")) return;
    try {
      const resp = await fetch(`/api/products/${id}?email=${currentUser.email}&role=${currentUser.role}`, {
        method: "DELETE"
      });
      const data = await resp.json();
      if (data.success) {
        showFeedback("success", "Item removed successfully.");
        onRefreshProducts();
      } else {
        showFeedback("error", data.message);
      }
    } catch (e) {
      showFeedback("error", "Error connection during product clearance.");
    }
  };

  // --- CRUD ACTIONS FOR ARTICLES ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleForm) return;

    if (!articleForm.title || !articleForm.category || !articleForm.content) {
      showFeedback("error", "Article title, category, and markdown content are empty.");
      return;
    }

    try {
      setLoading(true);
      const isEdit = !!articleForm.id;
      const url = isEdit ? `/api/articles/${articleForm.id}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          role: currentUser.role,
          article: articleForm
        })
      });

      const resData = await response.json();
      if (resData.success) {
        showFeedback("success", `Article successfully ${isEdit ? "updated" : "created"}.`);
        setArticleForm(null);
        onRefreshArticles();
      } else {
        showFeedback("error", resData.message || "Failed saving article content.");
      }
    } catch (error) {
      showFeedback("error", "System error or connection interrupt occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Remove this editorial and hide it from the customer's feed?")) return;
    try {
      const resp = await fetch(`/api/articles/${id}?email=${currentUser.email}&role=${currentUser.role}`, {
        method: "DELETE"
      });
      const data = await resp.json();
      if (data.success) {
        showFeedback("success", "Editorial article removed completely.");
        onRefreshArticles();
      } else {
        showFeedback("error", data.message);
      }
    } catch (e) {
      showFeedback("error", "Network issue.");
    }
  };

  // --- ORDER MANAGEMENT ---
  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderUpdateForm({
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      trackingNumber: order.trackingNumber || ""
    });
  };

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setLoading(true);
      const resp = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          role: currentUser.role,
          paymentStatus: orderUpdateForm.paymentStatus,
          orderStatus: orderUpdateForm.orderStatus,
          trackingNumber: orderUpdateForm.trackingNumber
        })
      });

      const data = await resp.json();
      if (data.success) {
        showFeedback("success", `Order ${selectedOrder.id} status is updated.`);
        setSelectedOrder(null);
        fetchOrdersData();
        if (currentUser.role === "superadmin") {
          fetchAnalytics();
        }
      } else {
        showFeedback("error", data.message);
      }
    } catch {
      showFeedback("error", "Network error updating shipping.");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD / REMOVE STAFF ADMINS (Super Admin only) ---
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminForm.email || !adminForm.name || !adminForm.password) {
      showFeedback("error", "Email, Full Name and security password are required.");
      return;
    }

    try {
      setLoading(true);
      const resp = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          superEmail: currentUser.email,
          superRole: currentUser.role,
          email: adminForm.email,
          name: adminForm.name,
          password: adminForm.password,
          targetRole: adminForm.targetRole
        })
      });

      const data = await resp.json();
      if (data.success) {
        showFeedback("success", `Registered staff member "${adminForm.name}" successfully.`);
        setAdminForm({ email: "", name: "", password: "", targetRole: "admin" });
        fetchAdminsData();
      } else {
        showFeedback("error", data.message);
      }
    } catch {
      showFeedback("error", "Network connection issues.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (adminId: string) => {
    if (!confirm("Are you confident you want to remove this administrator's platform clearance?")) return;
    try {
      const resp = await fetch(`/api/admins/${adminId}?superEmail=${currentUser.email}&superRole=${currentUser.role}`, {
        method: "DELETE"
      });
      const data = await resp.json();
      if (data.success) {
        showFeedback("success", "Admin user clearance revoked.");
        fetchAdminsData();
      } else {
        showFeedback("error", data.message);
      }
    } catch {
      showFeedback("error", "Network issue removing account.");
    }
  };

  // --- CLOUD CONFIG SYSTEM LOGIC ---
  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!systemConfig) return;

    try {
      setLoading(true);
      const resp = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: currentUser.email,
          role: currentUser.role,
          config: systemConfig
        })
      });
      const data = await resp.json();
      if (data.success) {
        showFeedback("success", "System settings synced across servers.");
        fetchSystemConfig();
      } else {
        showFeedback("error", data.message);
      }
    } catch {
      showFeedback("error", "Error saving configurations.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = async () => {
    if (!confirm("Wipe the complete security audit tracking log?")) return;
    try {
      const resp = await fetch(`/api/audit-logs?email=${currentUser.email}&role=${currentUser.role}`, {
        method: "DELETE"
      });
      const data = await resp.json();
      if (data.success) {
        showFeedback("success", "Audit logs purged.");
        fetchAuditLogs();
      }
    } catch {
      showFeedback("error", "Network log delete failed.");
    }
  };

  return (
    <div className="flex-1 bg-[#F9F8F6] text-[#141414] font-sans flex flex-col md:flex-row min-h-[700px]">
      {/* Admin Panel Left Sidebar Rails */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-[#141414]/5 p-6 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="pb-4 border-b border-[#141414]/5">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40 font-semibold">Active Session</div>
            <h3 className="text-lg font-light tracking-tight mt-1">{currentUser.name}</h3>
            <span className="inline-block mt-1 text-[9px] uppercase tracking-widest px-2 py-0.5 bg-black text-white font-medium">
              {currentUser.role}
            </span>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                activeTab === "dashboard" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
              }`}
            >
              <BarChart className="w-4 h-4" />
              Overview Dashboard
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                activeTab === "products" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
              }`}
            >
              <Layers className="w-4 h-4" />
              Kelola Produk ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                activeTab === "orders" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
              }`}
            >
              <Tag className="w-4 h-4" />
              Kelola Transaksi ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("articles")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                activeTab === "articles" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Kelola Artikel ({articles.length})
            </button>

            <button
              onClick={() => setActiveTab("customers")}
              className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                activeTab === "customers" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
              }`}
            >
              <Clock className="w-4 h-4" />
              Kelola Pengguna ({customers.length})
            </button>

            {currentUser.role === "superadmin" && (
              <>
                <button
                  onClick={() => setActiveTab("admins")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                    activeTab === "admins" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  Staff Admins
                </button>

                <button
                  onClick={() => setActiveTab("system")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                    activeTab === "system" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  System Config
                </button>

                <button
                  onClick={() => setActiveTab("audit")}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-xs uppercase tracking-wider text-left transition-all ${
                    activeTab === "audit" ? "bg-[#141414] text-white" : "hover:bg-[#141414]/5 text-[#141414]"
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  Audit Logs
                </button>
              </>
            )}
          </nav>
        </div>

        <button
          onClick={() => onNavigate("landing")}
          className="mt-8 text-[10px] uppercase tracking-[0.2em] border border-black/20 p-2 text-center hover:bg-black hover:text-white transition-all cursor-pointer"
        >
          Return to Client App
        </button>
      </aside>

      {/* Admin Central Console Workspace */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        {feedback && (
          <div className={`p-4 mb-6 flex items-center justify-between text-xs tracking-wider uppercase ${
            feedback.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}>
            <span>{feedback.message}</span>
            <X className="w-4 h-4 cursor-pointer" onClick={() => setFeedback(null)} />
          </div>
        )}

        {/* --- DASHBOARD TAB VIEW --- */}
        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.4em] text-[#141414]/40">System Diagnostics</span>
                <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Operational Overview</h1>
              </div>
              
              {currentUser.role === "superadmin" && (
                <button 
                  onClick={() => { fetchAnalytics(); fetchOrdersData(); }}
                  className="p-2 border border-black/10 hover:bg-black/5 rounded-full transition-all"
                  title="Reload Live Analytics"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dashboard Visual Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border border-[#141414]/5">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Total Revenue Sales</div>
                <div className="text-2xl font-light tracking-tight mt-2 text-[#141414]">
                  {analytics ? analytics.totalSales.toLocaleString("id-ID") : "3.798.000"} <span className="text-xs">IDR</span>
                </div>
                <p className="text-[9px] text-emerald-600 uppercase tracking-wider mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> +14.5% versus April
                </p>
              </div>

              <div className="bg-white p-6 border border-[#141414]/5">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Transactions Count</div>
                <div className="text-2xl font-light tracking-tight mt-2 text-[#141414]">
                  {analytics ? analytics.totalOrdersCount : orders.length} Orders
                </div>
                <p className="text-[9px] text-slate-500 uppercase tracking-wider mt-1">
                  100% full-fill efficiency rate
                </p>
              </div>

              <div className="bg-white p-6 border border-[#141414]/5">
                <div className="text-[10px] uppercase tracking-widest text-slate-400">Total Customer Profiles</div>
                <div className="text-2xl font-light tracking-tight mt-2 text-[#141414]">
                  {analytics ? analytics.customerGrowthCount : customers.length} Profiles
                </div>
                <p className="text-[9px] text-emerald-600 uppercase tracking-wider mt-1 flex items-center gap-0.5">
                  <ArrowUpRight className="w-2.5 h-2.5" /> +8.3% compounding
                </p>
              </div>

              <div className="bg-white p-6 border border-[#141414]/5">
                <div className="text-[10px] uppercase tracking-widest text-[#141414]/40">Attention Required Orders</div>
                <div className="text-2xl font-light tracking-tight mt-2 text-amber-600">
                  {orders.filter(o => o.paymentStatus === "Pending Verification").length} Actionable
                </div>
                <p className="text-[9px] text-amber-600 uppercase tracking-widest mt-1">
                  Pending manual verification
                </p>
              </div>
            </div>

            {/* Simulated Live Analytics Line Chart via Pure beautiful visual SVGs */}
            <div className="bg-white p-6 border border-[#141414]/10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40 font-semibold mb-2 block">Revenue Momentum (Compounding 2026)</span>
              <div className="h-64 w-full flex flex-col justify-between pt-4">
                {/* SVG Graph */}
                <div className="relative flex-1 bg-[#F9F8F6] border border-black/5 rounded px-6 py-4 flex items-end">
                  <div className="absolute inset-0 flex flex-col justify-between py-2 text-[8px] uppercase tracking-[0.1em] text-slate-400 select-none">
                    <div className="border-b border-black/5 pr-4 text-right">30.000.000 IDR</div>
                    <div className="border-b border-black/5 pr-4 text-right">20.000.000 IDR</div>
                    <div className="border-b border-black/5 pr-4 text-right">10.000.000 IDR</div>
                    <div className="pr-4 text-right">0 IDR</div>
                  </div>

                  {/* SVG line overlay */}
                  <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 500 150" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#141414" stopOpacity="0.1" />
                        <stop offset="100%" stopColor="#141414" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 130 Q 120 110, 200 90 T 380 60 T 490 30"
                      fill="none"
                      stroke="#141414"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M 10 130 Q 120 110, 200 90 T 380 60 T 490 30 L 490 150 L 10 150 Z"
                      fill="url(#chartGrad)"
                    />
                    {/* Data dots */}
                    <circle cx="10" cy="130" r="4.5" fill="#141414" />
                    <circle cx="130" cy="110" r="4.5" fill="#141414" />
                    <circle cx="210" cy="90" r="4.5" fill="#141414" />
                    <circle cx="340" cy="65" r="4.5" fill="#141414" />
                    <circle cx="490" cy="30" r="4.5" fill="#141414" />
                  </svg>
                </div>

                {/* X labels */}
                <div className="flex justify-between items-center text-[9px] uppercase tracking-[0.2em] pt-3 text-slate-500 font-semibold px-2">
                  <span>Jan (14m)</span>
                  <span>Feb (19.5m)</span>
                  <span>Mar (26m)</span>
                  <span>Apr (22m)</span>
                  <span>May (Verified Today)</span>
                </div>
              </div>
            </div>

            {/* Low stock indicators lists */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 border border-[#141414]/5">
                <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-semibold text-rose-700 flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Stock Alerts / Out of Stock
                </h4>
                <div className="divide-y divide-[#141414]/5">
                  {products.filter(p => p.stock <= 5).map(prod => (
                    <div key={prod.id} className="py-2.5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-semibold">{prod.name}</div>
                        <span className="text-[9px] uppercase tracking-wide text-slate-400">{prod.category} &bull; {prod.subCategory}</span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${prod.stock === 0 ? "bg-red-50 text-red-700" : "bg-orange-50 text-orange-700"}`}>
                        {prod.stock === 0 ? "Out of Stock" : `${prod.stock} left`}
                      </span>
                    </div>
                  ))}
                  {products.filter(p => p.stock <= 5).length === 0 && (
                    <div className="py-4 text-xs text-center text-slate-400 p-4">All products fully stocked. Excellent operation!</div>
                  )}
                </div>
              </div>

              <div className="bg-white p-6 border border-[#141414]/5">
                <h4 className="text-xs uppercase tracking-[0.2em] mb-4 font-semibold text-slate-800">
                  Best Selling Products
                </h4>
                <div className="divide-y divide-[#141414]/5">
                  {analytics && analytics.bestSellers && analytics.bestSellers.length > 0 ? (
                    analytics.bestSellers.slice(0, 3).map((item: any, i: number) => (
                      <div key={i} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold">{item.name}</span>
                          <span className="block text-[10px] text-slate-400">{item.quantity} units successfully shipped</span>
                        </div>
                        <span className="font-medium text-[#141414]">{item.revenue.toLocaleString("id-ID")} IDR</span>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold">Classic Trench Dress</span>
                          <span className="block text-[10px] text-slate-400">1 unit shipped</span>
                        </div>
                        <span className="font-medium text-[#141414]">2.450.000 IDR</span>
                      </div>
                      <div className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold">Rosé Velvet Matte Lipstick</span>
                          <span className="block text-[10px] text-slate-400">2 units shipped</span>
                        </div>
                        <span className="font-medium text-[#141414]">1.298.000 IDR</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- PRODUCTS CRUDS TAB --- */}
        {activeTab === "products" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40">Katalog Produk Admin</span>
                <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Manage Store Inventory</h1>
              </div>

              {!productForm && (
                <button
                  onClick={() => setProductForm({
                    name: "",
                    category: "Fashion",
                    subCategory: "",
                    price: 0,
                    stock: 10,
                    description: "",
                    sizes: ["S", "M", "L"],
                    variants: []
                  })}
                  className="px-4 py-2 bg-[#141414] text-white hover:bg-[#141414]/95 transition-all flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              )}
            </div>

            {/* Dynamic Product Form */}
            {productForm && (
              <form onSubmit={handleSaveProduct} className="bg-white p-6 border border-black/10 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-3">
                  <h3 className="text-sm uppercase tracking-widest font-semibold">
                    {productForm.id ? `Edit product ${productForm.name}` : "Create New Product Catalog"}
                  </h3>
                  <button type="button" onClick={() => setProductForm(null)} className="text-slate-400 hover:text-black">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={productForm.name || ""}
                      onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs focus:ring-1 focus:ring-black outline-none"
                      placeholder="e.g. Mulberry Pleat Silk Dress"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold">Category *</label>
                      <select
                        value={productForm.category || "Fashion"}
                        onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                        className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                      >
                        <option value="Fashion">Fashion</option>
                        <option value="Beauty">Beauty</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] uppercase tracking-wider font-semibold">Sub Category</label>
                      <input
                        type="text"
                        value={productForm.subCategory || ""}
                        onChange={e => setProductForm({ ...productForm, subCategory: e.target.value })}
                        className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                        placeholder="e.g. Dresses, Outerwear, Lips"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold">Price (IDR) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price || ""}
                      onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                      placeholder="Retail price in Indonesian Rupiah"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold">Initial Stock *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stock !== undefined ? productForm.stock : 10}
                      onChange={e => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-semibold">Description *</label>
                    <textarea
                      rows={3}
                      value={productForm.description || ""}
                      onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                      placeholder="Product details, styling tips, ingredient and fabric metrics."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-semibold block">Available Sizes / Volumes (comma separated)</label>
                    <input
                      type="text"
                      value={productForm.sizes ? productForm.sizes.join(", ") : ""}
                      onChange={e => setProductForm({ ...productForm, sizes: e.target.value.split(",").map(s => s.trim()) })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs outline-none"
                      placeholder="S, M, L, XL or 50ml, 100ml"
                    />
                  </div>

                  {/* Curate Color Variants */}
                  <div className="bg-[#F9F8F6] p-4 border border-black/5 rounded space-y-4">
                    <span className="text-[10px] uppercase tracking-wider font-semibold block text-slate-500">Add Product Variants & Interactive Color Images</span>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Color Name (e.g. Noir)"
                        value={tempVariant.colorName}
                        onChange={e => setTempVariant({ ...tempVariant, colorName: e.target.value })}
                        className="border border-black/10 bg-white p-2 text-xs outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Image URL (Unsplash or similar)"
                        value={tempVariant.imageColorUrl}
                        onChange={e => setTempVariant({ ...tempVariant, imageColorUrl: e.target.value })}
                        className="border border-black/10 bg-white p-2 text-xs outline-none"
                      />
                      <div className="flex gap-2 items-center col-span-2">
                        <label className="text-[10px] text-slate-500">Pick Hex Code Indicator:</label>
                        <input
                          type="color"
                          value={tempVariant.hex}
                          onChange={e => setTempVariant({ ...tempVariant, hex: e.target.value })}
                          className="w-10 h-7 border p-0 cursor-pointer"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!tempVariant.colorName || !tempVariant.imageColorUrl) {
                              alert("Please specify color name and an image URL.");
                              return;
                            }
                            const arr = productForm.variants ? [...productForm.variants] : [];
                            arr.push({ ...tempVariant });
                            setProductForm({ ...productForm, variants: arr });
                            setTempVariant({ colorName: "", imageColorUrl: "", hex: "#141414" });
                          }}
                          className="ml-auto px-3 py-1 bg-[#141414] text-white text-[10px] uppercase tracking-wider hover:bg-black"
                        >
                          Append Color Variant
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {productForm.variants && productForm.variants.map((v, idx) => (
                        <div key={idx} className="flex items-center gap-1.5 px-2.5 py-1 bg-white border border-black/10 rounded-full text-[10px]">
                          <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: v.hex }}></span>
                          <span>{v.colorName}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const arr = [...(productForm.variants || [])];
                              arr.splice(idx, 1);
                              setProductForm({ ...productForm, variants: arr });
                            }}
                            className="text-red-600 font-bold hover:scale-125 ml-1"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-black/5">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-black text-white hover:bg-black/95 py-3 text-xs uppercase tracking-[0.2em] font-medium"
                  >
                    {loading ? "Saving Operations..." : "Commit Catalogue Updates"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductForm(null)}
                    className="px-6 py-3 border border-black/10 text-xs uppercase tracking-widest text-[#141414]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Product Table List */}
            <div className="overflow-x-auto bg-white border border-[#141414]/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-black/10 bg-[#FCD87] uppercase tracking-wider text-[10px] opacity-60">
                    <th className="p-4 font-semibold">Thumbnail</th>
                    <th className="p-4 font-semibold">Product Name</th>
                    <th className="p-4 font-semibold">Category</th>
                    <th className="p-4 font-semibold">Retail Price</th>
                    <th className="p-4 font-semibold">Stock Balance</th>
                    <th className="p-4 font-semibold">Color Variations</th>
                    <th className="p-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-sans">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <img
                          src={p.variants && p.variants.length > 0 ? p.variants[0].imageColorUrl : "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=200"}
                          alt={p.name}
                          className="w-10 h-12 object-cover"
                        />
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-sm">{p.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {p.id}</span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-medium">{p.category}</span>
                        <span className="text-slate-500 block text-[10px] mt-0.5">{p.subCategory}</span>
                      </td>
                      <td className="p-4 font-medium">{p.price.toLocaleString("id-ID")} IDR</td>
                      <td className="p-4">
                        <span className={`font-semibold ${p.stock <= 5 ? "text-amber-600 font-bold" : "text-[#141414]"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-1">
                          {p.variants && p.variants.map((v, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full inline-block border border-black/10"
                              style={{ backgroundColor: v.hex }}
                              title={v.colorName}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setProductForm({ ...p })}
                          className="p-1 px-2.5 border border-black/10 hover:bg-[#141414] hover:text-white rounded"
                          title="Modify details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 px-2.5 border border-red-200 text-red-600 hover:bg-red-500 hover:text-white rounded"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ORDERS TAB MANAGER VIEW --- */}
        {activeTab === "orders" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40">Logistics & Ledger Hub</span>
              <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Manage Customer Invoices</h1>
            </div>

            {/* Dynamic Status Update Form popup / window */}
            {selectedOrder && (
              <form onSubmit={handleUpdateOrder} className="bg-white p-6 border border-black/10 space-y-4">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <span className="text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                    Update Sesi Order {selectedOrder.id}
                  </span>
                  <button type="button" onClick={() => setSelectedOrder(null)} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Payment Authentication</label>
                    <select
                      value={orderUpdateForm.paymentStatus}
                      onChange={e => setOrderUpdateForm({ ...orderUpdateForm, paymentStatus: e.target.value })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    >
                      <option value="Pending Verification">Pending Verification</option>
                      <option value="Verified">Verified Paid</option>
                      <option value="Failed">Failed / Declined</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Logistics Status</label>
                    <select
                      value={orderUpdateForm.orderStatus}
                      onChange={e => setOrderUpdateForm({ ...orderUpdateForm, orderStatus: e.target.value as any })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Paid">Paid / Confirmed</option>
                      <option value="Shipped">Shipped / In Transit</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold font-mono">Carrier Tracking Number</label>
                    <input
                      type="text"
                      value={orderUpdateForm.trackingNumber}
                      onChange={e => setOrderUpdateForm({ ...orderUpdateForm, trackingNumber: e.target.value })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                      placeholder="e.g. VERA-JKT-100293"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-black text-white text-[10px] uppercase tracking-widest hover:bg-black/90 font-medium"
                  >
                    Commit Transition Updates
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto bg-white border border-[#141414]/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-black/10 bg-slate-50 uppercase tracking-wider text-[10px] opacity-60">
                    <th className="p-4 font-semibold">Invoice ID</th>
                    <th className="p-4 font-semibold">Client Target / Contact</th>
                    <th className="p-4 font-semibold">Items Count</th>
                    <th className="p-4 font-semibold">Total Invoice</th>
                    <th className="p-4 font-semibold">Payment status</th>
                    <th className="p-4 font-semibold">fulfillment flow</th>
                    <th className="p-4 font-semibold">Tracking Number</th>
                    <th className="p-4 font-semibold text-right">Verifikasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-sans">
                  {orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-semibold text-[#141414] font-mono">{o.id}</td>
                      <td className="p-4">
                        <div className="font-semibold text-sm">{o.customerName}</div>
                        <span className="text-[10px] text-slate-400 block lowercase">{o.customerEmail}</span>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          {o.items.map((item, idx) => (
                            <div key={idx} className="text-[10px] text-slate-600">
                              &bull; {item.productName} ({item.selectedColor}, {item.selectedSize}) x{item.quantity}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{o.total.toLocaleString("id-ID")} IDR</td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wide font-medium rounded-full ${
                          o.paymentStatus === "Verified" ? "bg-emerald-50 text-emerald-800" :
                          o.paymentStatus === "Failed" ? "bg-rose-50 text-rose-800" :
                          "bg-amber-50 text-amber-800 animate-pulse"
                        }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-1 text-[10px] uppercase tracking-wide font-medium rounded-full ${
                          o.orderStatus === "Delivered" ? "bg-slate-200 text-slate-800" :
                          o.orderStatus === "Shipped" ? "bg-sky-50 text-sky-800 border border-sky-200" :
                          o.orderStatus === "Cancelled" ? "bg-red-50 text-red-600" :
                          "bg-[#141414] text-white"
                        }`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-slate-500">{o.trackingNumber || "No tracking yet"}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleEditOrder(o)}
                          className="px-3 py-1 text-[10px] uppercase tracking-widest border border-black/10 hover:bg-black hover:text-white transition-all rounded cursor-pointer"
                        >
                          Modify
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">No client orders placed or managed so far.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- ARTICLES TAB (EDITORIALS CRUDS) --- */}
        {activeTab === "articles" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40 font-semibold">Arsip Artikel Admin</span>
                <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Manage Educational Features</h1>
              </div>

              {!articleForm && (
                <button
                  onClick={() => setArticleForm({
                    title: "",
                    category: "Fashion & Style",
                    excerpt: "",
                    content: "",
                    author: currentUser.name,
                    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
                    readTime: "5 min read"
                  })}
                  className="px-4 py-2 bg-[#141414] text-white hover:bg-black transition-all flex items-center gap-2 text-xs uppercase tracking-widest cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Form Article
                </button>
              )}
            </div>

            {articleForm && (
              <form onSubmit={handleSaveArticle} className="bg-white p-6 border border-black/10 space-y-6">
                <div className="flex items-center justify-between border-b border-black/5 pb-2">
                  <h3 className="text-xs uppercase tracking-widest font-semibold font-serif">
                    {articleForm.id ? `Edit Editorial: "${articleForm.title}"` : "Draft New Luxury Editorial"}
                  </h3>
                  <button type="button" onClick={() => setArticleForm(null)} className="text-slate-400">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Editorial Title *</label>
                    <input
                      type="text"
                      required
                      value={articleForm.title || ""}
                      onChange={e => setArticleForm({ ...articleForm, title: e.target.value })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                      placeholder="e.g. Squalane Lipid Protective Routines"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-semibold font-serif animate-pulse">Category</label>
                      <select
                        value={articleForm.category || "Fashion & Style"}
                        onChange={e => setArticleForm({ ...articleForm, category: e.target.value as any })}
                        className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                      >
                        <option value="Fashion & Style">Fashion & Style</option>
                        <option value="Skincare & Beauty">Skincare & Beauty</option>
                        <option value="Lifestyle">Lifestyle</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] uppercase tracking-wider font-semibold">Estimated Read Time</label>
                      <input
                        type="text"
                        value={articleForm.readTime || "4 min read"}
                        onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })}
                        className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Article Image Thumbnail URL</label>
                    <input
                      type="text"
                      value={articleForm.thumbnail || ""}
                      onChange={e => setArticleForm({ ...articleForm, thumbnail: e.target.value })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Brief Summary Excerpt *</label>
                    <input
                      type="text"
                      required
                      value={articleForm.excerpt || ""}
                      onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}
                      className="w-full border border-black/10 p-2 text-xs bg-slate-50"
                      placeholder="Introductory sentence readable on blogs catalog view."
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-1">
                    <label className="text-[9px] uppercase tracking-wider font-semibold">Main Content (Markdown Body) *</label>
                    <textarea
                      rows={6}
                      required
                      value={articleForm.content || ""}
                      onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}
                      className="w-full border border-black/10 p-2.5 bg-slate-50 text-xs font-serif"
                      placeholder="Begin formatting your paragraphs beautifully..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 border-t border-black/5 pt-4 font-mono">
                  <button type="submit" disabled={loading} className="flex-1 bg-black text-white text-xs uppercase tracking-widest py-3">
                    {loading ? "Saving draft..." : "Publish Article to Editorial Feed"}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map(art => (
                <div key={art.id} className="bg-white p-5 border border-black/5 flex flex-col justify-between">
                  <div className="flex gap-4">
                    <img src={art.thumbnail} className="w-16 h-16 object-cover border" alt="" />
                    <div className="flex-1">
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-medium">{art.category}</span>
                      <h4 className="font-light text-base text-[#141414] leading-snug tracking-tight mt-1">{art.title}</h4>
                      <p className="text-xs text-slate-400 mt-1">{art.readTime} &bull; by {art.author}</p>
                    </div>
                  </div>
                  <div className="flex justify-end gap-3 mt-4 border-t pt-3 border-black/5">
                    <button
                      onClick={() => setArticleForm({ ...art })}
                      className="text-xs text-[#141414] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(art.id)}
                      className="text-xs text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- CUSTOMERS TAB --- */}
        {activeTab === "customers" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40">Active Customer Base</span>
              <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Manage Users & Complaints</h1>
            </div>

            <div className="overflow-x-auto bg-white border border-[#141414]/10">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-black/10 bg-slate-50 uppercase tracking-wider text-[10px] opacity-60">
                    <th className="p-4 font-semibold">User Reference</th>
                    <th className="p-4 font-semibold">Mail Access</th>
                    <th className="p-4 font-semibold">Successful Orders</th>
                    <th className="p-4 font-semibold">Total Customer Value</th>
                    <th className="p-4 font-semibold text-right">Support Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 font-sans">
                  {customers.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 py-3">
                        <div className="font-semibold text-sm">{c.name}</div>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {c.id}</span>
                      </td>
                      <td className="p-4 block lowercase text-slate-600 pt-5">{c.email}</td>
                      <td className="p-4 font-semibold text-indigo-700">{c.totalOrders} Checkout flows</td>
                      <td className="p-4 font-semibold text-[#141414]">{c.totalSpent.toLocaleString("id-ID")} IDR</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => alert(`Initiating direct customer support for client: ${c.email}. Registered in temporary VERA-CRM systems.`)}
                          className="px-2.5 py-1 text-[10px] uppercase tracking-wider border border-black/10 text-slate-600 hover:bg-[#141414] hover:text-white transition-all rounded cursor-pointer"
                        >
                          Resolve Complaint
                        </button>
                      </td>
                    </tr>
                  ))}
                  {customers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">Loading user metadata logs...</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- STAFF ADMINS TAB --- */}
        {activeTab === "admins" && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40">System Security Clearing</span>
              <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Super Admin Role Operations</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <form onSubmit={handleAddAdmin} className="bg-white p-6 border border-black/10 space-y-4">
                <span className="text-xs uppercase tracking-widest font-semibold block border-b pb-2">Assign New Administrator</span>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold">Admin Full Name</label>
                  <input
                    type="text"
                    required
                    value={adminForm.name}
                    onChange={e => setAdminForm({ ...adminForm, name: e.target.value })}
                    className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    placeholder="e.g. Juliet Starling"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold font-mono">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminForm.email}
                    onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                    className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    placeholder="e.g. staff@vera.com"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold">Security Password</label>
                  <input
                    type="password"
                    required
                    value={adminForm.password}
                    onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                    className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                    placeholder="password"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] uppercase tracking-wider font-semibold">Role Level</label>
                  <select
                    value={adminForm.targetRole}
                    onChange={e => setAdminForm({ ...adminForm, targetRole: e.target.value })}
                    className="w-full border border-black/10 p-2 text-xs bg-slate-50 outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-[#141414] text-white hover:bg-black font-semibold uppercase tracking-widest text-[10px] pt-3 pb-3"
                >
                  Confirm Assignment
                </button>
              </form>

              <div className="lg:col-span-2 space-y-4">
                <span className="text-xs uppercase tracking-widest font-semibold block text-slate-500">Active Authorized Accounts</span>
                <div className="divide-y divide-black/5 bg-white border border-[#141414]/10 rounded">
                  {admins.map(adm => (
                    <div key={adm.id} className="p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-sm flex items-center gap-1.5">
                          {adm.name}
                          <span className={`text-[9px] tracking-wide uppercase px-1.5 py-0.5 rounded font-mono ${adm.role === 'superadmin' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-700'}`}>
                            {adm.role}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">{adm.email}</span>
                      </div>

                      {adm.email !== "super@vera.com" ? (
                        <button
                          onClick={() => handleRemoveAdmin(adm.id)}
                          className="hover:text-rose-600 text-[10px] uppercase font-bold text-slate-500 hover:underline border border-black/5 bg-slate-50 hover:bg-rose-50 px-2 py-1 rounded"
                        >
                          Revoke Access
                        </button>
                      ) : (
                        <span className="text-[10px] italic text-[#141414]/30 font-serif">Original System Architect</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- SYSTEM CONFIG TAB --- */}
        {activeTab === "system" && systemConfig && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40">Cloud Control Pane</span>
              <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Platform System Configuration</h1>
            </div>

            <form onSubmit={handleSaveSystemConfig} className="bg-white p-6 border border-black/10 max-w-xl space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold block border-b pb-2">Main Settings Control</span>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs uppercase tracking-wider font-semibold block">Enable Integrated Online Payments</label>
                  <span className="text-[10px] text-slate-400 block max-w-sm">When enabled, checkouts initiate a Simulated digital payment verification routine.</span>
                </div>
                <input
                  type="checkbox"
                  checked={systemConfig.paymentGatewayActive}
                  onChange={e => setSystemConfig({ ...systemConfig, paymentGatewayActive: e.target.checked })}
                  className="w-5 h-5 accent-black cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold block">Primary Payment Gateway System</label>
                <select
                  value={systemConfig.selectedGateway}
                  onChange={e => setSystemConfig({ ...systemConfig, selectedGateway: e.target.value as any })}
                  className="w-full border border-black/10 p-2 bg-slate-50 text-xs outline-none"
                >
                  <option value="Manual Transfer">Manual Transfer (VA / Manual Verification)</option>
                  <option value="Midtrans">Midtrans Integrated API Gateway</option>
                  <option value="Stripe">Stripe API Platform</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-wider font-semibold block">Security Defense Clearance</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      checked={systemConfig.securityLevel === "Standard"}
                      onChange={() => setSystemConfig({ ...systemConfig, securityLevel: "Standard" })}
                      className="accent-black"
                    />
                    Standard Role Level
                  </label>
                  <label className="flex items-center gap-1.5 text-xs">
                    <input
                      type="radio"
                      checked={systemConfig.securityLevel === "High"}
                      onChange={() => setSystemConfig({ ...systemConfig, securityLevel: "High" })}
                      className="accent-black"
                    />
                    High Security (Active Logging & Force SSL hashes)
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-black/5 pt-4">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold block text-amber-700 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" /> Platform Maintenance Offline Mode
                  </span>
                  <span className="text-[10px] text-amber-600 block max-w-xs">Instantly displays a lock screen to active customers in real time.</span>
                </div>
                <input
                  type="checkbox"
                  checked={systemConfig.maintenanceMode}
                  onChange={e => setSystemConfig({ ...systemConfig, maintenanceMode: e.target.checked })}
                  className="w-5 h-5 accent-amber-600 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-[#141414] text-white hover:bg-black font-semibold uppercase tracking-widest text-[10px] pt-3 pb-3"
              >
                Sync Configuration Parameters
              </button>
            </form>
          </div>
        )}

        {/* --- AUDIT LOGS TAB --- */}
        {activeTab === "audit" && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#141414]/40 font-semibold font-mono">Platform Audit Trails</span>
                <h1 className="text-3xl font-light tracking-tight font-serif mt-1">Audit Log Security Stream</h1>
              </div>

              <button
                onClick={handleClearLogs}
                className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-mono rounded inline-flex items-center gap-1.5 cursor-pointer"
              >
                Clear Security Trails
              </button>
            </div>

            <div className="bg-stone-900 text-stone-200 p-4 rounded-md font-mono text-[11px] leading-relaxed max-h-[450px] overflow-y-auto border border-black space-y-2">
              <div className="text-slate-400 border-b border-white/5 pb-2 text-[10px] tracking-wider uppercase">Active Security System Logs System</div>
              {auditLogs.map((log) => (
                <div key={log.id} className="hover:bg-white/5 p-1 flex flex-col sm:flex-row justify-between rounded">
                  <span className="text-lime-500 font-semibold">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
                  <span className="text-sky-400 mx-2">{log.userEmail} ({log.role})</span>
                  <span className="text-stone-300 flex-1">&raquo;&nbsp;{log.action}</span>
                  <span className="text-slate-500 text-[9px] block sm:inline">id: {log.id}</span>
                </div>
              ))}
              {auditLogs.length === 0 && (
                <div className="text-slate-500 p-4 text-center">Diagnostics trace line is clean. Logs emptied.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

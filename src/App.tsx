import { useState } from 'react';
import { 
  initialProducts, 
  initialArticles, 
  initialAdmins, 
  initialLogs 
} from './data';
import { Product, CartItem, Order, Article, AdminUser, AuditLog, ActiveRole } from './types';
import CustomerView from './components/CustomerView';
import AdminView from './components/AdminView';
import SuperAdminView from './components/SuperAdminView';

export default function App() {
  // Active Role Engine state
  const [activeRole, setActiveRole] = useState<ActiveRole>('customer');
  const [currentStaffName, setCurrentStaffName] = useState<string>('');

  // Core App States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']); 
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdmins);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs);

  // Helper Logging System
  const handleAddAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: currentStaffName || 'Customer Portal Session',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Trigerred saat form login profile mendeteksi akun bertipe Admin / Super Admin
  const handleStaffRedirect = (role: ActiveRole, staffName: string) => {
    setCurrentStaffName(staffName);
    setActiveRole(role); // Mengubah status role global untuk merender workspace baru
    
    const workspaceLabel = role === 'admin' ? 'Operations Admin Console' : 'Root Security Dashboard';
    handleAddAuditLog('Staff Intercept Login', `Staff ${staffName} successfully routed via Single Door Auth into ${workspaceLabel}.`);
  };

  // Keluar dari Dashboard Admin kembali ke mode Customer Shop biasa
  const handleAdminLogout = () => {
    handleAddAuditLog('Staff Terminated Session', `Staff ${currentStaffName} closed active administration console layout.`);
    setActiveRole('customer');
    setCurrentStaffName('');
  };

  // State Updates Handlers (Catalog & Logistik)
  const handleAddProduct = (newProd: Product) => setProducts(prev => [newProd, ...prev]);
  const handleUpdateProduct = (updatedProd: Product) => setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  const handleDeleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setProducts(prevProducts => prevProducts.map(p => {
      const cartItemMatch = newOrder.items.find(item => item.product.id === p.id);
      return cartItemMatch ? { ...p, stock: Math.max(0, p.stock - cartItemMatch.quantity) } : p;
    }));
    handleAddAuditLog('Order Placed', `Transaction ${newOrder.id} finalized.`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'paid' | 'shipped' | 'delivered') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    handleAddAuditLog('Order Progress Dispatch', `Order ${orderId} updated to ${status}.`);
  };

  const handleToggleWishlist = (id: string) => {
    const item = products.find(p => p.id === id);
    if (!item) return;
    setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAddArticle = (newArt: Article) => setArticles(prev => [newArt, ...prev]);
  const handleDeleteArticle = (id: string) => setArticles(prev => prev.filter(a => a.id !== id));
  const handleAddAdminUser = (newAdmin: AdminUser) => setAdminUsers(prev => [...prev, newAdmin]);
  const handleToggleAdminStatus = (id: string) => {
    setAdminUsers(prev => prev.map(a => a.id === id ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' } : a));
  };

  return (
    <div className="bg-stone-50 select-none min-h-screen relative">
      

      {/* RENDER VIEW BERDASARKAN HASIL AUTHENTIKASI FORM TUNGGAL */}
      {activeRole === 'customer' && (
        <CustomerView
          products={products}
          orders={orders}
          onAddOrder={handleAddOrder}
          wishlist={wishlist}
          onToggleWishlist={handleToggleWishlist}
          cart={cart}
          onUpdateCart={setCart}
          articles={articles}
          onStaffRedirect={handleStaffRedirect} // Meneruskan fungsi pengalihan role
        />
      )}

      {activeRole === 'admin' && (
        <AdminView
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          articles={articles}
          onAddArticle={handleAddArticle}
          onDeleteArticle={handleDeleteArticle}
          currentStaffName={currentStaffName}
          onLogout={handleAdminLogout} // Meneruskan fungsi logout
        />
      )}

      {activeRole === 'super_admin' && (
        <SuperAdminView
          products={products}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          articles={articles}
          onAddArticle={handleAddArticle}
          onDeleteArticle={handleDeleteArticle}
          adminUsers={adminUsers}
          onAddAdminUser={handleAddAdminUser}
          onToggleAdminStatus={handleToggleAdminStatus}
          auditLogs={auditLogs}
          onAddAuditLog={handleAddAuditLog}
        />
      )}

    </div>
  );
}
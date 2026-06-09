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
import RoleSelector from './components/RoleSelector';

export default function App() {
  // Role Selector State
  const [activeRole, setActiveRole] = useState<ActiveRole>('customer');

  // Shared Core States
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(['prod-1', 'prod-3']); // Initialized saved items for Maya
  
  // Admin & Security Log States
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>(initialAdmins);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialLogs);

  // Helper function to append systems digital logs
  const handleAddAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: activeRole === 'customer' ? 'Maya Anindita' : activeRole === 'admin' ? 'Budi Santoso' : 'Super Admin System Seal',
      details
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // State Updates: Catalog Products
  const handleAddProduct = (newProd: Product) => {
    setProducts(prev => [newProd, ...prev]);
  };

  const handleUpdateProduct = (updatedProd: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProd.id ? updatedProd : p));
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // State Updates: Orders & Logistics
  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);

    // REAL-TIME STOCK DEDUCTION (User Story satisfaction)
    setProducts(prevProducts => {
      const updated = prevProducts.map(p => {
        const cartItemMatch = newOrder.items.find(item => item.product.id === p.id);
        if (cartItemMatch) {
          const newStock = Math.max(0, p.stock - cartItemMatch.quantity);
          return { ...p, stock: newStock };
        }
        return p;
      });
      return updated;
    });

    handleAddAuditLog('Order Placed', `Customer ${newOrder.customerName} submitted transaction ${newOrder.id} totaling Rp ${newOrder.total.toLocaleString('id-ID')}. Stock adjusted.`);
  };

  const handleUpdateOrderStatus = (orderId: string, status: 'pending' | 'paid' | 'shipped' | 'delivered') => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    handleAddAuditLog('Order Progress dispatch', `Dispatched order ID ${orderId} step progress to status "${status}".`);
  };

  // State Updates: Wishlist
  const handleToggleWishlist = (id: string) => {
    const item = products.find(p => p.id === id);
    if (!item) return;

    if (wishlist.includes(id)) {
      setWishlist(prev => prev.filter(x => x !== id));
      handleAddAuditLog('Wishlist Removed', `Removed ${item.name} from savings list.`);
    } else {
      setWishlist(prev => [...prev, id]);
      handleAddAuditLog('Wishlist Saved', `Saved ${item.name} to persistent wish registry.`);
    }
  };

  // State Updates: Blog Editorial Articles
  const handleAddArticle = (newArt: Article) => {
    setArticles(prev => [newArt, ...prev]);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  // State Updates: Staffs Accounts
  const handleAddAdminUser = (newAdmin: AdminUser) => {
    setAdminUsers(prev => [...prev, newAdmin]);
  };

  const handleToggleAdminStatus = (id: string) => {
    setAdminUsers(prev => prev.map(a => {
      if (a.id === id) {
        const nextStatus = a.status === 'active' ? 'suspended' : 'active';
        return { ...a, status: nextStatus };
      }
      return a;
    }));
  };

  // Handle active role change smooth log
  const handleRoleChange = (role: ActiveRole) => {
    setActiveRole(role);
    const label = role === 'customer' ? 'Customer (Maya Anindita)' : role === 'admin' ? 'Admin Operator (Budi Santoso)' : 'Super Admin Root';
    handleAddAuditLog('Role Swapped', `Swapped active simulator persona workspace to ${label}.`);
  };

  return (
    <div className="bg-stone-50 select-none">
      
      {/* Floating simulator mode switcher widget */}
      <RoleSelector 
        currentRole={activeRole} 
        onChangeRole={handleRoleChange} 
      />

      {/* RENDER ACTIVE USER VIEW */}
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

export interface ProductVariant {
  colorName: string;
  imageColorUrl: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: "Fashion" | "Beauty";
  subCategory: string;
  price: number;
  stock: number;
  description: string;
  sizes: string[];
  variants: ProductVariant[];
  isFeatured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: "Fashion & Style" | "Skincare & Beauty" | "Lifestyle";
  excerpt: string;
  content: string;
  author: string;
  date: string;
  thumbnail: string;
  readTime: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  customerEmail: string;
  customerName: string;
  address: string;
  phone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: "Pending Verification" | "Verified" | "Failed";
  orderStatus: "Processing" | "Paid" | "Shipped" | "Delivered" | "Cancelled";
  trackingNumber?: string;
  estimatedDelivery: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userEmail: string;
  role: string;
  action: string;
  timestamp: string;
}

export interface SystemConfig {
  paymentGatewayActive: boolean;
  selectedGateway: "Midtrans" | "Stripe" | "Manual Transfer";
  securityLevel: "Standard" | "High";
  maintenanceMode: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "customer" | "admin" | "superadmin";
}

export interface CustomerSummary {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
}

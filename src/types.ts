export interface Product {
  id: string;
  name: string;
  category: 'skincare' | 'cosmetics' | 'accessories' | 'apparel';
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  categoryColor: string; // Dynamic placeholder hue for styling
  stock: number;
  ingredients?: string; // Skincare specific
  sizes?: string[]; // Apparel/Accessories specific
  colors?: string[]; // Color variants
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface Order {
  id: string;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  address: string;
  phone: string;
  date: string;
  paymentMethod: string;
}

export interface CurrentUser {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export type TabName =
  | "shop"
  | "articles"
  | "wishlist"
  | "orders"
  | "product-detail"
  | "checkout"
  | "login-register";

export interface Article {
  id: string;
  title: string;
  category: 'beauty' | 'fashion' | 'lifestyle';
  excerpt: string;
  content: string;
  readTime: string;
  author: string;
  date: string;
  image: string;
  tags: string[];
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'super_admin';
  avatar: string;
  status: 'active' | 'suspended';
}

export interface AuditLog {
  id: string;
  action: string;
  timestamp: string;
  user: string;
  details: string;
}

export type ActiveRole = 'customer' | 'admin' | 'super_admin';

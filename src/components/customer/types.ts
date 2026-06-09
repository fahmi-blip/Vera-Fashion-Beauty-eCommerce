import type React from "react";
import type { Product, CartItem, Order, Article } from "../../types";

export type CustomerTab =
  | "shop"
  | "articles"
  | "wishlist"
  | "orders"
  | "product-detail"
  | "checkout"
  | "login-register";

export interface CustomerUser {
  name: string;
  email: string;
  address: string;
  phone: string;
}

export type RenderProductIllustration = (
  id: string,
  category: string,
) => React.ReactNode;

export interface CustomerShopViewProps {
  products: Product[];
  wishlist: string[];
  selectedCategory: string;
  searchQuery: string;
  onSelectCategory: (category: string) => void;
  onSearchQueryChange: (query: string) => void;
  onClearSearch: () => void;
  onSelectProduct: (product: Product) => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
  renderProductIllustration: RenderProductIllustration;
  onViewProduct: (product: Product) => void;
}

export interface CustomerProductDetailViewProps {
  selectedProduct: Product;
  wishlist: string[];
  chosenSize: string;
  chosenColor: string;
  qty: number;
  onBackToShop: () => void;
  onChooseSize: (size: string) => void;
  onChooseColor: (color: string) => void;
  onChangeQty: (qty: number) => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (
    product: Product,
    size?: string,
    color?: string,
    count?: number,
  ) => void;
  renderProductIllustration: RenderProductIllustration;
}

export interface CustomerCheckoutViewProps {
  cart: CartItem[];
  cartSubtotal: number;
  shippingCharge: number;
  grandTotal: number;
  shippingName: string;
  shippingAddress: string;
  shippingPhone: string;
  paymentMethod: string;
  onBackToShop: () => void;
  onSubmitOrder: (event: React.FormEvent) => void;
  onShippingNameChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
  onPaymentMethodChange: (value: string) => void;
}

export interface CustomerEditorialViewProps {
  articles: Article[];
  activeArticle: Article | null;
  onSelectArticle: (article: Article) => void;
  onClearArticle: () => void;
  onOpenShop: () => void;
}

export interface CustomerWishlistViewProps {
  products: Product[];
  wishlist: string[];
  onOpenShop: () => void;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (product: Product) => void;
}

export interface CustomerOrdersViewProps {
  orders: Order[];
  onOpenShop: () => void;
}

export interface CustomerProfileViewProps {
  currentUser: CustomerUser | null;
  isRegistering: boolean;
  onToggleRegistering: (value: boolean) => void;
  onUpdateCurrentUser: (user: CustomerUser | null) => void;
  onLogout: () => void;
  onSaveProfile: (event: React.FormEvent) => void;
  onLoginSubmit: (event: React.FormEvent) => void;
  onRegisterSubmit: (event: React.FormEvent) => void;
  onShippingNameChange: (value: string) => void;
  onShippingAddressChange: (value: string) => void;
  onShippingPhoneChange: (value: string) => void;
}

export interface CustomerCartDrawerProps {
  cart: CartItem[];
  onClose: () => void;
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onGoToCheckout: () => void;
  onContinueShopping: () => void;
}
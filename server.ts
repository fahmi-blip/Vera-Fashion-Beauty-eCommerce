import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

// Define Data Type Structures
interface ProductVariant {
  colorName: string;
  imageColorUrl: string; // The product image switches based on this color selection
  hex: string;
}

interface Product {
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

interface Article {
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

interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface Order {
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

interface AuditLog {
  id: string;
  userEmail: string;
  role: string;
  action: string;
  timestamp: string;
}

interface SystemConfig {
  paymentGatewayActive: boolean;
  selectedGateway: "Midtrans" | "Stripe" | "Manual Transfer";
  securityLevel: "Standard" | "High";
  maintenanceMode: boolean;
}

// Initial Data Seed
let products: Product[] = [
  {
    id: "p1",
    name: "Classic Trench Dress",
    category: "Fashion",
    subCategory: "Outerwear",
    price: 2450000,
    stock: 14,
    description: "A tailored dress constructed in premium water-resistant Japanese cotton gabardine. Boasts clean contours with modular belt attachments, standard storm flaps, double-breasted horn-accented buttons, and an incredibly soft interior feel.",
    sizes: ["S", "M", "L"],
    isFeatured: true,
    variants: [
      {
        colorName: "Sand Beige",
        imageColorUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop",
        hex: "#D2B48C"
      },
      {
        colorName: "Noir Black",
        imageColorUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?q=80&w=600&auto=format&fit=crop",
        hex: "#1A1A1A"
      },
      {
        colorName: "Olive Sage",
        imageColorUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop",
        hex: "#708238"
      }
    ]
  },
  {
    id: "p2",
    name: "Mulberry Pleat Silk Dress",
    category: "Fashion",
    subCategory: "Dresses",
    price: 3100000,
    stock: 4, // low stock testing
    description: "Intricately hand-pleated from exquisite Mulberry luxury silk, with an asymmetric shoulder line and dynamic silhouette. Fits like a dream, catching light softly at every motion.",
    sizes: ["XS", "S", "M", "L"],
    isFeatured: true,
    variants: [
      {
        colorName: "Emerald Green",
        imageColorUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=600&auto=format&fit=crop",
        hex: "#097969"
      },
      {
        colorName: "Champagne Gold",
        imageColorUrl: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop",
        hex: "#F1E5AC"
      },
      {
        colorName: "Petal Rose",
        imageColorUrl: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop",
        hex: "#FFC0CB"
      }
    ]
  },
  {
    id: "p3",
    name: "Calfskin Hobo Slouch Bag",
    category: "Fashion",
    subCategory: "Accessories",
    price: 4200000,
    stock: 8,
    description: "Designed following minimalistic sculptural curvature. Cut and stitched from full-grain calfskin with interior suede lining, micro zipper pockets, and heavy gold-finished magnetic clasps.",
    sizes: ["One Size"],
    isFeatured: true,
    variants: [
      {
        colorName: "Caramel Brown",
        imageColorUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600&auto=format&fit=crop",
        hex: "#8B5A2B"
      },
      {
        colorName: "Soot Grey",
        imageColorUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop",
        hex: "#4E5154"
      }
    ]
  },
  {
    id: "p4",
    name: "Rosé Velvet Matte Lipstick",
    category: "Beauty",
    subCategory: "Lips",
    price: 649000,
    stock: 40,
    description: "Our signature velvet lip rouge formula, complete with hyaluronic acid spheres to plump lips and guarantee comfortable 16-hour long-wear performance without drying lines.",
    sizes: ["Standard Size", "Mini Size"],
    isFeatured: true,
    variants: [
      {
        colorName: "Siren Scarlet",
        imageColorUrl: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=600&auto=format&fit=crop",
        hex: "#B22222"
      },
      {
        colorName: "Muted Nude",
        imageColorUrl: "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?q=80&w=600&auto=format&fit=crop",
        hex: "#C59B89"
      },
      {
        colorName: "Sweet Plum",
        imageColorUrl: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=600&auto=format&fit=crop",
        hex: "#7D1242"
      }
    ]
  },
  {
    id: "p5",
    name: "Botanical Restorative Elixir",
    category: "Beauty",
    subCategory: "Skincare",
    price: 1100000,
    stock: 25,
    description: "Instantly calm skin and rescue your hydration levels. Infused with pure centella asiatica extracts, micro-algae minerals, squalane and vitamin E to nurture the skin’s native defense barrier.",
    sizes: ["50ml", "100ml"],
    variants: [
      {
        colorName: "Dewy Green",
        imageColorUrl: "https://images.unsplash.com/photo-1608248597481-496100c80836?q=80&w=600&auto=format&fit=crop",
        hex: "#D0F0C0"
      }
    ]
  },
  {
    id: "p6",
    name: "Aura Prism Glow Oil",
    category: "Beauty",
    subCategory: "Skincare",
    price: 1350000,
    stock: 0, // Out of Stock demonstration
    description: "A supercharged peptide facial serum suspended in custom rosehip and jojoba essential oils. Instantly refracts light upon skin application, sculpting a premium youthful high-gloss glass face.",
    sizes: ["30ml"],
    variants: [
      {
        colorName: "Opal Sheen",
        imageColorUrl: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop",
        hex: "#FAF0E6"
      }
    ]
  }
];

let articles: Article[] = [
  {
    id: "art1",
    title: "The Art of Capsule Wardrobe: Spring & Summer 2026",
    category: "Fashion & Style",
    excerpt: "Learn how to select fewer, durable luxury fabrics designed for timeless elegance and seamless pairings.",
    content: "The modern approach to vanity revolves around intentionality. Buying less, but choosing with exceptional care, is the core tenet of building a timeless capsule wardrobe. This season, structure meets weightless fluidity. In this article, our design curators highlight how pairing unstructured trench robes with pure Mulberry silk pleat midi dresses is creating a gorgeous, high-contrast dynamic that fits both professional board meetings and twilight garden occasions.\n\n### Key Investments:\n1. **The Classic Trench:** Select a cotton-gabardine weave that resists water while breathing elegantly.\n2. **Silk Underlays:** Silk regulates hydration and reflects light rather than absorbing it.\n3. **Calfskin Accents:** Opt for single-sourced full-grain leather bags that gain character with age.",
    author: "Elara Vane",
    date: "May 20, 2026",
    thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    readTime: "4 min read"
  },
  {
    id: "art2",
    title: "Aura Skin: 5 Golden Steps to Glass Skin Aesthetics",
    category: "Skincare & Beauty",
    excerpt: "Ditch active chemicals and return to nurturing lipid barriers with essential squalane and botanical peptide micro oil blends.",
    content: "An elegant complexion is not one that has been excessively correctively peeled; it is skin that is fundamentally calm. When we constantly disrupt our biological barrier using harsh chemical acids, we prevent the skin from reflecting ambient light at its native, glowing angle.\n\n### The Glowing Routine:\n1. **Double Cleanse:** Melt surface dust using custom jojoba serums, then cleanse using a soap-free botanical wash.\n2. **Centella Rescue:** Calm inflamed cells with Centella extracts to immediately equalize redness.\n3. **Hydration Locking:** Ensure dynamic moisture with clean humectants like hyaluronic acid.\n4. **Prism Peptide Feed:** Apply light-refracting biological peptides to stimulate collagen synthesis.\n5. **Essential Sun Armor:** Block UV damage with zinc oxide shields that do not compromise radiance.",
    author: "Dr. Maya Thorne",
    date: "May 15, 2026",
    thumbnail: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600&auto=format&fit=crop",
    readTime: "6 min read"
  },
  {
    id: "art3",
    title: "Minimalism & Sustainable High Luxury Aesthetics",
    category: "Lifestyle",
    excerpt: "Reflecting on how modern design is transitioning from loud branding back towards quiet elegance and architectural integrity.",
    content: "The paradigm of contemporary luxury is changing. People are moving away from immense logos and highly recognizable branding patterns. Instead, they choose apparel that speaks in whispers. Premium fabrics, tailored silhouettes, and understated hand-stitching are the ultimate indicators of luxury. This minimalist philosophy values sensory textures, high ergonomics, and absolute functional simplicity.\n\nAt VERA, we hold ourselves to these architectural guidelines. Our visual templates prioritize clean grids, generous white negative spaces, and a balanced high-contrast layout that frames our curated items as fine art pieces.",
    author: "Constantine Vera",
    date: "April 28, 2026",
    thumbnail: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600&auto=format&fit=crop",
    readTime: "5 min read"
  }
];

let orders: Order[] = [
  {
    id: "ORD-9021",
    customerEmail: "customer@vera.com",
    customerName: "Audrey Hepburn",
    address: "Jl. Senopati No. 42, Kebayoran Baru, Jakarta Selatan, 12190",
    phone: "081234567890",
    items: [
      {
        productId: "p1",
        productName: "Classic Trench Dress",
        price: 2450000,
        quantity: 1,
        selectedColor: "Sand Beige",
        selectedSize: "M"
      },
      {
        productId: "p4",
        productName: "Rosé Velvet Matte Lipstick",
        price: 649000,
        quantity: 2,
        selectedColor: "Siren Scarlet",
        selectedSize: "Standard Size"
      }
    ],
    subtotal: 3748000,
    shippingFee: 50000,
    total: 3798000,
    paymentMethod: "Bank Transfer (Virtual Account)",
    paymentStatus: "Verified",
    orderStatus: "Shipped",
    trackingNumber: "VERA-JKT-100293",
    estimatedDelivery: "May 28, 2026",
    createdAt: "2026-05-24T09:30:00.000Z"
  },
  {
    id: "ORD-5481",
    customerEmail: "guest@vera.com",
    customerName: "Emma Watson",
    address: "Regency Park Estate Phase II Block D, Surabaya, 60112",
    phone: "089876543210",
    items: [
      {
        productId: "p2",
        productName: "Mulberry Pleat Silk Dress",
        price: 3100000,
        quantity: 1,
        selectedColor: "Emerald Green",
        selectedSize: "S"
      }
    ],
    subtotal: 3100000,
    shippingFee: 40000,
    total: 3140000,
    paymentMethod: "Midtrans (E-Wallet)",
    paymentStatus: "Pending Verification",
    orderStatus: "Processing",
    estimatedDelivery: "May 29, 2026",
    createdAt: "2026-05-25T02:15:00.000Z"
  }
];

let auditLogs: AuditLog[] = [
  {
    id: "log1",
    userEmail: "super@vera.com",
    role: "Super Admin",
    action: "System initialization & mock database seed",
    timestamp: "2026-05-25T01:00:00.000Z"
  },
  {
    id: "log2",
    userEmail: "admin@vera.com",
    role: "Admin",
    action: "Updated Stock of Mulberry Pleat Silk Dress (p2) from 5 to 4",
    timestamp: "2026-05-25T02:15:15.000Z"
  }
];

let systemConfig: SystemConfig = {
  paymentGatewayActive: true,
  selectedGateway: "Manual Transfer",
  securityLevel: "Standard",
  maintenanceMode: false
};

// Simple Mock User Database (JWT or simulated Session Tokens)
let users = [
  { id: "u1", email: "customer@vera.com", name: "Audrey Hepburn", role: "customer", password: "password" },
  { id: "u2", email: "admin@vera.com", name: "Claire Redfield", role: "admin", password: "password" },
  { id: "u3", email: "super@vera.com", name: "Constantine Vera", role: "superadmin", password: "password" }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Helper function to log actions
  const addAuditLog = (userEmail: string, role: string, action: string) => {
    const log: AuditLog = {
      id: "log" + (auditLogs.length + 1) + "_" + Math.floor(Math.random() * 10000),
      userEmail,
      role,
      action,
      timestamp: new Date().toISOString()
    };
    auditLogs.unshift(log); // newest first
  };

  // --- API ROUTES ---

  // Auth Endpoints
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
      addAuditLog(user.email, user.role, `Successfully logged into platform`);
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      });
    } else {
      res.status(401).json({ success: false, message: "Invalid email or password combination." });
    }
  });

  app.post("/api/auth/register", (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ success: false, message: "Email has already been registered." });
    }
    const newUser = {
      id: "u" + (users.length + 1),
      email,
      name,
      role: "customer",
      password
    };
    users.push(newUser);
    addAuditLog(newUser.email, "Customer", "Registered new customer account");
    res.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: "customer"
      }
    });
  });

  // Product Catalog Endpoints
  app.get("/api/products", (req, res) => {
    res.json({ success: true, products });
  });

  app.get("/api/products/:id", (req, res) => {
    const product = products.find(p => p.id === req.params.id);
    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: "Product not encountered." });
    }
  });

  // Create Product
  app.post("/api/products", (req, res) => {
    const { email, role, product } = req.body;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const newProduct: Product = {
      id: "p" + (products.length + 1) + "_" + Math.floor(Math.random() * 1000),
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: Number(product.price) || 0,
      stock: Number(product.stock) || 0,
      description: product.description || "",
      sizes: product.sizes || ["One Size"],
      variants: product.variants || [{ colorName: "Default", imageColorUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600", hex: "#CCCCCC" }]
    };
    products.push(newProduct);
    addAuditLog(email, role === "superadmin" ? "Super Admin" : "Admin", `Created product: "${newProduct.name}" in ${newProduct.category}`);
    res.json({ success: true, product: newProduct });
  });

  // Update Product
  app.put("/api/products/:id", (req, res) => {
    const { email, role, product } = req.body;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not managed." });
    }
    
    products[index] = {
      ...products[index],
      name: product.name,
      category: product.category,
      subCategory: product.subCategory,
      price: Number(product.price),
      stock: Number(product.stock),
      description: product.description,
      sizes: product.sizes,
      variants: product.variants
    };

    addAuditLog(email, role === "superadmin" ? "Super Admin" : "Admin", `Updated product details & inventory: "${products[index].name}"`);
    res.json({ success: true, product: products[index] });
  });

  // Delete Product
  app.delete("/api/products/:id", (req, res) => {
    const { email, role } = req.query;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Product not encountered." });
    }
    const deletedName = products[index].name;
    products.splice(index, 1);
    addAuditLog(String(email), role === "superadmin" ? "Super Admin" : "Admin", `Deleted product: "${deletedName}"`);
    res.json({ success: true });
  });

  // Article Feed Endpoints
  app.get("/api/articles", (req, res) => {
    res.json({ success: true, articles });
  });

  app.get("/api/articles/:id", (req, res) => {
    const article = articles.find(art => art.id === req.params.id);
    if (article) {
      res.json({ success: true, article });
    } else {
      res.status(404).json({ success: false, message: "Article not found." });
    }
  });

  // Create Article
  app.post("/api/articles", (req, res) => {
    const { email, role, article } = req.body;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const newArticle: Article = {
      id: "art" + (articles.length + 1) + "_" + Math.floor(Math.random() * 1000),
      title: article.title,
      category: article.category,
      excerpt: article.excerpt || "",
      content: article.content || "",
      author: article.author || "Curator",
      date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      thumbnail: article.thumbnail || "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600",
      readTime: article.readTime || "3 min read"
    };
    articles.unshift(newArticle);
    addAuditLog(email, role === "superadmin" ? "Super Admin" : "Admin", `Created custom article: "${newArticle.title}"`);
    res.json({ success: true, article: newArticle });
  });

  // Edit Article
  app.put("/api/articles/:id", (req, res) => {
    const { email, role, article } = req.body;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const index = articles.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }

    articles[index] = {
      ...articles[index],
      title: article.title,
      category: article.category,
      excerpt: article.excerpt,
      content: article.content,
      readTime: article.readTime,
      thumbnail: article.thumbnail
    };

    addAuditLog(email, role === "superadmin" ? "Super Admin" : "Admin", `Updated article content: "${articles[index].title}"`);
    res.json({ success: true, article: articles[index] });
  });

  // Delete Article
  app.delete("/api/articles/:id", (req, res) => {
    const { email, role } = req.query;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "No clearance." });
    }
    const index = articles.findIndex(a => a.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Article not found." });
    }
    const deletedTitle = articles[index].title;
    articles.splice(index, 1);
    addAuditLog(String(email), role === "superadmin" ? "Super Admin" : "Admin", `Removed article: "${deletedTitle}"`);
    res.json({ success: true });
  });

  // Orders & Checkout Endpoints
  app.get("/api/orders", (req, res) => {
    // Return all or filtered order database
    const { email, role } = req.query;
    if (role === "admin" || role === "superadmin") {
      res.json({ success: true, orders });
    } else {
      const userOrders = orders.filter(o => o.customerEmail === email);
      res.json({ success: true, orders: userOrders });
    }
  });

  app.post("/api/orders", (req, res) => {
    const { email, name, address, phone, items, subtotal, shippingFee, total, paymentMethod } = req.body;
    
    // Reduce product stocks safely upon placing order
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        product.stock = Math.max(0, product.stock - item.quantity);
      }
    }

    const newOrder: Order = {
      id: "ORD-" + Math.floor(1000 + Math.random() * 9000),
      customerEmail: email || "guest@vera.com",
      customerName: name || "Regis VERA User",
      address: address || "No address provided",
      phone: phone || "–",
      items,
      subtotal,
      shippingFee,
      total,
      paymentMethod,
      paymentStatus: "Pending Verification",
      orderStatus: "Processing",
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      createdAt: new Date().toISOString()
    };

    orders.unshift(newOrder); // newest first
    addAuditLog(email || "guest@vera.com", "Customer", `Placed Order ${newOrder.id} totaling ${total.toLocaleString("id-ID")} IDR`);
    res.json({ success: true, order: newOrder });
  });

  // Update Order Status (Verification & Delivery Tracking)
  app.put("/api/orders/:id", (req, res) => {
    const { email, role, paymentStatus, orderStatus, trackingNumber } = req.body;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access restricted." });
    }
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Order not found." });
    }

    if (paymentStatus) orders[index].paymentStatus = paymentStatus;
    if (orderStatus) orders[index].orderStatus = orderStatus;
    if (trackingNumber !== undefined) orders[index].trackingNumber = trackingNumber;

    addAuditLog(email, role === "superadmin" ? "Super Admin" : "Admin", `Updated Order status of ${req.params.id} -> Payment: ${orders[index].paymentStatus}, Delivery: ${orders[index].orderStatus}`);
    res.json({ success: true, order: orders[index] });
  });

  // Re-order Support Route
  app.post("/api/orders/:id/reoder", (req, res) => {
    const { email } = req.body;
    const oldOrder = orders.find(o => o.id === req.params.id);
    if (!oldOrder) {
      return res.status(404).json({ success: false, message: "Previous invoice not found." });
    }
    res.json({ success: true, items: oldOrder.items });
  });

  // Customer Management Endpoints
  app.get("/api/customers", (req, res) => {
    const { role } = req.query;
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    // Compile a clean customer view with total spending and transactional stats
    const customers = users.filter(u => u.role === "customer").map(u => {
      const userOrders = orders.filter(o => o.customerEmail === u.email);
      const totalSpent = userOrders.reduce((sum, o) => sum + o.total, 0);
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        totalOrders: userOrders.length,
        totalSpent
      };
    });
    res.json({ success: true, customers });
  });

  // Admin Management Endpoints (Super Admin Only)
  app.get("/api/admins", (req, res) => {
    const { role } = req.query;
    if (role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin authorization required." });
    }
    const admins = users.filter(u => u.role === "admin" || u.role === "superadmin");
    res.json({ success: true, admins });
  });

  app.post("/api/admins", (req, res) => {
    const { superEmail, superRole, email, name, password, targetRole } = req.body;
    if (superRole !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin authority required." });
    }
    const exists = users.find(u => u.email === email);
    if (exists) {
      return res.status(400).json({ success: false, message: "User exists with this email address." });
    }
    const newAdmin = {
      id: "u" + (users.length + 1),
      email,
      name,
      role: targetRole || "admin",
      password: password || "password"
    };
    users.push(newAdmin);
    addAuditLog(superEmail, "Super Admin", `Added new admin: "${name}" (${newAdmin.role})`);
    res.json({ success: true, admin: newAdmin });
  });

  app.delete("/api/admins/:id", (req, res) => {
    const { superEmail, superRole } = req.query;
    if (superRole !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin authority required." });
    }
    const index = users.findIndex(u => u.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: "Staff not found." });
    }
    if (users[index].email === "super@vera.com") {
      return res.status(400).json({ success: false, message: "Cannot remove primary super admin." });
    }
    const deletedName = users[index].name;
    users.splice(index, 1);
    addAuditLog(String(superEmail), "Super Admin", `Removed admin user: "${deletedName}"`);
    res.json({ success: true });
  });

  // Business Analytics Dashboard Endpoints
  app.get("/api/analytics", (req, res) => {
    const { role } = req.query;
    if (role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Access restricted to Super Admin." });
    }

    // Calculations
    const totalSales = orders
      .filter(o => o.paymentStatus === "Verified" || o.orderStatus === "Delivered")
      .reduce((sum, o) => sum + o.total, 0);

    const pendingSalesCount = orders.filter(o => o.paymentStatus === "Pending Verification").length;

    // Monthly revenue simulation
    const revenueByMonth = [
      { name: "Jan", revenue: 14000000, orders: 4 },
      { name: "Feb", revenue: 19500000, orders: 6 },
      { name: "Mar", revenue: 26000000, orders: 9 },
      { name: "Apr", revenue: 22000000, orders: 7 },
      { name: "May", revenue: totalSales, orders: orders.length }
    ];

    // Best-selling products counting
    const productSalesMap: Record<string, { name: string; quantity: number; revenue: number }> = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (!productSalesMap[item.productId]) {
          productSalesMap[item.productId] = { name: item.productName, quantity: 0, revenue: 0 };
        }
        productSalesMap[item.productId].quantity += item.quantity;
        productSalesMap[item.productId].revenue += item.price * item.quantity;
      });
    });

    const bestSellers = Object.values(productSalesMap).sort((a, b) => b.quantity - a.quantity);

    res.json({
      success: true,
      data: {
        totalSales,
        totalOrdersCount: orders.length,
        pendingSalesCount,
        customerGrowthCount: users.filter(u => u.role === "customer").length,
        revenueByMonth,
        bestSellers
      }
    });
  });

  // System Configuration Endpoints
  app.get("/api/config", (req, res) => {
    res.json({ success: true, config: systemConfig });
  });

  app.put("/api/config", (req, res) => {
    const { email, role, config } = req.body;
    if (role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    
    systemConfig = {
      paymentGatewayActive: config.paymentGatewayActive,
      selectedGateway: config.selectedGateway,
      securityLevel: config.securityLevel,
      maintenanceMode: config.maintenanceMode
    };

    addAuditLog(email, "Super Admin", `Altered system configuration -> Gateway: ${systemConfig.selectedGateway}, Security: ${systemConfig.securityLevel}, Maintenance: ${systemConfig.maintenanceMode}`);
    res.json({ success: true, config: systemConfig });
  });

  // Audit Logs Endpoint
  app.get("/api/audit-logs", (req, res) => {
    const { role } = req.query;
    if (role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Super Admin authority required." });
    }
    res.json({ success: true, logs: auditLogs });
  });

  // Clear Logs
  app.delete("/api/audit-logs", (req, res) => {
    const { email, role } = req.query;
    if (role !== "superadmin") {
      return res.status(403).json({ success: false, message: "Forbidden" });
    }
    auditLogs = [];
    addAuditLog(String(email), "Super Admin", "Cleared system audit logs");
    res.json({ success: true });
  });

  // --- VITE MIDDLEWARE SETUP ---
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[VERA backend] Server running bound to http://localhost:${PORT}`);
  });
}

startServer();

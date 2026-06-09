import { Product, Article, AdminUser, AuditLog } from './types';

export const initialProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Rosé Infused Hydro-Glow Serum',
    category: 'skincare',
    price: 420000, // IDR or similar, let's use Indonesian Rupiah (since Maya & Budi are premium Indonesian professional personas in the PRD, e.g., 420.000 IDR makes it feel local and highly detailed)
    description: 'A luxurious, lightweight, and deeply hydrating serum infused with Bulgarian organic rosewater, dual-weight hyaluronic acid, and niacinamide to restore resilience and natural radiance.',
    rating: 4.8,
    reviewCount: 124,
    image: 'rose_serum', // We can style an elegant digital thumbnail or CSS backdrop-gradient with Rose/Gold glow
    categoryColor: 'from-pink-100 to-rose-200 border-rose-300 text-rose-800',
    stock: 45,
    ingredients: 'Organic Rosa Damascena Flower Water, Glycerin, Sodium Hyaluronate (Dual Weight), Niacinamide (Vitamin B3), Camellia Sinensis (Green Tea) Leaf Extract, Allantoin, Panthenol.',
    isFeatured: true
  },
  {
    id: 'prod-2',
    name: 'Silk Sheen Velvet Lip Tint',
    category: 'cosmetics',
    price: 245000,
    description: 'A revolutionary lip tint formula that glides on like liquid silk, drying down to an ultra-comfortable velvet-matte finish. Soft-blur effect that minimizes lip lines while staying hydrate-locked.',
    rating: 4.7,
    reviewCount: 98,
    image: 'velvet_lip',
    categoryColor: 'from-rose-200 to-amber-200 border-amber-300 text-amber-900',
    stock: 30,
    colors: ['Petal Soft', 'Crimson Satin', 'Warm Sienna', 'Berry Cashmere'],
    isFeatured: true
  },
  {
    id: 'prod-3',
    name: '24k Vermeil Gold Minimalist Hoops',
    category: 'accessories',
    price: 680000,
    description: 'Waterproof, hypoallergenic, and timeless chunkier huggie hoops crafted in thick 24k gold plating on 925 Sterling Silver. Designed for everyday premium style that never tarnishes.',
    rating: 4.9,
    reviewCount: 76,
    image: 'gold_hoops',
    categoryColor: 'from-yellow-100 to-amber-200 border-yellow-300 text-yellow-800',
    stock: 12,
    sizes: ['S (12mm)', 'M (16mm)', 'L (20mm)'],
    isFeatured: true
  },
  {
    id: 'prod-4',
    name: 'Méridien Tailored Linen Blazer',
    category: 'apparel',
    price: 890000,
    description: 'An elegantly tailored single-breasted blazer made from premium French flax linen. Features structured shoulders, natural tortoiseshell effect buttons, and a clean modern silhouette perfect for work-to-weekend styling.',
    rating: 4.6,
    reviewCount: 54,
    image: 'linen_blazer',
    categoryColor: 'from-amber-100 to-orange-100 border-amber-200 text-amber-800',
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Oatmeal', 'Sand', 'Sage Green', 'Midnight Ink'],
    isFeatured: true
  },
  {
    id: 'prod-5',
    name: 'Ceramide Barrier Defense Cream',
    category: 'skincare',
    price: 380000,
    description: 'Our award-winning daily moisturizer engineered with 5 essential ceramides, squalane, and colloidal oat. Reinforces compromised skin barriers, locking in hydration for up to 48 hours without greasiness.',
    rating: 4.9,
    reviewCount: 204,
    image: 'barrier_cream',
    categoryColor: 'from-blue-50 to-indigo-100 border-indigo-200 text-indigo-800',
    stock: 60,
    ingredients: 'Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Squalane, Avena Sativa (Oat) Kernel Flour, Hyaluronic Acid, Centella Asiatica Extract.',
    isFeatured: false
  },
  {
    id: 'prod-6',
    name: 'Ambiance Satin Sleep & Eye Mask Duo',
    category: 'accessories',
    price: 195000,
    description: 'Crafted using the highest grade, friction-reducing hypoallergenic vegan satin. Helps prevent friction hair damage, facial sleeping creases, and shields delicate skin around original lock-in facial skin treatments.',
    rating: 4.5,
    reviewCount: 41,
    image: 'satin_duo',
    categoryColor: 'from-violet-100 to-purple-100 border-violet-200 text-violet-800',
    stock: 25,
    colors: ['Champagne Gold', 'Blush Pink', 'Ethereal Blue', 'Charcoal Slate'],
    isFeatured: false
  },
  {
    id: 'prod-7',
    name: 'Luminous Glow Glass Skin Powder',
    category: 'cosmetics',
    price: 320000,
    description: 'An ultra-fine weightless finishing powder infused with biological light-reflective silk proteins to set makeup of active women. Delivers a soft-focus translucent radiance rather than a flat chalky look.',
    rating: 4.6,
    reviewCount: 38,
    image: 'glow_powder',
    categoryColor: 'from-amber-50 to-pink-50 border-pink-200 text-amber-800',
    stock: 0, // Mock an Out of Stock product for Admin and User viewing!
    colors: ['Translucent', 'Warm Peach', 'Deep Golden'],
    isFeatured: false
  },
  {
    id: 'prod-8',
    name: 'Sculpted Organic Cotton Rib Top',
    category: 'apparel',
    price: 325000,
    description: 'Expertly knitted ribbed top in mediumweight GOTS-certified organic cotton with a hint of stretch. Features a refined scoop neckline and engineered darts that embrace your body shape with luxurious comfort.',
    rating: 4.8,
    reviewCount: 61,
    image: 'cotton_top',
    categoryColor: 'from-stone-100 to-neutral-200 border-stone-300 text-stone-800',
    stock: 35,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Chalk White', 'Cafe Latte', 'Warm Taupe', 'Olive'],
    isFeatured: false
  }
];

export const initialArticles: Article[] = [
  {
    id: 'art-1',
    title: 'The Sustainable Wardrobe: 5 Capsule Essentials for the Modern Professional',
    category: 'fashion',
    excerpt: 'Building a timeless and elegant wardrobe doesn\'t require hundreds of items. Discover our curated formula to look highly polished with minimal ecological footprint.',
    content: `Building a sustainable capsule wardrobe is an investment in both your professional image and the environment. Overconsumption in fast fashion has led to massive textile wastes worldwide. Here are the 5 essentials that look high-end, feel comfortable, and can be remixed into over 30 unique professional outfits:

1. The Perfect Tailored Blazer: A French flax linen or organic wool structure in earth tones immediately frames the shoulders and commands executive presence.
2. High-Neck Ribbed Bodysuit: A tight-knit organic cotton rib top remains beautifully tucked and keeps clean, linear shapes.
3. Mid-Heel Classic Loafers: High comfort leather is crucial for long workdays.
4. Elegant Vermeil Gold Hoops: Gold plated silver details elevate even the simplest t-shirt to high-fashion status.
5. Wide-Leg Drapey Trousers: These balance comfort and visual structure.

Focusing on premium organic materials like linen, tencel, and organic cotton allows the garments to breathe beautifully, staying fresh all day.`,
    readTime: '4 min read',
    author: 'Vera Editorial Staff',
    date: '2026-05-15',
    image: 'fashion_art',
    tags: ['Sustainable', 'Workwear', 'Capsule Wardrobe']
  },
  {
    id: 'art-2',
    title: 'Glass Skin Architecture: How to Nourish a Resilient Skin Barrier',
    category: 'beauty',
    excerpt: 'Instead of chasing aggressive exfoliating acids, high derm-standards focus on locking down hydration and replenishing native lipid bonds. Here\'s the routine.',
    content: `A radiant, glowing "glass skin" complexion is not the result of thin-strip harsh peeling; rather, it is a reflection of a deeply hydrated, calm, and optimally functioning skin barrier. 

Our outer skin layers (the stratum corneum) operate like a brick-and-mortar wall. The skin cells represent the bricks, and lipids—primarily ceramides, cholesterol, and free fatty acids—serve as the mortar holding the bricks together. When you over-exfoliate, this mortar breaks, leading to immediate water loss, irritation, and redness.

To repair your skin architecture:
1. Double Cleanse with an Oil/Balm: Break down lipophilic sunscreens and makeup without stripping natural sebum.
2. Apply Hydrating Serums First: Utilize dual-weight hyaluronic acids and calming rosewater extracts immediately on damp skin.
3. Shield with Multi-Ceramides: Ceramides NP, AP, and EOP form an artificial seal that mimics natural barrier protective lipids.
4. Use Squalane Overnight: This biomimetic oil lock doesn't clog pores, but stops water molecules from leaving the skin surface as you sleep.`,
    readTime: '6 min read',
    author: 'Dr. Evelyn Carter, Medical Advisor',
    date: '2026-05-28',
    image: 'beauty_art',
    tags: ['Skincare', 'Barrier Repair', 'Glass Skin']
  }
];

export const initialAdmins: AdminUser[] = [
  {
    id: 'adm-1',
    name: 'Budi Santoso',
    email: 'budi.operations@vera.com',
    role: 'admin',
    avatar: 'BS',
    status: 'active'
  },
  {
    id: 'adm-2',
    name: 'Maya Anindita (Acting Super)',
    email: 'maya.anindita@vera.com',
    role: 'super_admin',
    avatar: 'MA',
    status: 'active'
  },
  {
    id: 'adm-3',
    name: 'Siti Rahma',
    email: 'siti.content@vera.com',
    role: 'admin',
    avatar: 'SR',
    status: 'active'
  }
];

export const initialLogs: AuditLog[] = [
  {
    id: 'log-1',
    action: 'Product Restocked',
    timestamp: '2026-06-02 08:15:30',
    user: 'Budi Santoso',
    details: 'Restocked "Rosé Infused Hydro-Glow Serum" +10 units'
  },
  {
    id: 'log-2',
    action: 'Auth System Modified',
    timestamp: '2026-06-01 14:22:11',
    user: 'Maya Anindita',
    details: 'Enabled VeraPay backup gateways API V2 connection.'
  },
  {
    id: 'log-3',
    action: 'Article Created',
    timestamp: '2026-05-28 10:10:00',
    user: 'Siti Rahma',
    details: 'Published "Glass Skin Architecture: How to Nourish a Resilient Skin Barrier"'
  }
];

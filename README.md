# VESTORA Atelier — Complete Premium Fashion E-Commerce Platform

> **VESTORA** is a modern, high-end, production-oriented fashion e-commerce platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and full server-side API integration. Engineered around quiet luxury, honest material specifications, verified fabric GSM density, and an interactive 4-garment side-by-side comparison system.

---

## 🌟 Brand Identity & Aesthetic Principles

- **Brand Name**: VESTORA (Atelier & Sartorial House)
- **Palette**: Warm Ivory (`#FCFBF9`), Rich Charcoal (`#181817`), Natural Sand/Bone (`#F4F0EA`), Champagne Gold accents (`#C5A880`).
- **Typography**: Editorial serif headings (`Playfair Display`, `Cinzel`) paired with geometric sans (`Inter`) for crisp legibility.
- **Garment Integrity**: Zero fake scarcity, zero fabricated claims. Every garment details its verified Grams per Square Meter (GSM), yarn staple count, stitching technique, and authentic mill of origin.

---

## 🏛️ System Architecture & Feature Matrix

### 1. Homepage & Campaign Experience (`/`)
- **Top Announcement Bar**: Cycling announcements highlighting complimentary shipping thresholds, seasonal drops, and promotional voucher codes.
- **Editorial Hero Section**: Full-bleed campaign banner for Autumn/Winter 2026 Couture with quick CTAs.
- **Instant Indian PIN Code Validator**: Live 6-digit postal code lookup verifying city, state, and courier speed directly on the homepage.
- **Category Showcase**: Visual cards for Women's Couture, Men's Sartorial, Heritage Ethnic Wear, Outerwear, Raw Selvedge Denim, and Heavyweight Basics.
- **Trending & Bestsellers**: Real-time product cards featuring live color swatch switching, quick compare triggers, and quick bag addition.
- **The Fabric Manifesto**: Educational spotlight explaining 22-Momme silk, 480 GSM loopback cotton, and Super 130s merino wool.
- **Editorial Reviews**: Verified patron testimonials with star ratings and city indicators.

### 2. Product Catalogue & 15+ Attribute Filters (`/products`)
- **Category & Subcategory Filtering**: T-Shirts, Shirts, Jeans, Trousers, Jackets, Hoodies, Dresses, Ethnic Wear, Activewear, Accessories.
- **Audience Filtering**: Men, Women, Unisex.
- **Interactive Price Range Slider**: Dynamically adjusts between ₹1,000 and ₹25,000.
- **Size Selector**: XS, S, M, L, XL, XXL.
- **Fit Silhouette**: Slim Fit, Regular Fit, Relaxed Fit, Oversized Fit, Tailored Fit.
- **Fabric Type Filter**: Mulberry Silk, Egyptian Giza Cotton, Supima Cotton, Selvedge Denim, French Terry, Merino Wool, Belgian Linen, Econyl Nylon.
- **Occasion Filtering**: Cocktail Gala, Formal Business, Festive Weddings, Everyday Casual, Resort Holidays.
- **Certifications Toggle**: Instant filter for GOTS Organic, OEKO-TEX Standard 100, and Silk Mark certified garments.
- **Discount & Rating Filters**: Filter by minimum discount percentage (10%+, 20%+, 30%+) or ratings.
- **Sorting Modes**: Price Low-to-High, Price High-to-Low, Popularity/Bestsellers, Customer Rating, Newest Arrivals, Biggest Reductions.
- **Layout Switcher**: Grid view vs List view.
- **Filter Chips**: Individual chip dismissals and one-click "Clear All".

### 3. Detailed Product Pages (`/products/[id]`)
- **Multi-Angle Gallery**: High-resolution gallery with thumbnail switcher and hover zoom.
- **Live Variant Swatches**: Clickable color circles that instantly update imagery and size stock availability.
- **Live Stock Alerts**: Dynamic notices (e.g. *"Only 2 pieces remaining in Size M"*).
- **Size Chart & Smart Fit Recommendation Calculator**:
  - Modal with measurement tables in both **Inches** and **Centimeters**.
  - Interactive calculator where shoppers input Chest, Waist, and Fit Preference (Slim/Regular/Relaxed) to receive an instant bespoke size recommendation.
- **Instant Pincode Delivery Estimator**: Validates real 6-digit Indian PIN codes and returns delivery arrival dates and courier eligibility.
- **12 Structured Fabric & Tailoring Accordion Attributes**:
  1. *Fabric Composition & physical weave*
  2. *Fabric Weight / GSM (e.g. 95 GSM silk, 220 GSM Supima, 480 GSM French Terry)*
  3. *Texture, Softness rating, and Breathability*
  4. *Fit silhouette & tailoring contour*
  5. *Design highlights (collars, horn buttons, French seams, walking slits)*
  6. *Garment construction technique & stitch density (e.g. 18 stitches per inch)*
  7. *Verified manufacturing origin (Como Italy, Porto Portugal, Varanasi, Tirupur)*
  8. *Comfort & functional characteristics (moisture management, bias stretch)*
  9. *Artisanal care instructions (wash temperatures, drying, steaming)*
  10. *Best occasions and seasons*
  11. *Verified sustainability certifications (OEKO-TEX, GOTS, Silk Mark)*
  12. *What's included in purchase package & Model sizing reference*
- **"Complete The Look" Recommendations**: Stylist-curated bundle suggestions.
- **Patron Reviews & Submission Modal**: Interactive form allowing verified buyers to post star ratings, headlines, and detailed feedback.
- **Recently Viewed Ribbon**: Remembers and tracks previously browsed garments.

### 4. Dedicated 4-Garment Comparison System (`/compare`)
- **Multi-Product Matrix**: Side-by-side comparison of 2, 3, or up to 4 garments simultaneously.
- **Contrast Highlighting**: *"Highlight Contrasting Specs"* toggle spotlights varying attributes in a soft champagne glow.
- **Lowest Price Indicator**: Automatically detects and tags the lowest-priced garment in the group.
- **Attribute Rows Compared**:
  - Image, Name, Brand, Price, MRP, Discount %
  - Fabric composition, GSM weight, and weave thickness
  - Hand-feel texture and softness classification
  - Fit silhouette
  - Garment construction & seam technique
  - Verified manufacturing origin
  - Breathability & stretch properties
  - Sustainability certifications
  - Customer ratings and review counts
  - Care instructions
  - Estimated delivery speed and return policies
- **Interactive Controls**: Remove items, clear all, or open modal to add new garments from catalogue.
- **Persistent State**: Comparison table state is preserved across page navigation via localStorage and StoreContext.

### 5. Shopping Cart & Drawer (`/cart`)
- **Slide-Over Drawer & Full Cart Page**: Smooth cart slide-out from header bag trigger.
- **Complimentary Shipping Progress Bar**: Visual progress indicator towards the ₹2,999 free express shipping threshold.
- **On-the-Fly Variant Customization**: Change garment size or color directly in the bag without returning to the product page.
- **Promotional Coupon Engine**: Supports codes like `LUXE15` (15% off orders > ₹5,000), `VESTORA10` (10% off), and `FIRST1000` (flat ₹1,000 off).
- **Financial Breakdown**: Subtotal, Coupon discount, Express courier calculation, 5% GST computation, and Final Payable Amount.

### 6. Multi-Step Checkout & Payment Sandbox (`/checkout`)
- **Contact & Shipping Address**: Validated Indian PIN code lookup with auto-population of city and state.
- **Shipping Speed Selection**:
  - *White-Glove Express Air Courier* (Complimentary over ₹2,999 or ₹250 flat).
  - *Standard Ground Transit* (Free).
- **Sandbox Payment Gateway Integrations**:
  - **UPI Simulator**: Interactive QR code generator and Virtual Payment Address (VPA) verification.
  - **Credit / Debit Cards**: Card number formatting, expiry/CVV masking, 3D Secure test simulation.
  - **NetBanking**: Integrated with major banks (HDFC, ICICI, SBI, Axis, Kotak).
  - **Cash on Delivery (COD)**: With automated SMS verification simulation.
- **Order Confirmation & Tax Invoice (`/order-success`)**:
  - Celebratory confetti animation.
  - Live order tracking timeline (Confirmed &rarr; Atelier Preparation &rarr; Dispatched &rarr; Delivered).
  - Itemized printable tax receipt with GSTIN breakdown.

### 7. Customer Account Dashboard (`/account`)
- **Order History**: Track past and active orders with live fulfillment status updates.
- **15-Day Return / Exchange Submission**: Modal allowing patrons to submit size exchange or refund requests.
- **Saved Shipping Addresses**: Manage multiple delivery locations with a default selection.
- **Saved Wishlist**: Instant access to bookmarked pieces.

### 8. Store Administrator Dashboard (`/admin`)
- **Executive Analytics**: Total Revenue, Total Orders, Average Order Value, Active Inventory count.
- **Order Status Management**: Interactive dropdown to update real-time order status (*Order Placed*, *Processing*, *Shipped*, *Out for Delivery*, *Delivered*, *Cancelled*).
- **Garment Catalogue & Inventory**: View stock unit levels across all sizes.
- **Add Garment Modal**: Create and publish new garments with custom fabric GSM, category, gender, prices, and imagery.

### 9. AI Fashion Stylist & Atelier Concierge
- Floating concierge trigger in header and hero.
- Knowledgeable AI assistant answering queries regarding silk momme weights, Giza cotton breathability, raw selvedge denim break-in, and gala outfit pairings with direct links to catalogue items.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS with bespoke luxury tokens |
| **Icons** | Lucide React |
| **Animations** | Canvas Confetti & CSS keyframes |
| **State Management** | React Context (`StoreContext`) with LocalStorage persistence |
| **API Layer** | Next.js Server Routes (`/api/products`, `/api/checkout`, `/api/pincode`, `/api/coupons`) |

---

## 🚀 Running Locally

### Prerequisites
- Node.js v18+ or v20+
- npm or yarn

### Quick Start
```bash
# 1. Clone repository or enter directory
cd deep_web

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 🔑 Available Test Credentials & Voucher Codes

- **Demo Admin Portal**: Access directly via navigation bar or visit `/admin`.
- **Pre-configured User Account**: `aria.demonte@vestora.com`
- **Promotional Voucher Codes**:
  - `LUXE15` &rarr; 15% discount on orders above ₹5,000
  - `VESTORA10` &rarr; 10% discount on orders above ₹2,000
  - `FIRST1000` &rarr; Flat ₹1,000 discount on orders above ₹7,000
- **Supported Test PIN Codes**:
  - `400018` (Mumbai, Maharashtra &bull; 1-Day Express)
  - `110001` (New Delhi, Delhi &bull; 1-Day Express)
  - `560001` (Bengaluru, Karnataka &bull; 2-Day Delivery)
  - Any valid 6-digit Indian postal code.

---

&copy; 2026 VESTORA Atelier Private Limited. All rights reserved.
# VESTORA-Atelier-Complete-Premium-Fashion-E-Commerce-Platform

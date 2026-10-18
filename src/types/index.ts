export type Gender = 'Men' | 'Women' | 'Unisex';

export type Category =
  | 'T-Shirts'
  | 'Shirts'
  | 'Jeans'
  | 'Trousers'
  | 'Jackets'
  | 'Hoodies'
  | 'Dresses'
  | 'Ethnic Wear'
  | 'Activewear'
  | 'Accessories';

export interface ProductVariant {
  id: string;
  colorName: string;
  colorHex: string;
  images: string[];
  sizes: {
    size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
    stock: number;
  }[];
}

export interface FabricDetails {
  composition: string;
  gsm?: number;
  texture: string;
  softness: 'Soft' | 'Extra Soft' | 'Crisp' | 'Silky' | 'Brushed';
  thickness: 'Lightweight' | 'Medium Weight' | 'Heavyweight';
  breathability: 'High' | 'Very High' | 'Medium';
  stretch: string;
  wrinkleResistance: string;
  moistureManagement: string;
  lining?: string;
  certifications?: string[];
  careInstructions: string[];
}

export interface ProductSpecification {
  fitType: 'Slim Fit' | 'Regular Fit' | 'Relaxed Fit' | 'Oversized Fit' | 'Tailored Fit';
  designDetails: string[];
  garmentConstruction: string;
  stitchingTechnique: string;
  manufacturingOrigin: string;
  bestOccasions: string[];
  bestSeasons: string[];
  whatsIncluded: string[];
  modelInfo?: {
    height: string;
    chestOrBust?: string;
    waist?: string;
    sizeWorn: string;
  };
}

export interface Review {
  id: string;
  userName: string;
  userLocation?: string;
  rating: number; // 1 to 5
  date: string;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  images?: string[];
  helpfulCount: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  tagline: string;
  price: number; // in INR
  originalPrice: number; // MRP
  discountPercentage: number;
  category: Category;
  gender: Gender;
  rating: number;
  reviewCount: number;
  isNewArrival?: boolean;
  isBestseller?: boolean;
  isTrending?: boolean;
  isSustainable?: boolean;
  featuredFabric?: string;
  variants: ProductVariant[];
  fabric: FabricDetails;
  specifications: ProductSpecification;
  shortDescription: string;
  longDescription: string;
  availableCoupons?: string[];
  estimatedDaysToDeliver?: number;
  returnPolicyDays: number;
  warranty?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  unitPrice: number;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  description: string;
  expiryDate: string;
  isActive: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Order Placed' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  trackingNumber: string;
  estimatedDelivery: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  savedAddresses: ShippingAddress[];
  role: 'customer' | 'admin';
}

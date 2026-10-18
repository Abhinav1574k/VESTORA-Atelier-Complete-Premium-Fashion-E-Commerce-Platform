'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Coupon, ShippingAddress, Order, User, OrderStatus } from '@/types';
import { initialProducts, mockCoupons } from '@/data/products';

export interface Toast {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

export interface PinDeliveryResult {
  pin: string;
  city: string;
  state: string;
  estimatedDays: number;
  isDeliverable: boolean;
  isExpressAvailable: boolean;
  message: string;
}

export const defaultUser: User = {
  id: 'usr-demo-patron',
  name: 'Aria De Monte',
  email: 'aria.demonte@vestora.com',
  phone: '+91 98765 43210',
  role: 'customer',
  savedAddresses: [
    {
      fullName: 'Aria De Monte',
      phone: '+91 98765 43210',
      email: 'aria.demonte@vestora.com',
      addressLine1: 'Penthouse 12B, The Oberoi Enclave',
      addressLine2: 'Dr. Annie Besant Road, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400018',
      isDefault: true,
    },
  ],
};

export const defaultOrders: Order[] = [
  {
    id: 'ord-8921',
    orderNumber: 'VST-2026-8921',
    date: '12 Oct 2026',
    customerName: 'Aria De Monte',
    customerEmail: 'aria.demonte@vestora.com',
    customerPhone: '+91 98765 43210',
    items: [
      {
        id: 'ci-prev-1',
        productId: 'prod-001',
        product: initialProducts[0],
        selectedColor: 'Champagne Gold',
        selectedSize: 'S',
        quantity: 1,
        unitPrice: 8499,
      },
    ],
    shippingAddress: {
      fullName: 'Aria De Monte',
      phone: '+91 98765 43210',
      email: 'aria.demonte@vestora.com',
      addressLine1: 'Penthouse 12B, The Oberoi Enclave, Worli',
      city: 'Mumbai',
      state: 'Maharashtra',
      pinCode: '400018',
    },
    subtotal: 8499,
    discount: 850,
    shippingFee: 0,
    tax: 382,
    total: 8031,
    status: 'Shipped',
    paymentMethod: 'UPI',
    paymentStatus: 'Paid',
    trackingNumber: 'BLUEDART-IND-7782914',
    estimatedDelivery: '20 Oct 2026',
  },
];

interface StoreContextType {
  // Persistence state
  isHydrated: boolean;
  resetDemoData: () => void;

  // Products
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, selectedColor: string, selectedSize: string, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, quantity: number) => void;
  updateCartVariant: (cartItemId: string, newColor: string, newSize: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Compare System (Supports up to 4 items)
  compareList: Product[];
  addToCompare: (product: Product) => boolean;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  // Customer & Auth
  user: User | null;
  login: (email: string, role?: 'customer' | 'admin', name?: string) => void;
  logout: () => void;
  addAddress: (address: ShippingAddress) => void;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingNumber'>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Toast
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;

  // PIN delivery estimator
  checkPinCode: (pin: string) => PinDeliveryResult;
  currentPinResult: PinDeliveryResult | null;
  setCurrentPinResult: (res: PinDeliveryResult | null) => void;

  // Modals & UI
  quickViewProduct: Product | null;
  setQuickViewProduct: (prod: Product | null) => void;
  isStylistOpen: boolean;
  setIsStylistOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Recently Viewed
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isStylistOpen, setIsStylistOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>([]);
  const [currentPinResult, setCurrentPinResult] = useState<PinDeliveryResult | null>(null);
  const [user, setUser] = useState<User | null>(defaultUser);
  const [orders, setOrders] = useState<Order[]>(defaultOrders);

  // Load persisted states from localStorage safely on mount
  useEffect(() => {
    try {
      const storedProducts = localStorage.getItem('vestora_products');
      if (storedProducts) {
        const parsed = JSON.parse(storedProducts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProducts(parsed);
        }
      }

      const storedCart = localStorage.getItem('vestora_cart');
      if (storedCart) setCart(JSON.parse(storedCart));

      const storedWishlist = localStorage.getItem('vestora_wishlist');
      if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

      const storedCompare = localStorage.getItem('vestora_compare');
      if (storedCompare) setCompareList(JSON.parse(storedCompare));

      const storedOrders = localStorage.getItem('vestora_orders');
      if (storedOrders) setOrders(JSON.parse(storedOrders));

      const storedUser = localStorage.getItem('vestora_user');
      if (storedUser) setUser(JSON.parse(storedUser));
    } catch {
      // LocalStorage access unavailable or malformed
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save changes to localStorage after hydration
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('vestora_products', JSON.stringify(products));
    } catch { }
  }, [products, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('vestora_cart', JSON.stringify(cart));
    } catch { }
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('vestora_wishlist', JSON.stringify(wishlist));
    } catch { }
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('vestora_compare', JSON.stringify(compareList));
    } catch { }
  }, [compareList, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('vestora_orders', JSON.stringify(orders));
    } catch { }
  }, [orders, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      if (user) {
        localStorage.setItem('vestora_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('vestora_user');
      }
    } catch { }
  }, [user, isHydrated]);

  // Toast system
  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart logic
  const addToCart = (product: Product, selectedColor: string, selectedSize: string, quantity = 1) => {
    const cartItemId = `${product.id}-${selectedColor}-${selectedSize}`;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          product,
          selectedColor,
          selectedSize,
          quantity,
          unitPrice: product.price,
        },
      ];
    });
    showToast(`Added ${product.name} (${selectedSize}) to your shopping bag.`);
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from shopping bag', 'info');
  };

  const updateCartQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === cartItemId ? { ...item, quantity } : item))
    );
  };

  const updateCartVariant = (cartItemId: string, newColor: string, newSize: string) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === cartItemId);
      if (!item) return prev;
      const newId = `${item.productId}-${newColor}-${newSize}`;
      return prev.map((i) =>
        i.id === cartItemId
          ? { ...i, id: newId, selectedColor: newColor, selectedSize: newSize }
          : i
      );
    });
    showToast('Selection updated');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  // Cart financial calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);

  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderAmount) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = Math.round((subtotal * appliedCoupon.discountValue) / 100);
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  // Complimentary shipping over ₹2,999; otherwise ₹250
  const shippingFee = subtotal > 2999 || subtotal === 0 ? 0 : 250;
  const taxableAmount = Math.max(0, subtotal - discount);
  const tax = Math.round(taxableAmount * 0.05); // 5% GST for apparel
  const total = taxableAmount + shippingFee + tax;

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const coupon = mockCoupons.find((c) => c.code === cleanCode && c.isActive);
    if (!coupon) {
      return { success: false, message: 'Invalid or expired promotional code.' };
    }
    if (subtotal < coupon.minOrderAmount) {
      return {
        success: false,
        message: `This code requires a minimum order value of ₹${coupon.minOrderAmount.toLocaleString('en-IN')}.`,
      };
    }
    setAppliedCoupon(coupon);
    showToast(`Code ${coupon.code} applied successfully!`, 'success');
    return { success: true, message: `Promo code applied! Saved ₹${discount}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Wishlist logic
  const toggleWishlist = (productId: string) => {
    const exists = wishlist.includes(productId);
    if (exists) {
      setWishlist((prev) => prev.filter((id) => id !== productId));
      showToast('Removed from your Wishlist', 'info');
    } else {
      setWishlist((prev) => [...prev, productId]);
      showToast('Saved to your Wishlist', 'success');
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Comparison logic (up to 4 items)
  const addToCompare = (product: Product): boolean => {
    if (compareList.some((p) => p.id === product.id)) {
      showToast('Product is already in your comparison table', 'info');
      return true;
    }
    if (compareList.length >= 4) {
      showToast('You can compare a maximum of 4 garments simultaneously.', 'warning');
      return false;
    }
    setCompareList((prev) => [...prev, product]);
    showToast(`Added ${product.name} to compare (${compareList.length + 1}/4)`, 'success');
    return true;
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Removed from comparison list', 'info');
  };

  const clearCompare = () => {
    setCompareList([]);
    showToast('Comparison cleared', 'info');
  };

  const isInCompare = (productId: string) => compareList.some((p) => p.id === productId);

  // Recently viewed
  const addRecentlyViewed = useCallback((product: Product) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 6);
    });
  }, []);

  // Auth & Profile Simulation
  const login = (email: string, role: 'customer' | 'admin' = 'customer', name?: string) => {
    const resolvedName = name || (role === 'admin' ? 'Atelier Director' : email.split('@')[0].toUpperCase());
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: resolvedName,
      email,
      role,
      savedAddresses: [
        {
          fullName: resolvedName,
          phone: '+91 98765 43210',
          email,
          addressLine1: 'Penthouse 12B, The Oberoi Enclave',
          addressLine2: 'Dr. Annie Besant Road, Worli',
          city: 'Mumbai',
          state: 'Maharashtra',
          pinCode: '400018',
          isDefault: true,
        },
      ],
    };
    setUser(newUser);
    showToast(`Signed in to Demo Session as ${resolvedName} (${role === 'admin' ? 'Administrator' : 'Patron'})`, 'success');
  };

  const logout = () => {
    setUser(null);
    showToast('Signed out of Demo Session', 'info');
  };

  const addAddress = (address: ShippingAddress) => {
    if (!user) return;
    setUser({
      ...user,
      savedAddresses: [...user.savedAddresses, address],
    });
    showToast('New shipping address saved', 'success');
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'date' | 'status' | 'trackingNumber'>): Order => {
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${randomCode}`,
      orderNumber: `VST-2026-${randomCode}`,
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'Order Placed',
      trackingNumber: `VST-EXPRESS-${randomCode}`,
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((ord) => (ord.id === orderId ? { ...ord, status } : ord))
    );
    showToast(`Order status updated to "${status}"`, 'success');
  };

  // Product CRUD (Admin Demo)
  const addProduct = (prod: Product) => {
    setProducts((prev) => [prod, ...prev]);
    showToast(`Garment "${prod.name}" published to catalogue`, 'success');
  };

  const updateProduct = (prod: Product) => {
    setProducts((prev) => prev.map((p) => (p.id === prod.id ? prod : p)));
    showToast(`Garment "${prod.name}" specifications updated`, 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Garment archived from catalogue', 'info');
  };

  // Indian PIN code delivery lookup
  const checkPinCode = (pin: string): PinDeliveryResult => {
    const cleanPin = pin.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        pin: cleanPin,
        city: '',
        state: '',
        estimatedDays: 0,
        isDeliverable: false,
        isExpressAvailable: false,
        message: 'Please enter a valid 6-digit Indian PIN code.',
      };
    }

    const prefix2 = cleanPin.substring(0, 2);
    let city = 'Regional Hub';
    let state = 'India';
    let days = 3;
    let express = true;

    if (prefix2 === '11') { city = 'New Delhi'; state = 'Delhi'; days = 1; }
    else if (prefix2 === '40') { city = 'Mumbai'; state = 'Maharashtra'; days = 1; }
    else if (prefix2 === '56') { city = 'Bengaluru'; state = 'Karnataka'; days = 2; }
    else if (prefix2 === '60') { city = 'Chennai'; state = 'Tamil Nadu'; days = 2; }
    else if (prefix2 === '70') { city = 'Kolkata'; state = 'West Bengal'; days = 2; }
    else if (prefix2 === '50') { city = 'Hyderabad'; state = 'Telangana'; days = 2; }
    else if (prefix2 === '38') { city = 'Ahmedabad'; state = 'Gujarat'; days = 2; }
    else if (prefix2 === '30') { city = 'Jaipur'; state = 'Rajasthan'; days = 2; }
    else if (prefix2 === '16') { city = 'Chandigarh'; state = 'Punjab'; days = 2; }
    else { days = 4; express = false; }

    const res: PinDeliveryResult = {
      pin: cleanPin,
      city,
      state,
      estimatedDays: days,
      isDeliverable: true,
      isExpressAvailable: express,
      message: `Delivering to ${city}, ${state}. Estimated arrival in ${days} business ${days === 1 ? 'day' : 'days'}.`,
    };
    setCurrentPinResult(res);
    return res;
  };

  // Demo reset utility
  const resetDemoData = () => {
    try {
      localStorage.removeItem('vestora_cart');
      localStorage.removeItem('vestora_wishlist');
      localStorage.removeItem('vestora_compare');
      localStorage.removeItem('vestora_orders');
      localStorage.removeItem('vestora_products');
      localStorage.removeItem('vestora_user');
    } catch { }

    setCart([]);
    setWishlist([]);
    setCompareList([]);
    setProducts(initialProducts);
    setOrders(defaultOrders);
    setUser(defaultUser);
    setAppliedCoupon(null);
    showToast('Demo data reset to factory state.', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        isHydrated,
        resetDemoData,
        products,
        setProducts,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        updateCartVariant,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        tax,
        total,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isInWishlist,
        compareList,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        user,
        login,
        logout,
        addAddress,
        orders,
        createOrder,
        updateOrderStatus,
        toasts,
        showToast,
        dismissToast,
        checkPinCode,
        currentPinResult,
        setCurrentPinResult,
        quickViewProduct,
        setQuickViewProduct,
        isStylistOpen,
        setIsStylistOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        recentlyViewed,
        addRecentlyViewed,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

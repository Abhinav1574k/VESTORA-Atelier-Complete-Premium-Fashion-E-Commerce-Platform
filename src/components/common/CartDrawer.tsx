'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartDrawer() {
  const {
    cart,
    cartCount,
    removeFromCart,
    updateCartQuantity,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingThreshold = 2999;
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FCFBF9] shadow-2xl flex flex-col justify-between border-l border-vestora-cream">
          {/* Header */}
          <div className="p-6 border-b border-vestora-cream flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-vestora-charcoal" />
              <h2 className="font-serif text-lg font-medium text-vestora-charcoal">
                Shopping Bag ({cartCount})
              </h2>
            </div>
            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 text-vestora-muted hover:text-vestora-charcoal rounded-full hover:bg-vestora-bone transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Banner */}
          <div className="bg-vestora-bone/70 px-6 py-3 border-b border-vestora-cream">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-xs text-vestora-charcoal font-medium">
                Add <span className="font-bold text-vestora-bronze">₹{amountNeededForFreeShipping.toLocaleString('en-IN')}</span> more for complimentary express delivery.
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Congratulations! You have unlocked Complimentary Express Delivery.
              </p>
            )}
            <div className="w-full bg-vestora-cream h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-vestora-bronze h-full transition-all duration-500 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-vestora-bone rounded-full flex items-center justify-center text-vestora-taupe mb-4">
                  <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-lg text-vestora-charcoal font-medium">Your bag is empty</h3>
                <p className="text-xs text-vestora-muted mt-1 max-w-xs leading-relaxed">
                  Explore our curated couture releases crafted from verified natural fibers.
                </p>
                <Link
                  href="/products"
                  onClick={() => setIsCartDrawerOpen(false)}
                  className="mt-6 px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-medium rounded hover:bg-vestora-jet transition"
                >
                  Discover Catalogue
                </Link>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex space-x-4 pb-6 border-b border-vestora-cream last:border-b-0">
                  <div className="w-20 h-26 relative flex-shrink-0 bg-vestora-bone rounded overflow-hidden">
                    <Image
                      src={item.product.variants[0]?.images[0] || 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=600&q=80'}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <Link
                          href={`/products/${item.productId}`}
                          onClick={() => setIsCartDrawerOpen(false)}
                          className="text-xs font-semibold text-vestora-charcoal hover:text-vestora-bronze transition line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-vestora-muted hover:text-red-600 transition p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-[11px] text-vestora-muted mt-0.5">
                        Color: {item.selectedColor} &bull; Size: {item.selectedSize}
                      </p>
                      <p className="text-[10px] text-vestora-bronze font-medium mt-0.5">
                        {item.product.fabric.gsm ? `${item.product.fabric.gsm} GSM &bull; ` : ''}
                        {item.product.fabric.composition.split(',')[0]}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-vestora-cream rounded bg-white">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 px-2 text-vestora-muted hover:text-vestora-charcoal transition"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-medium px-2 text-vestora-charcoal">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 px-2 text-vestora-muted hover:text-vestora-charcoal transition"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-semibold text-vestora-charcoal">
                          ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-vestora-cream bg-white space-y-4">
              {/* Promo Code Input */}
              {appliedCoupon ? (
                <div className="bg-vestora-bone p-2.5 rounded-lg border border-vestora-sand flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-vestora-bronze" />
                    <div>
                      <span className="font-bold text-vestora-charcoal tracking-wider">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 ml-2">(-₹{discount.toLocaleString('en-IN')})</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-red-600 hover:underline font-medium"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Voucher code (e.g. LUXE15)"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    className="flex-1 bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-vestora-charcoal"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-vestora-bone text-vestora-charcoal border border-vestora-sand text-xs font-medium uppercase tracking-wider rounded hover:bg-vestora-cream transition"
                  >
                    Apply
                  </button>
                </form>
              )}
              {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}

              {/* Financial Calculation breakdown */}
              <div className="space-y-1.5 text-xs text-vestora-charcoal font-sans pt-2">
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Promotional Discount</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Express Courier</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Estimated GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold border-t border-vestora-cream pt-2 mt-2">
                  <span>Payable Total</span>
                  <span className="font-serif text-base text-vestora-charcoal">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-[0.2em] rounded flex items-center justify-center gap-2 hover:bg-vestora-jet transition shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-[10px] text-vestora-muted pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-vestora-bronze" />
                <span>256-Bit SSL Encrypted &bull; 15-Day Hassle-Free Returns</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

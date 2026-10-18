'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  ShoppingBag
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    updateCartVariant,
    clearCart,
    subtotal,
    discount,
    shippingFee,
    tax,
    total,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useStore();

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponMsg(null);
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode.trim());
    if (res.success) {
      setCouponMsg({ text: res.message, error: false });
      setCouponCode('');
    } else {
      setCouponMsg({ text: res.message, error: true });
    }
  };

  const freeThreshold = 2999;
  const neededForFree = Math.max(0, freeThreshold - subtotal);
  const freeProgress = Math.min(100, (subtotal / freeThreshold) * 100);

  if (cart.length === 0) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FCFBF9]">
        <div className="w-20 h-20 bg-vestora-bone rounded-full flex items-center justify-center text-vestora-taupe mb-4">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-2xl sm:text-3xl font-medium text-vestora-charcoal">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-vestora-muted mt-2 max-w-sm leading-relaxed">
          Explore our couture releases crafted from certified mulberry silk, Giza cotton, and loopback French terry.
        </p>
        <Link
          href="/products"
          className="mt-6 px-8 py-3 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-vestora-jet transition shadow"
        >
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="border-b border-vestora-cream pb-6 flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Atelier Checkout Bag
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Your Wardrobe Selection ({cart.reduce((a, b) => a + b.quantity, 0)})
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-red-600 hover:underline"
          >
            Clear Entire Bag
          </button>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="p-4 bg-white rounded-xl border border-vestora-cream shadow-sm">
          {neededForFree > 0 ? (
            <p className="text-xs text-vestora-charcoal font-medium">
              Add <span className="font-bold text-vestora-bronze">₹{neededForFree.toLocaleString('en-IN')}</span> more to qualify for complimentary express air courier.
            </p>
          ) : (
            <p className="text-xs text-emerald-800 font-medium flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Complimentary White-Glove Express Shipping Unlocked!
            </p>
          )}
          <div className="w-full bg-vestora-cream h-2 rounded-full mt-2.5 overflow-hidden">
            <div
              className="bg-vestora-bronze h-full transition-all duration-500 rounded-full"
              style={{ width: `${freeProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-vestora-cream shadow-sm overflow-hidden divide-y divide-vestora-cream">
            {cart.map((item) => (
              <div key={item.id} className="p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-24 h-32 relative rounded-lg overflow-hidden bg-vestora-bone flex-shrink-0">
                  <Image
                    src={item.product.variants[0]?.images[0] || ''}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="100px"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-vestora-bronze font-bold">
                          {item.product.brand}
                        </span>
                        <Link
                          href={`/products/${item.productId}`}
                          className="font-serif text-base font-medium text-vestora-charcoal hover:text-vestora-bronze transition block mt-0.5"
                        >
                          {item.product.name}
                        </Link>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-vestora-muted hover:text-red-600 transition p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-vestora-muted mt-1">
                      {item.product.fabric.gsm ? `${item.product.fabric.gsm} GSM &bull; ` : ''}
                      {item.product.fabric.composition}
                    </p>

                    {/* Variant Modifiers on the fly */}
                    <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                      <div>
                        <span className="text-vestora-muted mr-1.5">Color:</span>
                        <select
                          value={item.selectedColor}
                          onChange={(e) => updateCartVariant(item.id, e.target.value, item.selectedSize)}
                          className="bg-vestora-ivory border border-vestora-cream rounded px-2 py-1 text-xs"
                        >
                          {item.product.variants.map((v) => (
                            <option key={v.id} value={v.colorName}>{v.colorName}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <span className="text-vestora-muted mr-1.5">Size:</span>
                        <select
                          value={item.selectedSize}
                          onChange={(e) => updateCartVariant(item.id, item.selectedColor, e.target.value)}
                          className="bg-vestora-ivory border border-vestora-cream rounded px-2 py-1 text-xs font-semibold"
                        >
                          {item.product.variants
                            .find((v) => v.colorName === item.selectedColor)
                            ?.sizes.map((s) => (
                              <option key={s.size} value={s.size} disabled={s.stock === 0}>
                                {s.size} {s.stock === 0 ? '(Out of Stock)' : ''}
                              </option>
                            )) || <option value={item.selectedSize}>{item.selectedSize}</option>}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Total */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-vestora-cream">
                    <div className="flex items-center border border-vestora-cream rounded-lg bg-white">
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 px-3 text-vestora-muted hover:text-vestora-charcoal"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold px-3 text-vestora-charcoal">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 px-3 text-vestora-muted hover:text-vestora-charcoal"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-base font-bold text-vestora-charcoal">
                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                      {item.quantity > 1 && (
                        <span className="text-[10px] text-vestora-muted block">
                          ₹{item.unitPrice.toLocaleString('en-IN')} each
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Financial Breakdown Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium text-vestora-charcoal pb-3 border-b border-vestora-cream">
                Order Financial Summary
              </h3>

              {/* Coupon Code Input */}
              {appliedCoupon ? (
                <div className="bg-vestora-bone p-3 rounded-xl border border-vestora-sand flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-vestora-bronze" />
                    <div>
                      <span className="font-bold text-vestora-charcoal">{appliedCoupon.code}</span>
                      <span className="text-emerald-700 ml-2 font-medium">(-₹{discount.toLocaleString('en-IN')})</span>
                    </div>
                  </div>
                  <button onClick={removeCoupon} className="text-xs text-red-600 hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promotional code (e.g. LUXE15)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-vestora-charcoal"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-vestora-bone text-vestora-charcoal border border-vestora-sand text-xs font-semibold uppercase tracking-wider rounded hover:bg-vestora-cream transition"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMsg && (
                    <p className={`text-[11px] ${couponMsg.error ? 'text-red-600' : 'text-emerald-700'}`}>
                      {couponMsg.text}
                    </p>
                  )}
                </form>
              )}

              {/* Cost Breakdown */}
              <div className="space-y-2 text-xs text-vestora-charcoal pt-2 font-sans">
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Voucher Savings ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Express Courier</span>
                  <span>{shippingFee === 0 ? <strong className="text-emerald-700">COMPLIMENTARY</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Estimated GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-vestora-cream pt-3 mt-3 text-vestora-charcoal">
                  <span>Payable Total</span>
                  <span className="font-serif text-xl">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Proceed CTA */}
              <Link
                href="/checkout"
                className="w-full py-4 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-lg hover:bg-vestora-jet transition shadow-md flex items-center justify-center gap-2 mt-4"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-center text-[10px] text-vestora-muted space-y-1">
                <p>15-Day Bespoke Returns &bull; 100% Verified Fabrics</p>
                <p>We accept UPI, Cards, NetBanking, and Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

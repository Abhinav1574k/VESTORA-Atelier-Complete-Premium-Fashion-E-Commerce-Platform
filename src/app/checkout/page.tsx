'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  Building2,
  Truck,
  Lock,
  Check,
  MapPin,
  Info
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ShippingAddress } from '@/types';

type PaymentMethodType = 'UPI' | 'Card' | 'NetBanking' | 'Cash on Delivery';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    subtotal,
    discount,
    tax,
    total,
    appliedCoupon,
    checkPinCode,
    user,
    createOrder,
    showToast,
  } = useStore();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      router.push('/cart');
    }
  }, [cart, router]);

  // Form states
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Aria De Monte',
    email: user?.email || 'aria.demonte@vestora.com',
    phone: user?.phone || '+91 98765 43210',
    addressLine1: user?.savedAddresses[0]?.addressLine1 || 'Penthouse 12B, The Oberoi Enclave, Worli',
    addressLine2: '',
    city: user?.savedAddresses[0]?.city || 'Mumbai',
    state: user?.savedAddresses[0]?.state || 'Maharashtra',
    pinCode: user?.savedAddresses[0]?.pinCode || '400018',
  });

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('express');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [pinStatus, setPinStatus] = useState<string | null>(null);

  // Card details state for simulation
  const [cardNumber] = useState('4242 •••• •••• 4242');
  const [cardExp] = useState('12/28');
  const [cardCvv] = useState('888');
  const [upiVpa] = useState('aria@oksbi');

  const handlePinChange = (pin: string) => {
    setFormData((prev) => ({ ...prev, pinCode: pin }));
    if (pin.length === 6) {
      const res = checkPinCode(pin);
      if (res.isDeliverable) {
        setFormData((prev) => ({ ...prev, city: res.city, state: res.state }));
        setPinStatus(`Verified: ${res.city}, ${res.state}`);
      } else {
        setPinStatus('Invalid PIN code');
      }
    }
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.addressLine1 || formData.pinCode.length !== 6) {
      showToast('Please provide a complete shipping address and 6-digit PIN code.', 'warning');
      return;
    }

    setIsProcessing(true);

    // Simulated sandbox demo order placement
    setTimeout(() => {
      const address: ShippingAddress = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        city: formData.city,
        state: formData.state,
        pinCode: formData.pinCode,
      };

      const finalShippingFee = shippingMethod === 'express' && subtotal <= 2999 ? 250 : 0;
      const finalTax = Math.round((subtotal - discount) * 0.05);
      const finalTotal = subtotal - discount + finalShippingFee + finalTax;

      const newOrder = createOrder({
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cart,
        shippingAddress: address,
        subtotal,
        discount,
        shippingFee: finalShippingFee,
        tax: finalTax,
        total: finalTotal,
        paymentMethod,
        paymentStatus: paymentMethod === 'Cash on Delivery' ? 'Pending' : 'Paid',
        estimatedDelivery: '3 Business Days',
      });

      setIsProcessing(false);
      showToast('Demo order registered successfully in your local session!', 'success');
      router.push(`/order-success?orderId=${newOrder.id}`);
    }, 1200);
  };

  const paymentOptionTabs: { id: PaymentMethodType; label: string; icon: React.ReactNode }[] = [
    { id: 'UPI', label: 'UPI & QR Code', icon: <QrCode className="w-4 h-4" /> },
    { id: 'Card', label: 'Credit / Debit Card', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'NetBanking', label: 'Net Banking', icon: <Building2 className="w-4 h-4" /> },
    { id: 'Cash on Delivery', label: 'Cash on Delivery', icon: <Truck className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header with Demo Disclaimer */}
        <div className="text-center max-w-xl mx-auto pb-4 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-800 rounded-full text-[11px] font-semibold tracking-wide">
            <Info className="w-3.5 h-3.5" /> College Project Demo Sandbox &bull; No Real Money Deducted
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal">
            Secure Atelier Checkout
          </h1>
          <p className="text-xs text-vestora-muted">
            Demonstration checkout flow using client-side order simulation and local storage persistence.
          </p>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Step 1: Contact & Delivery Address */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vestora-cream shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-vestora-cream">
                <h2 className="font-serif text-lg font-medium text-vestora-charcoal flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-vestora-bronze" /> 1. Shipping Destination
                </h2>
                <span className="text-[11px] text-vestora-bronze font-semibold uppercase tracking-wider">Step 1 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">Phone Number (Indian Mobile) *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">Email Address (Order Confirmation) *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">Street Address, Suite / Apartment *</label>
                  <input
                    type="text"
                    required
                    value={formData.addressLine1}
                    onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">PIN Code (6 digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={(e) => handlePinChange(e.target.value)}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal font-mono"
                  />
                  {pinStatus && (
                    <span className="text-[10px] text-emerald-800 font-medium block mt-1">{pinStatus}</span>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-vestora-charcoal mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Method Selection */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vestora-cream shadow-sm space-y-4">
              <h2 className="font-serif text-lg font-medium text-vestora-charcoal flex items-center gap-2">
                <Truck className="w-5 h-5 text-vestora-bronze" /> 2. Delivery Speed & Transit Options
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <label
                  onClick={() => setShippingMethod('express')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${shippingMethod === 'express'
                      ? 'border-vestora-charcoal bg-vestora-bone'
                      : 'border-vestora-cream hover:bg-vestora-ivory'
                    }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'express'}
                    onChange={() => setShippingMethod('express')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-vestora-charcoal">
                      <span>Express Air Courier</span>
                      {subtotal > 2999 ? (
                        <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                          FREE
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-semibold">₹250</span>
                      )}
                    </div>
                    <p className="text-[11px] text-vestora-muted mt-0.5">
                      1-2 business days with white-glove packaging.
                    </p>
                  </div>
                </label>

                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`p-4 rounded-xl border cursor-pointer transition flex items-start gap-3 ${shippingMethod === 'standard'
                      ? 'border-vestora-charcoal bg-vestora-bone'
                      : 'border-vestora-cream hover:bg-vestora-ivory'
                    }`}
                >
                  <input
                    type="radio"
                    name="shipping"
                    checked={shippingMethod === 'standard'}
                    onChange={() => setShippingMethod('standard')}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="flex items-center gap-2 font-bold text-vestora-charcoal">
                      <span>Standard Ground</span>
                      <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-mono">
                        FREE
                      </span>
                    </div>
                    <p className="text-[11px] text-vestora-muted mt-0.5">
                      3-5 business days via regional courier.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Step 3: Demo Payment Method Simulator */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vestora-cream shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-vestora-cream">
                <h2 className="font-serif text-lg font-medium text-vestora-charcoal flex items-center gap-2">
                  <Lock className="w-5 h-5 text-vestora-bronze" /> 3. Demo Payment Simulation
                </h2>
                <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {paymentOptionTabs.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${paymentMethod === m.id
                        ? 'border-vestora-charcoal bg-vestora-bone text-vestora-charcoal font-semibold shadow-sm'
                        : 'border-vestora-cream text-vestora-muted hover:border-vestora-sand'
                      }`}
                  >
                    {m.icon}
                    <span className="text-center text-[11px]">{m.label}</span>
                  </button>
                ))}
              </div>

              {/* Dynamic Payment Method Panels */}
              <div className="p-4 bg-vestora-ivory rounded-xl border border-vestora-cream text-xs space-y-3">
                {paymentMethod === 'UPI' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-vestora-charcoal">Instant UPI Transfer (PhonePe, GPay, Paytm, BHIM)</p>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-vestora-cream">
                      {/* Simulated QR Code */}
                      <div className="w-28 h-28 bg-white border border-dashed border-vestora-bronze rounded-lg flex flex-col items-center justify-center p-2 text-center flex-shrink-0">
                        <QrCode className="w-16 h-16 text-vestora-charcoal" />
                        <span className="text-[8px] font-mono font-bold text-vestora-bronze mt-1">DEMO QR CODE</span>
                      </div>
                      <div className="space-y-1.5 text-center sm:text-left">
                        <p className="font-medium text-vestora-charcoal">Scan with any Indian UPI app or use Demo VPA:</p>
                        <div className="inline-block font-mono bg-vestora-bone px-3 py-1.5 rounded border border-vestora-sand text-vestora-charcoal font-bold">
                          {upiVpa}
                        </div>
                        <p className="text-[11px] text-vestora-muted">Simulated verification will approve automatically on submit.</p>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'Card' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-vestora-charcoal">Simulated Credit / Debit Card (Visa, Mastercard, RuPay)</p>
                    <div className="space-y-2.5 max-w-md">
                      <div>
                        <label className="block text-[10px] text-vestora-muted uppercase font-bold mb-1">Demo Card Number</label>
                        <input
                          type="text"
                          readOnly
                          value={cardNumber}
                          className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs font-mono"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] text-vestora-muted uppercase font-bold mb-1">Expiry Date</label>
                          <input
                            type="text"
                            readOnly
                            value={cardExp}
                            className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-vestora-muted uppercase font-bold mb-1">CVV</label>
                          <input
                            type="text"
                            readOnly
                            value={cardCvv}
                            className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'NetBanking' && (
                  <div className="space-y-3">
                    <p className="font-semibold text-vestora-charcoal">Select Banking Institution for Demonstration</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((bank) => (
                        <div key={bank} className="p-2.5 bg-white border border-vestora-cream rounded text-center font-medium text-[11px] hover:border-vestora-charcoal cursor-pointer">
                          {bank}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'Cash on Delivery' && (
                  <div className="space-y-2">
                    <p className="font-semibold text-vestora-charcoal">Pay with Cash Upon Delivery</p>
                    <p className="text-vestora-muted leading-relaxed">
                      White-glove courier representative will accept cash or UPI payment directly at your doorstep. Order status will be placed as <span className="font-bold text-amber-800">Pending</span> until receipt.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-vestora-cream shadow-sm space-y-6">
              <h2 className="font-serif text-lg font-medium text-vestora-charcoal pb-3 border-b border-vestora-cream">
                Demo Bag Summary ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>

              {/* Cart Items Preview */}
              <div className="max-h-60 overflow-y-auto divide-y divide-vestora-cream/60 pr-1 space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center gap-3 text-xs">
                    <div className="w-12 h-16 relative rounded bg-vestora-bone overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.variants[0]?.images[0] || ''}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-vestora-charcoal truncate">{item.product.name}</p>
                      <p className="text-[10px] text-vestora-muted">
                        Size: {item.selectedSize} &bull; Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-vestora-charcoal">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation breakdown */}
              <div className="space-y-2 text-xs text-vestora-charcoal font-sans pt-3 border-t border-vestora-cream">
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Voucher ({appliedCoupon?.code})</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-vestora-muted">Courier Fee</span>
                  <span>
                    {shippingMethod === 'express' && subtotal <= 2999 ? '₹250' : <strong className="text-emerald-700">FREE</strong>}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-vestora-muted">GST (5%)</span>
                  <span>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-bold border-t border-vestora-cream pt-3 mt-3 text-vestora-charcoal">
                  <span>Total Payable</span>
                  <span className="font-serif text-2xl text-vestora-charcoal">
                    ₹{total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-lg hover:bg-vestora-jet transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Lock className="w-4 h-4 animate-spin text-vestora-gold" /> Generating Demo Order...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-vestora-gold" /> Complete Demo Order &rarr; ₹{total.toLocaleString('en-IN')}
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-vestora-muted space-y-1 pt-1">
                <p className="flex items-center justify-center gap-1 font-medium text-vestora-charcoal">
                  <ShieldCheck className="w-3.5 h-3.5 text-vestora-bronze" /> BBA College Project Simulation
                </p>
                <p>Order is saved to browser storage for demonstration.</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

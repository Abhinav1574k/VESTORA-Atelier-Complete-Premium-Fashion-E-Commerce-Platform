'use client';

import React, { useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  PackageCheck,
  Truck,
  Printer,
  ArrowRight,
  ShieldCheck,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useStore } from '@/context/StoreContext';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const { orders } = useStore();

  const currentOrder = orders.find((o) => o.id === orderId) || orders[0];

  useEffect(() => {
    // Fire festive confetti animation
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A880', '#1F1F1E', '#DFCFB8', '#141413'],
      });
    } catch { }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (!currentOrder) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FCFBF9]">
        <h2 className="font-serif text-2xl font-medium">Order receipt not found</h2>
        <Link href="/" className="mt-4 text-xs text-vestora-bronze font-bold hover:underline">
          Return to Homepage
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Banner */}
        <div className="bg-white p-8 rounded-3xl border border-vestora-cream shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <span className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Payment Authorized & Confirmed
            </span>
            <h1 className="font-serif text-3xl font-medium text-vestora-charcoal">
              Thank You for Your Patronage
            </h1>
            <p className="text-xs text-vestora-muted max-w-md mx-auto leading-relaxed">
              An atelier invoice and live tracking SMS has been dispatched to{' '}
              <strong className="text-vestora-charcoal">{currentOrder.customerEmail}</strong>.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-vestora-bone px-4 py-2 rounded-full border border-vestora-sand text-xs font-mono font-semibold text-vestora-charcoal">
            <span>Order Reference:</span>
            <span className="text-vestora-bronze">{currentOrder.orderNumber}</span>
          </div>
        </div>

        {/* Live Order Journey Tracking Timeline */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-vestora-cream shadow-sm space-y-6">
          <h2 className="font-serif text-base font-semibold text-vestora-charcoal flex items-center gap-2">
            <Clock className="w-4 h-4 text-vestora-bronze" /> Garment Fulfillment Journey
          </h2>

          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="font-bold text-vestora-charcoal text-[11px]">Confirmed</p>
              <p className="text-[10px] text-vestora-muted">{currentOrder.date}</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-vestora-charcoal text-white flex items-center justify-center mx-auto">
                <PackageCheck className="w-4 h-4" />
              </div>
              <p className="font-bold text-vestora-charcoal text-[11px]">Atelier Prep</p>
              <p className="text-[10px] text-vestora-muted">Quality Steaming</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-vestora-bone text-vestora-taupe border border-vestora-sand flex items-center justify-center mx-auto">
                <Truck className="w-4 h-4" />
              </div>
              <p className="font-medium text-vestora-muted text-[11px]">Air Dispatch</p>
              <p className="text-[10px] text-vestora-muted">In 24 Hours</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-vestora-bone text-vestora-taupe border border-vestora-sand flex items-center justify-center mx-auto">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="font-medium text-vestora-muted text-[11px]">Doorstep</p>
              <p className="text-[10px] text-vestora-muted">{currentOrder.estimatedDelivery}</p>
            </div>
          </div>
        </div>

        {/* Printable Itemized Invoice Receipt */}
        <div id="printable-receipt" className="bg-white p-6 sm:p-8 rounded-3xl border border-vestora-cream shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-vestora-cream">
            <div>
              <span className="font-cinzel text-xl font-medium tracking-[0.2em] text-vestora-charcoal">VESTORA</span>
              <p className="text-[10px] text-vestora-muted uppercase tracking-wider">Atelier Tax Invoice &bull; GSTIN 27AAACV4920M1ZX</p>
            </div>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 border border-vestora-cream rounded text-xs font-medium text-vestora-charcoal hover:bg-vestora-bone transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" /> Print Receipt
            </button>
          </div>

          {/* Delivery & Billing Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10px] uppercase font-bold text-vestora-muted tracking-wider">Shipping Address:</p>
              <p className="font-semibold text-vestora-charcoal mt-1">{currentOrder.shippingAddress.fullName}</p>
              <p className="text-vestora-muted">{currentOrder.shippingAddress.addressLine1}</p>
              <p className="text-vestora-muted">
                {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} - {currentOrder.shippingAddress.pinCode}
              </p>
              <p className="text-vestora-muted">Phone: {currentOrder.shippingAddress.phone}</p>
            </div>

            <div>
              <p className="text-[10px] uppercase font-bold text-vestora-muted tracking-wider">Payment Details:</p>
              <p className="font-semibold text-vestora-charcoal mt-1">Method: {currentOrder.paymentMethod}</p>
              <p className="text-emerald-700 font-medium">Status: {currentOrder.paymentStatus} (Sandbox Verified)</p>
              <p className="text-vestora-muted">Airway Bill / Tracking: {currentOrder.trackingNumber}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="border border-vestora-cream rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs divide-y divide-vestora-cream">
              <thead className="bg-vestora-bone text-vestora-charcoal uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-4 font-semibold">Garment Item</th>
                  <th className="py-2.5 px-4 font-semibold">Variant</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Qty</th>
                  <th className="py-2.5 px-4 font-semibold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-vestora-cream">
                {currentOrder.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-medium text-vestora-charcoal">{item.product.name}</td>
                    <td className="py-3 px-4 text-vestora-muted">{item.selectedColor} / {item.selectedSize}</td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-xs text-vestora-charcoal font-sans pt-2 max-w-xs ml-auto">
            <div className="flex justify-between">
              <span className="text-vestora-muted">Subtotal:</span>
              <span>₹{currentOrder.subtotal.toLocaleString('en-IN')}</span>
            </div>
            {currentOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-700">
                <span>Voucher Discount:</span>
                <span>-₹{currentOrder.discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-vestora-muted">Express Courier:</span>
              <span>{currentOrder.shippingFee === 0 ? 'FREE' : `₹${currentOrder.shippingFee}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vestora-muted">GST (5%):</span>
              <span>₹{currentOrder.tax.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between font-bold text-sm border-t border-vestora-cream pt-2 mt-2">
              <span>Total Paid:</span>
              <span className="font-serif text-lg">₹{currentOrder.total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <Link
            href="/account"
            className="w-full sm:w-auto px-6 py-3 border border-vestora-cream bg-white text-vestora-charcoal rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-vestora-bone transition text-center"
          >
            Manage Order in Account
          </Link>

          <Link
            href="/products"
            className="w-full sm:w-auto px-8 py-3 bg-vestora-charcoal text-white rounded-lg text-xs uppercase tracking-widest font-semibold hover:bg-vestora-jet transition shadow text-center flex items-center justify-center gap-2"
          >
            Continue Browsing Archive <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-vestora-muted">Generating invoice...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, RefreshCw, Truck, Award } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Footer() {
  const { showToast } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'warning');
      return;
    }
    setSubscribed(true);
    showToast('Welcome to the Vestora Circle. Enjoy 15% off with code LUXE15.', 'success');
  };

  return (
    <footer className="bg-[#141413] text-[#E5E0D8] pt-16 pb-12 border-t border-[#262422]">
      {/* Brand Value Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#2A2825]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#1F1E1B] rounded-full text-vestora-gold border border-[#33302B]">
              <Truck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-medium tracking-wide text-white">White-Glove Delivery</h4>
              <p className="text-xs text-[#9E988F] mt-1 leading-relaxed">
                Complimentary express air courier on orders over ₹2,999 across India.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#1F1E1B] rounded-full text-vestora-gold border border-[#33302B]">
              <Shield className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-medium tracking-wide text-white">100% Verified Fabrics</h4>
              <p className="text-xs text-[#9E988F] mt-1 leading-relaxed">
                Grade-6A Mulberry silk, GOTS organic cotton, and certified European flax.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#1F1E1B] rounded-full text-vestora-gold border border-[#33302B]">
              <RefreshCw className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-medium tracking-wide text-white">15-Day Bespoke Returns</h4>
              <p className="text-xs text-[#9E988F] mt-1 leading-relaxed">
                Hassle-free reverse pick-up and instant exchange or full refund policy.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="p-3 bg-[#1F1E1B] rounded-full text-vestora-gold border border-[#33302B]">
              <Award className="w-5 h-5 stroke-[1.5]" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-medium tracking-wide text-white">Atelier Craftsmanship</h4>
              <p className="text-xs text-[#9E988F] mt-1 leading-relaxed">
                Precision single-needle tailoring, handloom kadhwa zari, and horn buttons.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-5">
            <Link href="/" className="inline-block">
              <span className="font-cinzel text-2xl tracking-[0.3em] font-medium text-white">VESTORA</span>
              <span className="block text-[8px] tracking-[0.45em] uppercase text-vestora-gold -mt-1 font-sans">
                Atelier &bull; High Couture
              </span>
            </Link>
            <p className="text-xs text-[#A8A298] leading-relaxed max-w-sm">
              Vestora is an artisanal fashion house dedicated to timeless silhouettes, honest material specifications, and peerless garment construction.
            </p>
            <div className="pt-2 text-xs text-[#8A847A]">
              <p className="font-medium text-[#C8C2B7]">Atelier Headquarters:</p>
              <p>402 Nariman Point, Marine Drive</p>
              <p>Mumbai, Maharashtra 400021, India</p>
              <p className="mt-1">concierge@vestora.com &bull; +91 (022) 8920 4400</p>
            </div>
          </div>

          {/* Quick Links 1: Collections */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-serif text-sm tracking-widest uppercase text-white font-medium">Collections</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A298]">
              <li><Link href="/products?gender=Women" className="hover:text-vestora-gold transition">Women&apos;s Couture</Link></li>
              <li><Link href="/products?gender=Men" className="hover:text-vestora-gold transition">Men&apos;s Sartorial</Link></li>
              <li><Link href="/products?category=Ethnic+Wear" className="hover:text-vestora-gold transition">Handloom Ethnic Wear</Link></li>
              <li><Link href="/products?category=Jackets" className="hover:text-vestora-gold transition">Cashmere & Wool Outerwear</Link></li>
              <li><Link href="/products?category=T-Shirts" className="hover:text-vestora-gold transition">Supima Basics</Link></li>
              <li><Link href="/products?category=Jeans" className="hover:text-vestora-gold transition">Okayama Selvedge Denim</Link></li>
            </ul>
          </div>

          {/* Quick Links 2: Customer Care */}
          <div className="lg:col-span-2 space-y-4">
            <h5 className="font-serif text-sm tracking-widest uppercase text-white font-medium">Concierge</h5>
            <ul className="space-y-2.5 text-xs text-[#A8A298]">
              <li><Link href="/account" className="hover:text-vestora-gold transition">Order Tracking & History</Link></li>
              <li><Link href="/compare" className="hover:text-vestora-gold transition">Fabric & Spec Comparison</Link></li>
              <li><Link href="/account" className="hover:text-vestora-gold transition">Initiate 15-Day Return</Link></li>
              <li><Link href="/admin" className="hover:text-vestora-gold transition">Store Administration</Link></li>
              <li><a href="#pin-checker" className="hover:text-vestora-gold transition">PIN Code Delivery Check</a></li>
              <li><Link href="/account" className="hover:text-vestora-gold transition">Size Consultation Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-4 space-y-4 bg-[#1B1A18] p-6 rounded-xl border border-[#2D2A26]">
            <h5 className="font-serif text-base text-white font-medium">The Vestora Journal</h5>
            <p className="text-xs text-[#A8A298] leading-relaxed">
              Subscribe to receive private invitations to runway previews, seasonal fabric releases, and an immediate 15% promotional voucher.
            </p>

            {subscribed ? (
              <div className="bg-[#242A22] border border-[#3E523A] text-[#86EFAC] p-3 rounded text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>You are subscribed. Use code <strong>LUXE15</strong> at checkout!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email address..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-[#121211] border border-[#3A3732] rounded px-3.5 py-2.5 text-xs text-white placeholder-[#706B62] focus:outline-none focus:border-vestora-gold transition"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-vestora-gold text-vestora-jet text-[11px] font-semibold uppercase tracking-wider rounded hover:bg-[#d8b992] transition flex items-center gap-1"
                  >
                    Join <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-[#706B62]">
                  We honor your privacy. Unsubscribe anytime with one click.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Payment Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#262422] flex flex-col md:flex-row items-center justify-between text-xs text-[#7A756D] gap-4">
        <div>
          &copy; {new Date().getFullYear()} VESTORA Atelier Private Limited. All rights reserved.
        </div>

        {/* Payment Methods */}
        <div className="flex items-center space-x-3 text-[10px] uppercase tracking-wider text-[#A39D93]">
          <span className="px-2 py-0.5 border border-[#33302B] rounded">UPI &bull; GPay &bull; PhonePe</span>
          <span className="px-2 py-0.5 border border-[#33302B] rounded">RuPay &bull; Visa &bull; Mastercard</span>
          <span className="px-2 py-0.5 border border-[#33302B] rounded">NetBanking</span>
          <span className="px-2 py-0.5 border border-[#33302B] rounded">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
}

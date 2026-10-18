'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Feather,
  Check,
  Star,
  ChevronRight,
  MapPin,
  TrendingUp,
  Percent
} from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { useStore } from '@/context/StoreContext';
import { mockReviews } from '@/data/products';

export default function HomePage() {
  const { products, checkPinCode, currentPinResult, setIsStylistOpen } = useStore();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const trendingProducts = products.filter((p) => p.isTrending || p.isBestseller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival || p.isSustainable).slice(0, 4);
  const discountedEdits = products.filter((p) => p.discountPercentage >= 25).slice(0, 4);

  const categories = [
    {
      name: "Women's Couture",
      sub: "Pure Mulberry Silk & French Seams",
      href: "/products?gender=Women",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Men's Sartorial",
      sub: "120s Egyptian Cotton & Vitale Barberis Wool",
      href: "/products?gender=Men",
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Heritage Ethnic Wear",
      sub: "Varanasi Katan Silk & Artisanal Zari",
      href: "/products?category=Ethnic+Wear",
      image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Luxury Outerwear",
      sub: "Double-Faced Cashmere & Trench Silhouettes",
      href: "/products?category=Jackets",
      image: "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Vintage Okayama Denim",
      sub: "14oz Shuttle Loom Pink Selvedge",
      href: "/products?category=Jeans",
      image: "https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Heavyweight Basics",
      sub: "480 GSM Loopback & 220 GSM Supima",
      href: "/products?category=T-Shirts",
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    if (!pinInput.trim()) return;
    const res = checkPinCode(pinInput.trim());
    if (!res.isDeliverable) {
      setPinError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* 1. HERO CAMPAIGN SECTION */}
      <section className="relative h-[88vh] min-h-[620px] w-full overflow-hidden bg-vestora-jet">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=2000&q=85"
            alt="Vestora Haute Couture 2026 Campaign"
            fill
            priority
            className="object-cover object-top opacity-75"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-vestora-jet via-vestora-jet/40 to-transparent" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60" />
        </div>

        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-20 sm:pb-24">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-vestora-bone text-xs uppercase tracking-[0.25em] font-sans">
              <Sparkles className="w-3.5 h-3.5 text-vestora-gold" />
              <span>Autumn / Winter Haute Couture 2026</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-normal text-white tracking-tight leading-[1.08]">
              Elegance Woven in Every Thread.
            </h1>

            <p className="text-sm sm:text-base text-vestora-bone/90 max-w-xl font-sans font-light leading-relaxed">
              Quiet luxury tailored from verified 22-Momme Mulberry Silk, 120s Giza Cotton, and Super 130s Merino Wool. Honest GSM transparency with zero synthetic fleece.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/products"
                className="px-8 py-3.5 bg-vestora-bone text-vestora-jet text-xs font-semibold uppercase tracking-[0.2em] rounded hover:bg-white transition shadow-lg flex items-center gap-2"
              >
                Shop The Collection <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setIsStylistOpen(true)}
                className="px-6 py-3.5 bg-white/10 backdrop-blur-md text-white border border-white/30 text-xs font-medium uppercase tracking-[0.2em] rounded hover:bg-white/20 transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-vestora-gold" /> Consult AI Stylist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. LIVE PIN CODE DELIVERY ESTIMATOR STRIP */}
      <section id="pin-checker" className="border-y border-vestora-cream bg-white py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-vestora-bone flex items-center justify-center text-vestora-bronze flex-shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-vestora-charcoal uppercase tracking-wider">
                Instant Delivery Estimator (Pan-India)
              </p>
              <p className="text-[11px] text-vestora-muted">
                Check express delivery eligibility and courier timelines for your pincode.
              </p>
            </div>
          </div>

          <form onSubmit={handlePinSubmit} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Enter 6-Digit PIN (e.g. 400018)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength={6}
              className="px-4 py-2 text-xs bg-vestora-ivory border border-vestora-cream rounded focus:outline-none focus:border-vestora-charcoal w-full sm:w-60"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-vestora-charcoal text-white text-xs uppercase tracking-wider font-medium rounded hover:bg-vestora-jet transition flex-shrink-0"
            >
              Verify
            </button>
          </form>
        </div>

        {currentPinResult && (
          <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-vestora-cream text-xs text-emerald-800 font-medium flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{currentPinResult.message}</span>
            {currentPinResult.isExpressAvailable && (
              <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Express Air Eligible
              </span>
            )}
          </div>
        )}
        {pinError && (
          <div className="max-w-7xl mx-auto mt-2 text-xs text-red-600">
            {pinError}
          </div>
        )}
      </section>

      {/* 3. CATEGORY SHOWCASE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Curated Wardrobe Pillars
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Explore By Category
            </h2>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-vestora-charcoal font-semibold hover:text-vestora-bronze transition inline-flex items-center gap-1.5"
          >
            View Complete Catalogue <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              href={cat.href}
              className="group relative h-96 rounded-2xl overflow-hidden bg-vestora-bone shadow-sm flex flex-col justify-end p-6 border border-vestora-cream"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vestora-jet/90 via-vestora-jet/30 to-transparent" />

              <div className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
                <p className="text-[11px] uppercase tracking-wider text-vestora-goldLight font-medium">
                  {cat.sub}
                </p>
                <h3 className="font-serif text-2xl font-medium text-white mt-1">
                  {cat.name}
                </h3>
                <span className="inline-flex items-center gap-1 text-xs text-white uppercase tracking-widest font-semibold mt-3 group-hover:text-vestora-gold transition">
                  Discover Collection <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS & BESTSELLERS */}
      <section className="bg-vestora-bone/40 py-16 sm:py-24 border-y border-vestora-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-vestora-bronze font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Atelier Favorites</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
                Trending & Bestsellers
              </h2>
            </div>
            <Link
              href="/products?sort=popularity"
              className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-vestora-charcoal font-semibold hover:text-vestora-bronze transition inline-flex items-center gap-1.5"
            >
              View All Popular &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. VERIFIED FABRIC SPOTLIGHT & SUSTAINABILITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="bg-vestora-charcoal text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative border border-vestora-slate/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-vestora-gold text-xs uppercase tracking-widest">
                <Feather className="w-4 h-4" /> The Fabric Manifesto
              </div>

              <h2 className="font-serif text-3xl sm:text-5xl font-normal leading-tight">
                Authentic Fibers. <br /> Honest GSM Transparency.
              </h2>

              <p className="text-xs sm:text-sm text-vestora-taupe leading-relaxed">
                Most e-commerce labels disguise polyester under fancy names and conceal fabric weights. At Vestora, every garment publishes its verified grams-per-square-meter (GSM), yarn gauge count, and certified mill of origin.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/10 text-xs">
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-vestora-gold">22 Momme</p>
                  <p className="text-white font-medium mt-1">Grade-6A Silk</p>
                  <p className="text-[11px] text-vestora-taupe mt-0.5">Woven on Italian looms in Como</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-vestora-gold">480 GSM</p>
                  <p className="text-white font-medium mt-1">French Terry Cotton</p>
                  <p className="text-[11px] text-vestora-taupe mt-0.5">Unbrushed loopback, zero polyester</p>
                </div>
                <div>
                  <p className="font-serif text-xl sm:text-2xl font-bold text-vestora-gold">14 oz</p>
                  <p className="text-white font-medium mt-1">Okayama Selvedge</p>
                  <p className="text-[11px] text-vestora-taupe mt-0.5">Woven on vintage Toyoda shuttle looms</p>
                </div>
              </div>

              <div className="pt-4 flex flex-wrap gap-4">
                <Link
                  href="/products?sustainable=true"
                  className="px-6 py-3 bg-vestora-gold text-vestora-jet text-xs font-semibold uppercase tracking-widest rounded hover:bg-[#d8b992] transition flex items-center gap-2"
                >
                  Explore Certified Sustainable Edits <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/compare"
                  className="px-6 py-3 border border-white/30 text-white text-xs font-semibold uppercase tracking-widest rounded hover:bg-white/10 transition"
                >
                  Compare Fabric Specs
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 relative aspect-[4/5] rounded-2xl overflow-hidden bg-vestora-jet shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=1200&q=80"
                alt="Vestora Fabric Craftsmanship"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEW ARRIVALS & SEASONAL DROPS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Fresh Off The Atelier Loom
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              New Seasonal Arrivals
            </h2>
          </div>
          <Link
            href="/products?sort=newest"
            className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-vestora-charcoal font-semibold hover:text-vestora-bronze transition inline-flex items-center gap-1.5"
          >
            Explore All New Releases &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. SPECIAL OFFERS & LIMITED-TIME DISCOUNTS */}
      <section className="bg-[#FAF7F2] py-16 sm:py-24 border-y border-vestora-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#B45339] font-semibold">
                <Percent className="w-4 h-4" />
                <span>Privileged Wardrobe Opportunities</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
                Seasonal Reductions (Up to 38% Off)
              </h2>
            </div>
            <Link
              href="/products?discount=20"
              className="mt-4 md:mt-0 text-xs uppercase tracking-widest text-vestora-charcoal font-semibold hover:text-vestora-bronze transition inline-flex items-center gap-1.5"
            >
              Shop All Sale &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedEdits.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 8. EDITORIAL TESTIMONIALS & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center max-w-xl mx-auto mb-14">
          <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
            Atelier Client Experiences
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
            Voices of Discerning Patrons
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {mockReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-white p-8 rounded-2xl border border-vestora-cream shadow-sm flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <h3 className="font-serif text-base font-semibold text-vestora-charcoal">
                  &ldquo;{rev.title}&rdquo;
                </h3>
                <p className="text-xs text-vestora-muted leading-relaxed">
                  {rev.comment}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-vestora-cream flex items-center justify-between text-xs">
                <div>
                  <p className="font-semibold text-vestora-charcoal">{rev.userName}</p>
                  <p className="text-[11px] text-vestora-muted">{rev.userLocation}</p>
                </div>
                {rev.verifiedPurchase && (
                  <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Verified Buyer
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

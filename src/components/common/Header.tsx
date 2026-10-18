'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Scale,
  Search,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function Header() {
  const router = useRouter();
  const {
    cartCount,
    wishlist,
    compareList,
    user,
    logout,
    setIsCartDrawerOpen,
    setIsStylistOpen,
    products
  } = useStore();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [currentAnnouncementIndex, setCurrentAnnouncementIndex] = useState(0);

  const announcements = [
    'Complimentary White-Glove Express Shipping on Orders Above ₹2,999',
    'Haute Autumn/Winter Couture Collection Now Live — Explore Verified Fabrics',
    'Experience Pure 22-Momme Mulberry Silk & Super 130s Merino Wool',
    'Use Code "LUXE15" for 15% Off Your Curated Wardrobe',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncementIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter products for search autocomplete
  const searchResults = searchQuery.trim()
    ? products
      .filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.gender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.fabric.composition.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-vestora-jet text-vestora-bone text-xs font-medium py-2 px-4 transition-all duration-500 overflow-hidden text-center relative border-b border-white/10 tracking-wider">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden md:flex items-center space-x-4 text-[11px] uppercase tracking-widest text-vestora-taupe">
            <span>Mumbai &bull; Paris &bull; Como</span>
            <span className="flex items-center gap-1 text-vestora-gold">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Fabrics
            </span>
          </div>

          <div className="flex-1 text-center truncate px-2 font-sans transition-opacity duration-700">
            {announcements[currentAnnouncementIndex]}
          </div>

          <div className="hidden md:flex items-center space-x-3 text-[11px] uppercase tracking-widest text-vestora-taupe">
            <button
              onClick={() => setIsStylistOpen(true)}
              className="hover:text-white transition flex items-center gap-1 text-vestora-gold"
            >
              <Sparkles className="w-3 h-3 text-vestora-gold" /> AI Stylist
            </button>
            <span>&bull;</span>
            <Link href="/admin" className="hover:text-white transition">Admin Portal</Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled
            ? 'bg-[#FCFBF9]/95 backdrop-blur-md shadow-sm border-b border-vestora-cream py-3'
            : 'bg-[#FCFBF9] border-b border-vestora-cream/60 py-4'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile hamburger & Desktop primary links */}
            <div className="flex items-center space-x-8">
              <button
                type="button"
                className="lg:hidden p-2 text-vestora-charcoal hover:text-vestora-gold focus:outline-none"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              <nav className="hidden lg:flex items-center space-x-7 text-xs uppercase tracking-widest font-medium text-vestora-charcoal">
                <Link href="/products?gender=Women" className="hover:text-vestora-bronze transition py-1">
                  Women
                </Link>
                <Link href="/products?gender=Men" className="hover:text-vestora-bronze transition py-1">
                  Men
                </Link>
                <Link href="/products?category=Ethnic+Wear" className="hover:text-vestora-bronze transition py-1">
                  Ethnic Wear
                </Link>
                <Link href="/products?category=Jackets" className="hover:text-vestora-bronze transition py-1">
                  Couture Outerwear
                </Link>
                <Link href="/products?sustainable=true" className="hover:text-vestora-bronze transition py-1 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 inline-block"></span>
                  Sustainable
                </Link>
                <Link href="/compare" className="hover:text-vestora-bronze transition py-1 flex items-center gap-1.5 text-vestora-bronze font-semibold">
                  <Scale className="w-3.5 h-3.5" />
                  Compare
                  {compareList.length > 0 && (
                    <span className="bg-vestora-charcoal text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                      {compareList.length}
                    </span>
                  )}
                </Link>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div className="text-center">
              <Link href="/" className="inline-block group">
                <span className="font-cinzel text-2xl sm:text-3xl font-medium tracking-[0.28em] text-vestora-charcoal uppercase group-hover:text-vestora-bronze transition-colors">
                  VESTORA
                </span>
                <span className="block text-[8px] tracking-[0.4em] uppercase text-vestora-muted -mt-1 font-sans">
                  Atelier &bull; Est. 2026
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4 sm:space-x-5 text-vestora-charcoal">
              {/* Search Toggle */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-1.5 hover:text-vestora-bronze transition text-vestora-charcoal"
                aria-label="Search"
              >
                <Search className="w-5 h-5 stroke-[1.5]" />
              </button>

              {/* AI Concierge / Stylist */}
              <button
                onClick={() => setIsStylistOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1 text-xs uppercase tracking-wider font-medium border border-vestora-gold/50 rounded-full hover:bg-vestora-bone transition text-vestora-charcoal"
                title="Ask AI Stylist"
              >
                <Sparkles className="w-3.5 h-3.5 text-vestora-bronze" />
                <span className="text-[11px]">Stylist</span>
              </button>

              {/* Wishlist */}
              <Link
                href="/account?tab=wishlist"
                className="p-1.5 hover:text-vestora-bronze transition relative hidden sm:block"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5 stroke-[1.5]" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-vestora-bronze text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-sans">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="p-1.5 hover:text-vestora-bronze transition flex items-center"
                  aria-label="User account"
                >
                  <UserIcon className="w-5 h-5 stroke-[1.5]" />
                </button>

                {accountMenuOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white shadow-card rounded-md border border-vestora-cream py-2 z-50 text-xs font-sans"
                    onMouseLeave={() => setAccountMenuOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-vestora-cream">
                          <p className="text-[10px] uppercase tracking-wider text-vestora-muted">Signed in as</p>
                          <p className="font-medium text-vestora-charcoal truncate">{user.name}</p>
                          <p className="text-vestora-muted truncate">{user.email}</p>
                        </div>
                        <Link
                          href="/account"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-vestora-charcoal hover:bg-vestora-bone transition"
                        >
                          Customer Dashboard & Orders
                        </Link>
                        <Link
                          href="/compare"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-vestora-charcoal hover:bg-vestora-bone transition"
                        >
                          Product Comparison ({compareList.length})
                        </Link>
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-vestora-charcoal hover:bg-vestora-bone transition font-medium text-vestora-bronze"
                        >
                          Store Owner Admin Panel
                        </Link>
                        <div className="border-t border-vestora-cream mt-1 pt-1">
                          <button
                            onClick={() => {
                              logout();
                              setAccountMenuOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                          >
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-3 text-center border-b border-vestora-cream">
                          <p className="font-serif text-sm font-medium mb-1">Welcome to Vestora</p>
                          <p className="text-[11px] text-vestora-muted mb-2">Access your bespoke wardrobe & order history</p>
                          <Link
                            href="/account"
                            onClick={() => setAccountMenuOpen(false)}
                            className="block w-full py-1.5 bg-vestora-charcoal text-white uppercase text-[10px] tracking-widest font-medium rounded hover:bg-vestora-jet transition"
                          >
                            Sign In / Register
                          </Link>
                        </div>
                        <Link
                          href="/admin"
                          onClick={() => setAccountMenuOpen(false)}
                          className="block px-4 py-2 text-vestora-charcoal hover:bg-vestora-bone transition text-[11px]"
                        >
                          Administrator Access &rarr;
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Shopping Bag */}
              <button
                onClick={() => setIsCartDrawerOpen(true)}
                className="p-1.5 hover:text-vestora-bronze transition relative flex items-center gap-1.5"
                aria-label="Shopping bag"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-vestora-charcoal text-white text-[10px] font-sans font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Live Search Drawer / Modal Bar */}
        {searchOpen && (
          <div className="border-t border-vestora-cream bg-white py-4 px-4 sm:px-6 transition-all duration-300">
            <div className="max-w-3xl mx-auto">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-5 h-5 text-vestora-muted absolute left-3" />
                <input
                  type="text"
                  placeholder="Search pure silk dresses, Giza cotton shirts, 14oz raw selvedge denim, GSM..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-24 py-2.5 text-sm bg-vestora-ivory border border-vestora-cream rounded-full focus:outline-none focus:border-vestora-charcoal transition"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-1.5 bg-vestora-charcoal text-white text-xs uppercase tracking-wider rounded-full hover:bg-vestora-jet transition"
                >
                  Search
                </button>
              </form>

              {/* Live search autocomplete dropdown */}
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white border border-vestora-cream rounded-xl shadow-lg p-3 divide-y divide-vestora-cream">
                  <div className="text-[10px] uppercase tracking-widest text-vestora-muted pb-1 px-2 font-medium">
                    Garment Suggestions ({searchResults.length})
                  </div>
                  {searchResults.map((prod) => (
                    <Link
                      key={prod.id}
                      href={`/products/${prod.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 py-2 px-2 hover:bg-vestora-ivory rounded transition"
                    >
                      <div className="w-12 h-14 relative flex-shrink-0 bg-vestora-bone rounded overflow-hidden">
                        <Image
                          src={prod.variants[0].images[0]}
                          alt={prod.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-vestora-charcoal truncate">{prod.name}</p>
                        <p className="text-[11px] text-vestora-muted truncate">{prod.fabric.composition}</p>
                        <p className="text-xs font-semibold text-vestora-charcoal mt-0.5">₹{prod.price.toLocaleString('en-IN')}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-vestora-muted" />
                    </Link>
                  ))}
                  <div className="pt-2 text-center">
                    <button
                      onClick={handleSearchSubmit}
                      className="text-xs text-vestora-bronze font-medium hover:underline"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo; &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-[#FCFBF9] h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-vestora-cream">
                <span className="font-cinzel text-xl tracking-[0.25em] font-medium">VESTORA</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <X className="w-6 h-6 text-vestora-charcoal" />
                </button>
              </div>

              <div className="py-6 space-y-4 text-sm uppercase tracking-wider font-medium text-vestora-charcoal">
                <Link
                  href="/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  All Garments
                </Link>
                <Link
                  href="/products?gender=Women"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  Women&apos;s Couture
                </Link>
                <Link
                  href="/products?gender=Men"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  Men&apos;s Sartorial
                </Link>
                <Link
                  href="/products?category=Ethnic+Wear"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  Royal Ethnic Wear
                </Link>
                <Link
                  href="/products?category=Jackets"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  Outerwear & Coats
                </Link>
                <Link
                  href="/compare"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-2 text-vestora-bronze font-semibold"
                >
                  <span>Compare Garments</span>
                  {compareList.length > 0 && (
                    <span className="bg-vestora-charcoal text-white text-xs px-2 py-0.5 rounded-full">
                      {compareList.length}/4
                    </span>
                  )}
                </Link>
                <Link
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 hover:text-vestora-bronze"
                >
                  My Account & Orders
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-vestora-muted hover:text-vestora-charcoal"
                >
                  Admin Control Panel
                </Link>
              </div>
            </div>

            <div className="pt-6 border-t border-vestora-cream">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsStylistOpen(true);
                }}
                className="w-full py-2.5 bg-vestora-charcoal text-white rounded text-xs uppercase tracking-widest flex items-center justify-center gap-2 mb-3"
              >
                <Sparkles className="w-4 h-4 text-vestora-gold" /> Consult AI Stylist
              </button>
              <p className="text-[10px] text-center text-vestora-muted">
                100% Certified Fabrics &bull; Complimentary Shipping in India
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

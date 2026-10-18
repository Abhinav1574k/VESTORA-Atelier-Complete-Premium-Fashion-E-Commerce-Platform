'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Star,
  Heart,
  Scale,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Ruler,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Award,
  PackageCheck,
  Plus,
  Minus
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import SizeGuideModal from '@/components/common/SizeGuideModal';
import { Review } from '@/types';
import { mockReviews } from '@/data/products';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const {
    products,
    addToCart,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
    checkPinCode,
    currentPinResult,
    showToast,
    addRecentlyViewed,
    recentlyViewed,
  } = useStore();

  const product = products.find((p) => p.id === productId);

  // States
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [quantity, setQuantity] = useState(1);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [reviewsList, setReviewsList] = useState<Review[]>(mockReviews);

  // New review form
  const [reviewFormOpen, setReviewFormOpen] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');

  // Accordion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    fabric: true,
    fit: true,
    craftsmanship: true,
    care: false,
    shipping: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  useEffect(() => {
    if (product) {
      addRecentlyViewed(product);
      // Select first available size
      const defaultVariant = product.variants[0];
      if (defaultVariant) {
        const inStock = defaultVariant.sizes.find((s) => s.stock > 0)?.size || 'M';
        setSelectedSize(inStock);
      }
    }
  }, [product, addRecentlyViewed]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#FCFBF9]">
        <h2 className="font-serif text-2xl font-medium text-vestora-charcoal">Garment not found</h2>
        <p className="text-xs text-vestora-muted mt-2 max-w-sm">
          The requested garment might have been archived or removed from the active collection.
        </p>
        <Link
          href="/products"
          className="mt-6 px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded"
        >
          Return to Archive
        </Link>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariantIndex] || product.variants[0];
  const images = currentVariant.images;
  const isCompared = isInCompare(product.id);
  const isWishlisted = isInWishlist(product.id);

  const selectedSizeStock = currentVariant.sizes.find((s) => s.size === selectedSize)?.stock || 0;

  const handleAddToCart = () => {
    if (selectedSizeStock === 0) {
      showToast('Selected size is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, currentVariant.colorName, selectedSize, quantity);
  };

  const handleBuyNow = () => {
    if (selectedSizeStock === 0) {
      showToast('Selected size is currently out of stock.', 'warning');
      return;
    }
    addToCart(product, currentVariant.colorName, selectedSize, quantity);
    router.push('/checkout');
  };

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    if (!pincodeInput.trim()) return;
    const res = checkPinCode(pincodeInput.trim());
    if (!res.isDeliverable) {
      setPincodeError(res.message);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      userName: newReviewAuthor,
      userLocation: 'Mumbai, MH',
      rating: newReviewRating,
      date: 'Today',
      title: newReviewTitle || 'Verified Patron Experience',
      comment: newReviewComment,
      verifiedPurchase: true,
      helpfulCount: 0,
    };
    setReviewsList([newRev, ...reviewsList]);
    setReviewFormOpen(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
    showToast('Your honest review has been published to the atelier log.', 'success');
  };

  // Similar garments
  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-[11px] uppercase tracking-wider text-vestora-muted flex items-center space-x-2 border-b border-vestora-cream/60">
        <Link href="/" className="hover:text-vestora-charcoal">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-vestora-charcoal">Collections</Link>
        <span>/</span>
        <Link href={`/products?category=${encodeURIComponent(product.category)}`} className="hover:text-vestora-charcoal">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-vestora-charcoal font-medium truncate max-w-xs">{product.name}</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 sm:gap-14">
          {/* ================= LEFT: PRODUCT IMAGERY ================= */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-vestora-bone shadow-sm border border-vestora-cream group">
              <Image
                src={images[selectedImageIndex] || images[0]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />

              {product.discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-vestora-jet text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded shadow">
                  Save {product.discountPercentage}%
                </span>
              )}

              {/* Floating Compare & Wishlist Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${isWishlisted ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-white/90 text-vestora-charcoal hover:bg-white'
                    }`}
                  title="Wishlist"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => (isCompared ? removeFromCompare(product.id) : addToCompare(product))}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${isCompared ? 'bg-vestora-charcoal text-vestora-gold' : 'bg-white/90 text-vestora-charcoal hover:bg-white'
                    }`}
                  title={isCompared ? 'In Compare Table' : 'Add to Compare'}
                >
                  <Scale className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-20 h-26 relative rounded-lg overflow-hidden flex-shrink-0 border-2 transition ${selectedImageIndex === idx ? 'border-vestora-charcoal shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                  >
                    <Image src={img} alt="thumbnail" fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ================= RIGHT: PRODUCT DETAILS & PURCHASE ================= */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center justify-between text-xs uppercase tracking-widest text-vestora-muted font-medium">
                <span>{product.brand}</span>
                <span className="text-vestora-bronze font-semibold">{product.gender}&apos;s Atelier</span>
              </div>

              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-vestora-charcoal mt-1">
                {product.name}
              </h1>

              <p className="text-xs text-vestora-muted mt-1.5 italic leading-relaxed">
                {product.tagline}
              </p>

              {/* Rating & Reviews */}
              <div className="flex items-center gap-3 mt-3 text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold text-vestora-charcoal">{product.rating}</span>
                </div>
                <span className="text-vestora-taupe">&bull;</span>
                <a href="#reviews" className="text-vestora-bronze font-medium hover:underline">
                  {reviewsList.length} Verified Patron Reviews
                </a>
                <span className="text-vestora-taupe">&bull;</span>
                <span className="text-emerald-700 font-medium">In Stock & Verified</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 bg-vestora-bone/70 rounded-xl border border-vestora-sand flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-bold text-vestora-charcoal">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-vestora-muted line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercentage > 0 && (
                    <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {product.discountPercentage}% OFF
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-vestora-muted mt-1">
                  Inclusive of all taxes &bull; Free express delivery over ₹2,999
                </p>
              </div>

              <Link
                href="/compare"
                className="text-[11px] font-semibold text-vestora-bronze hover:underline flex items-center gap-1"
              >
                <Scale className="w-3.5 h-3.5" /> Compare Spec
              </Link>
            </div>

            {/* Color Swatches */}
            <div>
              <div className="flex justify-between text-xs font-medium text-vestora-charcoal mb-2">
                <span>Color Palette: <strong className="font-semibold">{currentVariant.colorName}</strong></span>
              </div>
              <div className="flex gap-3">
                {product.variants.map((v, idx) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setSelectedImageIndex(0);
                    }}
                    className={`w-9 h-9 rounded-full border-2 transition p-0.5 flex items-center justify-center ${selectedVariantIndex === idx ? 'border-vestora-charcoal scale-110 shadow-sm' : 'border-vestora-cream hover:scale-105'
                      }`}
                    title={v.colorName}
                  >
                    <span className="w-full h-full rounded-full" style={{ backgroundColor: v.colorHex }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector & Size Guide Trigger */}
            <div>
              <div className="flex justify-between items-center text-xs font-medium text-vestora-charcoal mb-2">
                <span>Select Size: <strong className="font-semibold">{selectedSize}</strong></span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-vestora-bronze font-semibold hover:underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5" /> Size Chart & Fit Finder
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {currentVariant.sizes.map((s) => {
                  const outOfStock = s.stock === 0;
                  const isSelected = selectedSize === s.size;
                  return (
                    <button
                      key={s.size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`min-w-[48px] h-11 px-3 text-xs font-semibold rounded-lg border transition relative ${isSelected
                          ? 'bg-vestora-charcoal text-white border-vestora-charcoal shadow-sm'
                          : outOfStock
                            ? 'border-dashed border-vestora-cream text-vestora-taupe opacity-40 cursor-not-allowed'
                            : 'border-vestora-cream bg-white text-vestora-charcoal hover:border-vestora-charcoal'
                        }`}
                    >
                      {s.size}
                      {s.stock > 0 && s.stock <= 4 && (
                        <span className="block text-[8px] -mt-0.5 font-normal text-amber-600">
                          {s.stock} left
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Stock Status Notification */}
              {selectedSizeStock > 0 && selectedSizeStock <= 4 && (
                <p className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-md mt-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  Only {selectedSizeStock} pieces remaining in Size {selectedSize}.
                </p>
              )}
            </div>

            {/* Quantity Selector & Main Action CTAs */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                {/* Quantity */}
                <div className="flex items-center border border-vestora-cream rounded-lg bg-white px-2">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-vestora-muted hover:text-vestora-charcoal"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-xs font-bold px-3 text-vestora-charcoal">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-vestora-muted hover:text-vestora-charcoal"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag CTA */}
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-[0.2em] rounded-lg hover:bg-vestora-jet transition shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                </button>
              </div>

              {/* Buy Now Instant Checkout */}
              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 bg-vestora-gold text-vestora-jet text-xs font-bold uppercase tracking-[0.2em] rounded-lg hover:bg-[#d8b992] transition shadow flex items-center justify-center gap-2"
              >
                Instant Buy Now &rarr;
              </button>
            </div>

            {/* PIN Code Delivery Checker Form */}
            <div className="p-4 bg-white rounded-xl border border-vestora-cream shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-vestora-charcoal">
                <Truck className="w-4 h-4 text-vestora-bronze" />
                <span>Estimate Express Delivery for Your PIN Code</span>
              </div>
              <form onSubmit={handlePincodeCheck} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter 6-digit Indian PIN (e.g. 110001)"
                  value={pincodeInput}
                  onChange={(e) => setPincodeInput(e.target.value)}
                  maxLength={6}
                  className="flex-1 bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs focus:outline-none focus:border-vestora-charcoal"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-vestora-bone border border-vestora-sand text-vestora-charcoal text-xs font-semibold uppercase tracking-wider rounded hover:bg-vestora-cream transition"
                >
                  Check
                </button>
              </form>

              {currentPinResult && (
                <div className="text-xs text-emerald-800 font-medium pt-1 flex items-start gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{currentPinResult.message}</span>
                </div>
              )}
              {pincodeError && <p className="text-xs text-red-600 pt-1">{pincodeError}</p>}
            </div>

            {/* ================= 12 COMPREHENSIVE FABRIC & SPEC ATTRIBUTES ACCORDION ================= */}
            <div className="border-t border-vestora-cream pt-4 divide-y divide-vestora-cream text-xs">
              {/* Accordion 1: Fabric Specifications */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleSection('fabric')}
                  className="w-full flex items-center justify-between font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze text-left"
                >
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-vestora-bronze" />
                    1. Fabric Composition & Physical Properties
                  </span>
                  {openSections.fabric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.fabric && (
                  <div className="mt-3 space-y-2 text-vestora-muted pl-6 leading-relaxed">
                    <p><strong className="text-vestora-charcoal">Composition:</strong> {product.fabric.composition}</p>
                    {product.fabric.gsm && (
                      <p><strong className="text-vestora-charcoal">Fabric Weight / GSM:</strong> {product.fabric.gsm} GSM ({product.fabric.thickness})</p>
                    )}
                    <p><strong className="text-vestora-charcoal">Texture & Softness:</strong> {product.fabric.texture} &bull; Rated <em>{product.fabric.softness}</em></p>
                    <p><strong className="text-vestora-charcoal">Breathability:</strong> {product.fabric.breathability}</p>
                    <p><strong className="text-vestora-charcoal">Stretch & Elasticity:</strong> {product.fabric.stretch}</p>
                    <p><strong className="text-vestora-charcoal">Moisture Management:</strong> {product.fabric.moistureManagement}</p>
                    {product.fabric.lining && (
                      <p><strong className="text-vestora-charcoal">Interior Lining:</strong> {product.fabric.lining}</p>
                    )}
                    {product.fabric.certifications && (
                      <div className="pt-1 flex flex-wrap gap-1.5">
                        {product.fabric.certifications.map((cert, i) => (
                          <span key={i} className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2 py-0.5 rounded font-medium">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 2: Tailoring, Fit & Design Details */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleSection('fit')}
                  className="w-full flex items-center justify-between font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze text-left"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-vestora-bronze" />
                    2. Fit Silhouette & Design Finishing
                  </span>
                  {openSections.fit ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.fit && (
                  <div className="mt-3 space-y-2 text-vestora-muted pl-6 leading-relaxed">
                    <p><strong className="text-vestora-charcoal">Fit Type:</strong> {product.specifications.fitType}</p>
                    <p><strong className="text-vestora-charcoal">Design Highlights:</strong></p>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {product.specifications.designDetails.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                    <p className="pt-1"><strong className="text-vestora-charcoal">Best Occasions:</strong> {product.specifications.bestOccasions.join(', ')}</p>
                    <p><strong className="text-vestora-charcoal">Ideal Seasons:</strong> {product.specifications.bestSeasons.join(', ')}</p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Verified Craftsmanship & Manufacturing */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleSection('craftsmanship')}
                  className="w-full flex items-center justify-between font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze text-left"
                >
                  <span className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-vestora-bronze" />
                    3. Manufacturing Origin & Garment Construction
                  </span>
                  {openSections.craftsmanship ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.craftsmanship && (
                  <div className="mt-3 space-y-2 text-vestora-muted pl-6 leading-relaxed">
                    <p><strong className="text-vestora-charcoal">Atelier Origin:</strong> {product.specifications.manufacturingOrigin}</p>
                    <p><strong className="text-vestora-charcoal">Garment Construction:</strong> {product.specifications.garmentConstruction}</p>
                    <p><strong className="text-vestora-charcoal">Stitching Technique:</strong> {product.specifications.stitchingTechnique}</p>
                    <p><strong className="text-vestora-charcoal">What&apos;s Included in Box:</strong> {product.specifications.whatsIncluded.join(', ')}</p>
                    {product.warranty && (
                      <p><strong className="text-vestora-charcoal">Atelier Guarantee:</strong> {product.warranty}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Accordion 4: Garment Care Instructions */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleSection('care')}
                  className="w-full flex items-center justify-between font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze text-left"
                >
                  <span className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-vestora-bronze" />
                    4. Care & Maintenance Instructions
                  </span>
                  {openSections.care ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.care && (
                  <div className="mt-3 space-y-1.5 text-vestora-muted pl-6 leading-relaxed">
                    <ul className="list-disc list-inside space-y-1">
                      {product.fabric.careInstructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 5: Shipping, Returns & Warranty */}
              <div className="py-3.5">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze text-left"
                >
                  <span className="flex items-center gap-2">
                    <PackageCheck className="w-4 h-4 text-vestora-bronze" />
                    5. Shipping, 15-Day Return & Exchange Policies
                  </span>
                  {openSections.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {openSections.shipping && (
                  <div className="mt-3 space-y-2 text-vestora-muted pl-6 leading-relaxed">
                    <p>Complimentary express air delivery on orders above ₹2,999. Orders below ₹2,999 incur a flat ₹250 courier charge.</p>
                    <p>We provide a <strong>{product.returnPolicyDays}-day bespoke return and size exchange policy</strong> with doorstep reverse pickup.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= COMPLETE THE LOOK BUNDLE RECOMMENDATIONS ================= */}
        <section className="mt-20 pt-12 border-t border-vestora-cream">
          <div className="max-w-xl mb-8">
            <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Atelier Stylist Curated Edit
            </p>
            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-vestora-charcoal mt-1">
              Complete The Look
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((p) => p.id !== product.id && (p.gender === product.gender || p.gender === 'Unisex'))
              .slice(0, 4)
              .map((lookProduct) => (
                <ProductCard key={lookProduct.id} product={lookProduct} />
              ))}
          </div>
        </section>

        {/* ================= COMPLETE THE LOOK & ATELIER PAIRINGS ================= */}
        {similarProducts.length > 0 && (
          <section className="mt-16 pt-12 border-t border-vestora-cream">
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
                  Stylist Recommendation
                </p>
                <h3 className="font-serif text-2xl sm:text-3xl font-normal text-vestora-charcoal mt-1">
                  Complete the Look & Atelier Pairings
                </h3>
                <p className="text-xs text-vestora-muted mt-1">
                  Coordinated garments curated to match the tailoring and drape of this piece.
                </p>
              </div>
              <Link href="/products" className="hidden sm:inline-block text-xs uppercase tracking-wider text-vestora-charcoal hover:text-vestora-bronze font-semibold">
                Explore Full Archive &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* ================= CUSTOMER REVIEWS & RATINGS ================= */}
        <section id="reviews" className="mt-20 pt-12 border-t border-vestora-cream">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
                Patron Impressions & Testimonials
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-vestora-charcoal mt-1">
                Verified Garment Reviews ({reviewsList.length})
              </h2>
            </div>

            <button
              onClick={() => setReviewFormOpen(!reviewFormOpen)}
              className="mt-4 md:mt-0 px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-wider font-semibold rounded hover:bg-vestora-jet transition"
            >
              Write A Review
            </button>
          </div>

          {/* Review Submission Form Modal / Box */}
          {reviewFormOpen && (
            <form onSubmit={handleReviewSubmit} className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm max-w-xl mb-8 space-y-4">
              <h3 className="font-serif text-base font-semibold text-vestora-charcoal">
                Submit Your Verified Feedback
              </h3>
              <div>
                <label className="block text-xs text-vestora-muted mb-1">Your Full Name:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rohini Roy"
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-vestora-muted mb-1">Rating:</label>
                  <select
                    value={newReviewRating}
                    onChange={(e) => setNewReviewRating(Number(e.target.value))}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs"
                  >
                    <option value={5}>5 Stars - Flawless Couture</option>
                    <option value={4}>4 Stars - High Quality</option>
                    <option value={3}>3 Stars - Satisfactory</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-vestora-muted mb-1">Review Headline:</label>
                  <input
                    type="text"
                    placeholder="e.g. Incredible silk luster"
                    value={newReviewTitle}
                    onChange={(e) => setNewReviewTitle(e.target.value)}
                    className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-vestora-muted mb-1">Detailed Garment Feedback:</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the fabric feel, drape, sizing accuracy, and stitching..."
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3 py-2 text-xs"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReviewFormOpen(false)}
                  className="px-4 py-2 border border-vestora-cream text-xs rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded"
                >
                  Publish Review
                </button>
              </div>
            </form>
          )}

          {/* Reviews List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="bg-white p-6 rounded-xl border border-vestora-cream shadow-sm space-y-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <h4 className="font-serif text-sm font-semibold text-vestora-charcoal">&ldquo;{rev.title}&rdquo;</h4>
                <p className="text-xs text-vestora-muted leading-relaxed">{rev.comment}</p>
                <div className="pt-4 border-t border-vestora-cream flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-vestora-charcoal">{rev.userName}</span>
                    <span className="text-vestora-taupe block text-[10px]">{rev.date}</span>
                  </div>
                  {rev.verifiedPurchase && (
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ================= RECENTLY VIEWED RIBBON ================= */}
        {recentlyViewed.length > 1 && (
          <section className="mt-20 pt-12 border-t border-vestora-cream">
            <h3 className="font-serif text-lg font-medium text-vestora-charcoal mb-6">
              Recently Viewed Garments
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {recentlyViewed
                .filter((p) => p.id !== product.id)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    className="group bg-white rounded-lg border border-vestora-cream overflow-hidden p-2 hover:shadow transition"
                  >
                    <div className="relative aspect-[3/4] w-full rounded overflow-hidden bg-vestora-bone">
                      <Image src={p.variants[0]?.images[0] || ''} alt={p.name} fill className="object-cover" sizes="150px" />
                    </div>
                    <p className="text-[11px] font-medium text-vestora-charcoal truncate mt-2">{p.name}</p>
                    <p className="text-xs font-bold text-vestora-charcoal">₹{p.price.toLocaleString('en-IN')}</p>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>

      {/* Sizing Guide Modal */}
      <SizeGuideModal
        product={product}
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        onSelectSize={(s) => setSelectedSize(s)}
      />
    </div>
  );
}

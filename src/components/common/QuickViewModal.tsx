'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Star, ShoppingBag, Scale, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { useStore } from '@/context/StoreContext';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    addToCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const quantity = 1;

  if (!quickViewProduct) return null;

  const currentVariant = quickViewProduct.variants[selectedVariantIndex] || quickViewProduct.variants[0];
  const images = currentVariant.images;
  const isCompared = isInCompare(quickViewProduct.id);
  const isWishlisted = isInWishlist(quickViewProduct.id);

  const handleAddToCart = () => {
    addToCart(quickViewProduct, currentVariant.colorName, selectedSize, quantity);
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setQuickViewProduct(null)}
      />

      <div className="relative w-full max-w-4xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream flex flex-col md:flex-row max-h-[90vh] overflow-y-auto z-10">
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-vestora-muted hover:text-vestora-charcoal bg-white/80 rounded-full backdrop-blur-sm transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left: Gallery */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between bg-vestora-bone/40">
          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-vestora-bone">
            <Image
              src={images[selectedImageIndex] || images[0]}
              alt={quickViewProduct.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {quickViewProduct.discountPercentage > 0 && (
              <span className="absolute top-3 left-3 bg-vestora-jet text-white text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded">
                Save {quickViewProduct.discountPercentage}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-4 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-14 h-18 relative rounded-md overflow-hidden flex-shrink-0 border-2 transition ${selectedImageIndex === idx ? 'border-vestora-charcoal' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                >
                  <Image src={img} alt="thumb" fill className="object-cover" sizes="56px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Garment Details & Actions */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-vestora-muted font-medium">
                <span>{quickViewProduct.brand}</span>
                <span>{quickViewProduct.category}</span>
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-vestora-charcoal mt-1">
                {quickViewProduct.name}
              </h2>
              <p className="text-xs text-vestora-muted mt-1 italic">{quickViewProduct.tagline}</p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-baseline gap-2.5">
                <span className="text-xl font-bold text-vestora-charcoal">
                  ₹{quickViewProduct.price.toLocaleString('en-IN')}
                </span>
                {quickViewProduct.originalPrice > quickViewProduct.price && (
                  <span className="text-sm text-vestora-muted line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-vestora-charcoal">{quickViewProduct.rating}</span>
                <span className="text-vestora-muted">({quickViewProduct.reviewCount})</span>
              </div>
            </div>

            {/* Fabric Highlight Badge */}
            <div className="p-3 bg-vestora-bone rounded-lg border border-vestora-sand text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-vestora-charcoal">
                <ShieldCheck className="w-4 h-4 text-vestora-bronze" />
                <span>{quickViewProduct.fabric.composition}</span>
              </div>
              <div className="text-[11px] text-vestora-muted flex gap-3">
                {quickViewProduct.fabric.gsm && <span>Density: <strong>{quickViewProduct.fabric.gsm} GSM</strong></span>}
                <span>Fit: <strong>{quickViewProduct.specifications.fitType}</strong></span>
              </div>
            </div>

            {/* Color Swatches */}
            <div>
              <label className="block text-xs font-medium text-vestora-charcoal mb-2">
                Color: <span className="font-normal text-vestora-muted">{currentVariant.colorName}</span>
              </label>
              <div className="flex gap-2.5">
                {quickViewProduct.variants.map((variant, idx) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setSelectedImageIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border-2 transition p-0.5 flex items-center justify-center ${selectedVariantIndex === idx ? 'border-vestora-charcoal scale-110' : 'border-vestora-cream'
                      }`}
                    title={variant.colorName}
                  >
                    <span
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: variant.colorHex }}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div>
              <div className="flex justify-between text-xs font-medium text-vestora-charcoal mb-2">
                <span>Select Size</span>
                <span className="text-vestora-bronze font-normal">Complimentary exchange</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentVariant.sizes.map((s) => {
                  const outOfStock = s.stock === 0;
                  return (
                    <button
                      key={s.size}
                      disabled={outOfStock}
                      onClick={() => setSelectedSize(s.size)}
                      className={`min-w-[42px] h-9 px-3 text-xs font-medium rounded border transition ${selectedSize === s.size
                          ? 'bg-vestora-charcoal text-white border-vestora-charcoal'
                          : outOfStock
                            ? 'border-dashed border-vestora-cream text-vestora-muted opacity-40 cursor-not-allowed'
                            : 'border-vestora-cream bg-white text-vestora-charcoal hover:border-vestora-charcoal'
                        }`}
                    >
                      {s.size}
                      {s.stock > 0 && s.stock <= 3 && (
                        <span className="block text-[8px] -mt-1 text-amber-600">3 left</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-vestora-jet transition flex items-center justify-center gap-2 shadow"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>

              <button
                onClick={() => toggleWishlist(quickViewProduct.id)}
                className={`p-3 border rounded transition ${isWishlisted
                    ? 'border-red-300 bg-red-50 text-red-600'
                    : 'border-vestora-cream bg-white text-vestora-charcoal hover:bg-vestora-bone'
                  }`}
                title="Wishlist"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => addToCompare(quickViewProduct)}
                className={`p-3 border rounded transition ${isCompared
                    ? 'border-vestora-bronze bg-vestora-bone text-vestora-bronze'
                    : 'border-vestora-cream bg-white text-vestora-charcoal hover:bg-vestora-bone'
                  }`}
                title="Add to Compare"
              >
                <Scale className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center">
              <Link
                href={`/products/${quickViewProduct.id}`}
                onClick={() => setQuickViewProduct(null)}
                className="text-xs text-vestora-bronze font-medium hover:underline inline-flex items-center gap-1"
              >
                View full garment specifications & all 12 fabric attributes <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

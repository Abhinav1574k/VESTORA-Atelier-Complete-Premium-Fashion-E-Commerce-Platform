'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Heart, Scale, Eye, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { useStore } from '@/context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const {
    addToCart,
    addToCompare,
    removeFromCompare,
    isInCompare,
    toggleWishlist,
    isInWishlist,
    setQuickViewProduct,
  } = useStore();

  const [activeVariantIndex, setActiveVariantIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const currentVariant = product.variants[activeVariantIndex] || product.variants[0];
  const primaryImage = currentVariant.images[0];
  const hoverImage = currentVariant.images[1] || primaryImage;

  const isCompared = isInCompare(product.id);
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // find first available in-stock size
    const availableSize = currentVariant.sizes.find((s) => s.stock > 0)?.size || 'M';
    addToCart(product, currentVariant.colorName, availableSize, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleToggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isCompared) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl border border-vestora-cream/90 overflow-hidden hover:shadow-card transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image Container with zoom & overlays */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-vestora-bone/50">
        <Link href={`/products/${product.id}`} className="block w-full h-full">
          <Image
            src={isHovered && hoverImage !== primaryImage ? hoverImage : primaryImage}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.discountPercentage > 0 && (
            <span className="bg-vestora-jet text-white text-[9px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded shadow-sm">
              Save {product.discountPercentage}%
            </span>
          )}
          {product.isNewArrival && (
            <span className="bg-vestora-bone text-vestora-charcoal border border-vestora-sand text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded">
              New Season
            </span>
          )}
          {product.isBestseller && (
            <span className="bg-[#B45339] text-white text-[9px] font-medium tracking-widest uppercase px-2 py-0.5 rounded">
              Bestseller
            </span>
          )}
        </div>

        {/* Floating Quick Action Icons */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${isWishlisted
                ? 'bg-red-50 text-red-600 border border-red-200'
                : 'bg-white/90 text-vestora-charcoal hover:bg-white border border-vestora-cream'
              }`}
            title={isWishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleToggleCompare}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${isCompared
                ? 'bg-vestora-charcoal text-vestora-gold border border-vestora-charcoal'
                : 'bg-white/90 text-vestora-charcoal hover:bg-white border border-vestora-cream'
              }`}
            title={isCompared ? 'In Compare Table' : 'Add to Compare Table'}
            aria-label="Compare"
          >
            <Scale className="w-4 h-4" />
          </button>

          {/* Quick View Button */}
          <button
            onClick={handleOpenQuickView}
            className="w-8 h-8 rounded-full bg-white/90 text-vestora-charcoal hover:bg-white border border-vestora-cream flex items-center justify-center transition shadow-sm"
            title="Quick Preview"
            aria-label="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Hover Quick Add to Bag Bar */}
        <div className="absolute inset-x-3 bottom-3 z-10 transition-all duration-300 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md flex items-center justify-center gap-2 transition ${justAdded
                ? 'bg-emerald-700 text-white'
                : 'bg-vestora-charcoal text-white hover:bg-vestora-jet'
              }`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" /> Added to Bag
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Quick Add
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* Brand & Fabric Micro-Tag */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-vestora-muted font-medium">
            <span>{product.brand}</span>
            <span className="text-vestora-bronze font-semibold">
              {product.fabric.gsm ? `${product.fabric.gsm} GSM` : product.category}
            </span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="block mt-1 group-hover:text-vestora-bronze transition">
            <h3 className="font-serif text-sm font-medium text-vestora-charcoal line-clamp-1 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Honest Fabric Composition */}
          <p className="text-[11px] text-vestora-muted line-clamp-1 mt-0.5">
            {product.fabric.composition}
          </p>
        </div>

        {/* Bottom: Price, Color Swatches & Rating */}
        <div className="mt-3 pt-3 border-t border-vestora-cream/70 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-vestora-charcoal">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-vestora-muted line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
          </div>

          {/* Color swatch dots */}
          <div className="flex items-center space-x-1.5">
            {product.variants.map((v, idx) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveVariantIndex(idx);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition p-0.5 ${activeVariantIndex === idx
                    ? 'border-vestora-charcoal scale-125'
                    : 'border-vestora-cream hover:scale-110'
                  }`}
                title={v.colorName}
              >
                <span
                  className="block w-full h-full rounded-full"
                  style={{ backgroundColor: v.colorHex }}
                />
              </button>
            ))}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[11px] text-vestora-charcoal font-medium">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

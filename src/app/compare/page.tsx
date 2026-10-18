'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Scale,
  Trash2,
  Plus,
  ShoppingBag,
  Star,
  X,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product } from '@/types';

export default function ComparePage() {
  const {
    compareList,
    removeFromCompare,
    clearCompare,
    addToCompare,
    addToCart,
    products,
  } = useStore();

  const [highlightDifferences, setHighlightDifferences] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Lowest price computation
  const lowestPrice = compareList.length > 0 ? Math.min(...compareList.map((p) => p.price)) : 0;

  // Helper to check if an attribute differs across compared items
  const isDifferent = (getter: (p: Product) => string | number | boolean | undefined | null) => {
    if (compareList.length <= 1) return false;
    const first = getter(compareList[0]);
    return compareList.some((p) => getter(p) !== first);
  };

  const handleQuickAdd = (p: Product) => {
    const defaultColor = p.variants[0]?.colorName || 'Standard';
    const defaultSize = p.variants[0]?.sizes.find((s) => s.stock > 0)?.size || 'M';
    addToCart(p, defaultColor, defaultSize, 1);
  };

  // Products available to add to comparison
  const availableToAdd = products.filter(
    (p) => !compareList.some((cp) => cp.id === p.id)
  );

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-vestora-cream gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              <Scale className="w-4 h-4" /> Side-By-Side Spec Matrix
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Garment & Fabric Comparison ({compareList.length}/4)
            </h1>
            <p className="text-xs text-vestora-muted mt-1 max-w-xl">
              Factual technical comparison of yarn density (GSM), fiber weave, tailoring construction, and atelier certifications.
            </p>
          </div>

          {compareList.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Highlight Differences Toggle */}
              <button
                onClick={() => setHighlightDifferences(!highlightDifferences)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider border transition flex items-center gap-2 ${highlightDifferences
                    ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm'
                    : 'bg-white border-vestora-cream text-vestora-charcoal hover:bg-vestora-bone'
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Highlight Contrasting Specs</span>
              </button>

              {compareList.length < 4 && (
                <button
                  onClick={() => setAddModalOpen(true)}
                  className="px-4 py-2 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-vestora-jet transition flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Garment ({4 - compareList.length} spots open)
                </button>
              )}

              <button
                onClick={clearCompare}
                className="px-4 py-2 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                Clear All
              </button>
            </div>
          )}
        </div>

        {/* Empty State */}
        {compareList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-vestora-cream p-12 text-center max-w-xl mx-auto my-12 shadow-sm space-y-4">
            <div className="w-16 h-16 bg-vestora-bone rounded-full flex items-center justify-center mx-auto text-vestora-bronze">
              <Scale className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h2 className="font-serif text-2xl font-medium text-vestora-charcoal">
              No Garments in Comparison Table
            </h2>
            <p className="text-xs text-vestora-muted leading-relaxed max-w-md mx-auto">
              Compare up to four garments simultaneously across technical specifications including fabric GSM, yarn staple, collar construction, and verified origins.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setAddModalOpen(true)}
                className="px-8 py-3 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-vestora-jet transition shadow"
              >
                Choose Garments to Compare
              </button>
            </div>
          </div>
        ) : (
          /* ================= SIDE-BY-SIDE COMPARISON TABLE WITH STICKY MOBILE COLUMN ================= */
          <div className="overflow-x-auto border border-vestora-cream rounded-2xl bg-white shadow-sm relative">
            <table className="w-full text-left text-xs divide-y divide-vestora-cream border-collapse min-w-[720px]">
              {/* Product Header Row: Images, Titles, Pricing & CTAs */}
              <thead className="bg-[#FAF8F5]">
                <tr>
                  <th className="sticky left-0 z-20 bg-[#FAF8F5] p-4 w-48 text-[11px] uppercase tracking-wider text-vestora-muted font-semibold align-top border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Garment Overview
                  </th>
                  {compareList.map((p) => {
                    const isBestPrice = p.price === lowestPrice;
                    const priceDiff = p.price - lowestPrice;
                    return (
                      <th
                        key={p.id}
                        className={`p-5 w-64 align-top border-r border-vestora-cream last:border-r-0 ${isBestPrice ? 'bg-amber-50/50' : ''
                          }`}
                      >
                        <div className="space-y-3">
                          {/* Image & Remove button */}
                          <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-vestora-bone border border-vestora-cream">
                            <Image
                              src={p.variants[0]?.images[0] || ''}
                              alt={p.name}
                              fill
                              className="object-cover"
                              sizes="250px"
                            />
                            <button
                              onClick={() => removeFromCompare(p.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 text-vestora-charcoal hover:text-red-600 rounded-full shadow-sm transition"
                              title="Remove from comparison"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {isBestPrice ? (
                              <span className="absolute bottom-2 left-2 bg-vestora-jet text-vestora-gold text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded shadow">
                                Lowest Price in Group
                              </span>
                            ) : priceDiff > 0 ? (
                              <span className="absolute bottom-2 left-2 bg-white/95 text-vestora-charcoal text-[9px] font-semibold uppercase px-2 py-0.5 rounded shadow">
                                +₹{priceDiff.toLocaleString('en-IN')} vs lowest
                              </span>
                            ) : null}
                          </div>

                          {/* Brand & Name */}
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-vestora-bronze font-bold block">
                              {p.brand}
                            </span>
                            <Link
                              href={`/products/${p.id}`}
                              className="font-serif text-sm font-medium text-vestora-charcoal hover:text-vestora-bronze transition line-clamp-2 mt-0.5"
                            >
                              {p.name}
                            </Link>
                          </div>

                          {/* Price */}
                          <div className="space-y-0.5">
                            <div className="flex items-baseline gap-2">
                              <span className="text-lg font-bold text-vestora-charcoal">
                                ₹{p.price.toLocaleString('en-IN')}
                              </span>
                              {p.originalPrice > p.price && (
                                <span className="text-xs text-vestora-muted line-through">
                                  ₹{p.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                              {p.discountPercentage > 0 && (
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
                                  {p.discountPercentage}% OFF
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Add to Bag CTA */}
                          <button
                            onClick={() => handleQuickAdd(p)}
                            className="w-full py-2.5 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-vestora-jet transition flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" /> Buy This Garment
                          </button>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>

              {/* Specification Attribute Rows */}
              <tbody className="divide-y divide-vestora-cream font-sans">
                {/* 1. Fabric Composition */}
                <tr className={highlightDifferences && isDifferent((p) => p.fabric.composition) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Fabric Composition
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 font-medium">
                      {p.fabric.composition}
                    </td>
                  ))}
                </tr>

                {/* 2. Fabric Weight / GSM */}
                <tr className={highlightDifferences && isDifferent((p) => p.fabric.gsm) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Fabric Weight / GSM
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0">
                      {p.fabric.gsm ? (
                        <span className="font-bold text-vestora-bronze text-sm">{p.fabric.gsm} GSM</span>
                      ) : (
                        <span className="text-vestora-muted italic">Specialty weave</span>
                      )}
                      <span className="text-vestora-muted block text-[11px]">({p.fabric.thickness})</span>
                    </td>
                  ))}
                </tr>

                {/* 3. Texture & Softness */}
                <tr className={highlightDifferences && isDifferent((p) => p.fabric.softness) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Texture & Hand-feel
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 text-vestora-muted">
                      <strong className="text-vestora-charcoal">{p.fabric.softness}:</strong> {p.fabric.texture}
                    </td>
                  ))}
                </tr>

                {/* 4. Fit Silhouette */}
                <tr className={highlightDifferences && isDifferent((p) => p.specifications.fitType) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Fit Silhouette
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 font-medium text-vestora-charcoal">
                      {p.specifications.fitType}
                    </td>
                  ))}
                </tr>

                {/* 5. Stitching & Construction */}
                <tr className={highlightDifferences && isDifferent((p) => p.specifications.garmentConstruction) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Garment Construction
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 text-vestora-muted">
                      <p className="font-medium text-vestora-charcoal">{p.specifications.garmentConstruction}</p>
                      <p className="text-[10px] mt-0.5">{p.specifications.stitchingTechnique}</p>
                    </td>
                  ))}
                </tr>

                {/* 6. Manufacturing Origin */}
                <tr className={highlightDifferences && isDifferent((p) => p.specifications.manufacturingOrigin) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Verified Atelier Origin
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 font-semibold text-vestora-charcoal">
                      {p.specifications.manufacturingOrigin}
                    </td>
                  ))}
                </tr>

                {/* 7. Comfort & Breathability */}
                <tr className={highlightDifferences && isDifferent((p) => p.fabric.breathability) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Breathability & Stretch
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 text-vestora-muted">
                      <p><strong className="text-vestora-charcoal">Breathability:</strong> {p.fabric.breathability}</p>
                      <p><strong className="text-vestora-charcoal">Stretch:</strong> {p.fabric.stretch}</p>
                    </td>
                  ))}
                </tr>

                {/* 8. Certifications */}
                <tr className={highlightDifferences && isDifferent((p) => p.fabric.certifications?.join(',')) ? 'bg-amber-50/70' : ''}>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Verified Certifications
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0">
                      {p.fabric.certifications && p.fabric.certifications.length > 0 ? (
                        <div className="space-y-1">
                          {p.fabric.certifications.map((c, idx) => (
                            <span key={idx} className="block text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                              {c}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-vestora-taupe italic">Artisanal Traditional</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* 9. Patron Rating */}
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Patron Rating
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{p.rating} / 5.0</span>
                        <span className="text-vestora-muted font-normal text-[11px]">({p.reviewCount})</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 10. Care Instructions */}
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Care Guidance
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 text-vestora-muted text-[11px] leading-relaxed">
                      {p.fabric.careInstructions[0]}
                    </td>
                  ))}
                </tr>

                {/* 11. Delivery & Returns */}
                <tr>
                  <td className="sticky left-0 z-10 bg-white p-4 font-semibold text-vestora-charcoal border-r border-vestora-cream shadow-[2px_0_5px_rgba(0,0,0,0.04)]">
                    Shipping & Returns
                  </td>
                  {compareList.map((p) => (
                    <td key={p.id} className="p-4 border-r border-vestora-cream last:border-r-0 text-vestora-muted text-[11px]">
                      <p className="font-semibold text-vestora-charcoal">Express: {p.estimatedDaysToDeliver} business days</p>
                      <p>{p.returnPolicyDays}-Day Bespoke Returns</p>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= MODAL TO ADD GARMENTS TO COMPARE ================= */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAddModalOpen(false)} />
          <div className="relative w-full max-w-2xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream flex flex-col max-h-[85vh] z-10 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-vestora-cream">
              <h3 className="font-serif text-lg font-medium text-vestora-charcoal">
                Select Garment to Compare ({compareList.length}/4 selected)
              </h3>
              <button onClick={() => setAddModalOpen(false)} className="p-1 text-vestora-muted hover:text-vestora-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {availableToAdd.length === 0 ? (
                <p className="text-xs text-vestora-muted text-center py-8">All available garments are already in the comparison table.</p>
              ) : (
                availableToAdd.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-3 bg-white border border-vestora-cream rounded-xl hover:bg-vestora-bone/50 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-14 relative rounded overflow-hidden bg-vestora-bone flex-shrink-0">
                        <Image src={p.variants[0]?.images[0] || ''} alt={p.name} fill className="object-cover" sizes="50px" />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-semibold text-vestora-bronze">{p.brand}</p>
                        <h4 className="text-xs font-medium text-vestora-charcoal">{p.name}</h4>
                        <p className="text-[11px] text-vestora-muted">
                          ₹{p.price.toLocaleString('en-IN')} &bull; {p.fabric.gsm ? `${p.fabric.gsm} GSM &bull; ` : ''} {p.fabric.composition.split(',')[0]}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        addToCompare(p);
                        if (compareList.length >= 3) {
                          setAddModalOpen(false);
                        }
                      }}
                      className="px-4 py-2 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded hover:bg-vestora-jet transition"
                    >
                      Compare
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

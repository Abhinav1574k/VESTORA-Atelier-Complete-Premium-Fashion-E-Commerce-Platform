'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  X,
  SlidersHorizontal,
  RotateCcw,
  Grid,
  List,
  Search,
  Scale,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import ProductCard from '@/components/product/ProductCard';
import { Category } from '@/types';

function ProductsContent() {
  const searchParams = useSearchParams();
  const { products, compareList } = useStore();

  // URL query params initialization
  const initialCategory = searchParams.get('category') || '';
  const initialGender = searchParams.get('gender') || '';
  const initialSearch = searchParams.get('q') || '';
  const initialSustainable = searchParams.get('sustainable') === 'true';
  const initialSort = searchParams.get('sort') || 'featured';
  const initialDiscount = searchParams.get('discount') ? Number(searchParams.get('discount')) : 0;

  // Filter states
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedGender, setSelectedGender] = useState<string>(initialGender);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedFits, setSelectedFits] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState<number>(1000);
  const [maxPrice, setMaxPrice] = useState<number>(25000);
  const [minRating, setMinRating] = useState<number>(0);
  const [minDiscount, setMinDiscount] = useState<number>(initialDiscount);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sustainableOnly, setSustainableOnly] = useState<boolean>(initialSustainable);

  // Sort state
  const [sortBy, setSortBy] = useState<string>(initialSort);

  // Layout view
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);

  // Sync URL search params when they change
  useEffect(() => {
    if (searchParams.get('category')) setSelectedCategory(searchParams.get('category')!);
    if (searchParams.get('gender')) setSelectedGender(searchParams.get('gender')!);
    if (searchParams.get('q')) setSearchQuery(searchParams.get('q')!);
    if (searchParams.get('sustainable') === 'true') setSustainableOnly(true);
    if (searchParams.get('sort')) setSortBy(searchParams.get('sort')!);
  }, [searchParams]);

  // Unique attribute options from products
  const availableFits = useMemo(() => Array.from(new Set(products.map((p) => p.specifications.fitType))), [products]);
  const availableCategories: Category[] = [
    'Dresses',
    'Shirts',
    'Ethnic Wear',
    'Trousers',
    'Hoodies',
    'Jeans',
    'Jackets',
    'T-Shirts',
    'Activewear',
    'Accessories',
  ];

  const allSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const popularFabrics = [
    'Mulberry Silk',
    'Egyptian Giza Cotton',
    'Organic Combed Cotton',
    'Merino Wool',
    'Japanese Selvedge Denim',
    'Belgian Linen',
    'Recycled Econyl',
    'Vacchetta Leather',
  ];

  const popularOccasions = [
    'Cocktail Gala',
    'Formal Business',
    'Weddings',
    'Casual Lounging',
    'Resort Holidays',
    'Everyday Wear',
  ];

  // Helper toggle functions
  const toggleArrayItem = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedGender('');
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedFits([]);
    setSelectedFabrics([]);
    setSelectedOccasions([]);
    setMinPrice(1000);
    setMaxPrice(25000);
    setMinRating(0);
    setMinDiscount(0);
    setInStockOnly(false);
    setSustainableOnly(false);
  };

  // Filter application logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        const matchFabric = p.fabric.composition.toLowerCase().includes(query);
        const matchTagline = p.tagline.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchCategory && !matchFabric && !matchTagline) {
          return false;
        }
      }

      // Category
      if (selectedCategory && p.category !== selectedCategory) {
        return false;
      }

      // Gender
      if (selectedGender && p.gender !== selectedGender && p.gender !== 'Unisex') {
        return false;
      }

      // Brands
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Sizes
      if (selectedSizes.length > 0) {
        const hasAnySize = p.variants.some((v) =>
          v.sizes.some((s) => selectedSizes.includes(s.size) && s.stock > 0)
        );
        if (!hasAnySize) return false;
      }

      // Fits
      if (selectedFits.length > 0 && !selectedFits.includes(p.specifications.fitType)) {
        return false;
      }

      // Fabrics
      if (selectedFabrics.length > 0) {
        const matchFabric = selectedFabrics.some((f) =>
          p.fabric.composition.toLowerCase().includes(f.toLowerCase())
        );
        if (!matchFabric) return false;
      }

      // Occasions
      if (selectedOccasions.length > 0) {
        const matchOccasion = selectedOccasions.some((occ) =>
          p.specifications.bestOccasions.some((bo) => bo.toLowerCase().includes(occ.toLowerCase()))
        );
        if (!matchOccasion) return false;
      }

      // Price range
      if (p.price < minPrice || p.price > maxPrice) {
        return false;
      }

      // Minimum rating
      if (minRating > 0 && p.rating < minRating) {
        return false;
      }

      // Minimum discount
      if (minDiscount > 0 && p.discountPercentage < minDiscount) {
        return false;
      }

      // In stock only
      if (inStockOnly) {
        const hasStock = p.variants.some((v) => v.sizes.some((s) => s.stock > 0));
        if (!hasStock) return false;
      }

      // Sustainable only
      if (sustainableOnly && !p.isSustainable) {
        return false;
      }

      return true;
    });
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedGender,
    selectedBrands,
    selectedSizes,
    selectedFits,
    selectedFabrics,
    selectedOccasions,
    minPrice,
    maxPrice,
    minRating,
    minDiscount,
    inStockOnly,
    sustainableOnly,
  ]);

  // Sort logic
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === 'price-low') {
      return list.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'discount') {
      return list.sort((a, b) => b.discountPercentage - a.discountPercentage);
    } else if (sortBy === 'popularity') {
      return list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    } else if (sortBy === 'newest') {
      return list.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const displayedProducts = sortedProducts.slice(0, visibleCount);

  // Active filter count
  const activeFilterCount =
    (selectedCategory ? 1 : 0) +
    (selectedGender ? 1 : 0) +
    selectedBrands.length +
    selectedSizes.length +
    selectedFits.length +
    selectedFabrics.length +
    selectedOccasions.length +
    (minPrice > 1000 || maxPrice < 25000 ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    (minDiscount > 0 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (sustainableOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#FCFBF9]">
      {/* Header Banner */}
      <div className="bg-vestora-bone/80 border-b border-vestora-cream py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              <span>Atelier Garment Archive</span>
              {compareList.length > 0 && (
                <span className="bg-vestora-charcoal text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Scale className="w-3 h-3" /> {compareList.length}/4 Compared
                </span>
              )}
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Curated Haute Couture & Sartorial Collections
            </h1>
            <p className="text-xs text-vestora-muted mt-1 max-w-xl">
              Spun from certified extra-long staple Egyptian Giza cotton, pure mulberry silk, and Vitale Barberis wool. Filter by verified GSM, fit, and origin.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-vestora-muted absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search GSM, silk, denim..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs bg-white border border-vestora-cream rounded-full focus:outline-none focus:border-vestora-charcoal w-56 sm:w-64"
              />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-1.5 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-full flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters ({activeFilterCount})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* ================= DESKTOP FILTER SIDEBAR ================= */}
          <aside className="hidden lg:block space-y-6 bg-white p-6 rounded-2xl border border-vestora-cream sticky top-24 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-vestora-cream">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-vestora-charcoal" />
                <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-vestora-charcoal">
                  Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                </h3>
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-vestora-bronze hover:underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Clear All
                </button>
              )}
            </div>

            {/* Gender Toggle */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Audience / Gender
              </label>
              <div className="grid grid-cols-3 gap-1 bg-vestora-bone p-1 rounded-lg text-xs text-center font-medium">
                {['', 'Women', 'Men'].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGender(g)}
                    className={`py-1.5 rounded transition ${selectedGender === g
                        ? 'bg-vestora-charcoal text-white font-semibold'
                        : 'text-vestora-muted hover:text-vestora-charcoal'
                      }`}
                  >
                    {g === '' ? 'All' : g}
                  </button>
                ))}
              </div>
            </div>

            {/* Sustainable Fibers Toggle */}
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
              <div className="text-xs text-emerald-950">
                <p className="font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Certified Sustainable
                </p>
                <p className="text-[10px] text-emerald-800">GOTS, OEKO-TEX, 100% natural</p>
              </div>
              <input
                type="checkbox"
                checked={sustainableOnly}
                onChange={(e) => setSustainableOnly(e.target.checked)}
                className="w-4 h-4 text-emerald-700 rounded focus:ring-emerald-500"
              />
            </div>

            {/* Price Slider */}
            <div>
              <div className="flex justify-between text-xs font-semibold text-vestora-charcoal mb-2">
                <span>Price Range</span>
                <span className="text-vestora-bronze">
                  ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="25000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-vestora-charcoal"
              />
              <div className="flex justify-between text-[10px] text-vestora-muted mt-1">
                <span>₹1,000</span>
                <span>₹12,500</span>
                <span>₹25,000</span>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Garment Category
              </label>
              <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left text-xs py-1 px-2 rounded transition flex items-center justify-between ${selectedCategory === '' ? 'bg-vestora-bone text-vestora-charcoal font-semibold' : 'text-vestora-muted hover:text-vestora-charcoal'
                    }`}
                >
                  <span>All Garment Types</span>
                  <span>({products.length})</span>
                </button>
                {availableCategories.map((cat) => {
                  const count = products.filter((p) => p.category === cat).length;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(selectedCategory === cat ? '' : cat)}
                      className={`w-full text-left text-xs py-1 px-2 rounded transition flex items-center justify-between ${selectedCategory === cat
                          ? 'bg-vestora-bone text-vestora-charcoal font-semibold'
                          : 'text-vestora-muted hover:text-vestora-charcoal'
                        }`}
                    >
                      <span>{cat}</span>
                      <span className="text-[11px] text-vestora-taupe">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Available Size
              </label>
              <div className="flex flex-wrap gap-1.5">
                {allSizes.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      onClick={() => toggleArrayItem(selectedSizes, setSelectedSizes, sz)}
                      className={`w-9 h-8 rounded text-xs font-semibold border transition ${isSelected
                          ? 'bg-vestora-charcoal text-white border-vestora-charcoal'
                          : 'border-vestora-cream bg-white text-vestora-charcoal hover:border-vestora-charcoal'
                        }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Fit Silhouette */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Fit Silhouette
              </label>
              <div className="space-y-1.5">
                {availableFits.map((fit) => (
                  <label key={fit} className="flex items-center gap-2 text-xs text-vestora-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFits.includes(fit)}
                      onChange={() => toggleArrayItem(selectedFits, setSelectedFits, fit)}
                      className="rounded border-vestora-cream text-vestora-charcoal focus:ring-0"
                    />
                    <span>{fit}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Fabric Material Type */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Verified Fabric Type
              </label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {popularFabrics.map((fabric) => (
                  <label key={fabric} className="flex items-center gap-2 text-xs text-vestora-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFabrics.includes(fabric)}
                      onChange={() => toggleArrayItem(selectedFabrics, setSelectedFabrics, fabric)}
                      className="rounded border-vestora-cream text-vestora-charcoal focus:ring-0"
                    />
                    <span>{fabric}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Occasion */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Occasion & Setting
              </label>
              <div className="space-y-1.5">
                {popularOccasions.map((occ) => (
                  <label key={occ} className="flex items-center gap-2 text-xs text-vestora-charcoal cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedOccasions.includes(occ)}
                      onChange={() => toggleArrayItem(selectedOccasions, setSelectedOccasions, occ)}
                      className="rounded border-vestora-cream text-vestora-charcoal focus:ring-0"
                    />
                    <span>{occ}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Minimum Discount Filter */}
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-vestora-charcoal mb-2">
                Minimum Discount
              </label>
              <div className="grid grid-cols-4 gap-1 text-xs text-center font-medium">
                {[0, 10, 20, 30].map((d) => (
                  <button
                    key={d}
                    onClick={() => setMinDiscount(d)}
                    className={`py-1 rounded border transition ${minDiscount === d
                        ? 'bg-vestora-charcoal text-white border-vestora-charcoal'
                        : 'border-vestora-cream hover:bg-vestora-bone'
                      }`}
                  >
                    {d === 0 ? 'All' : `${d}%+`}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ================= MAIN PRODUCTS LISTING ================= */}
          <main className="lg:col-span-3 space-y-6">
            {/* Top Controls Bar: Results count, active filter chips & Sorting */}
            <div className="bg-white p-4 rounded-xl border border-vestora-cream shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-vestora-charcoal">
                <span className="font-semibold text-sm">
                  {filteredProducts.length} {filteredProducts.length === 1 ? 'Garment' : 'Garments'} Found
                </span>
                {selectedCategory && (
                  <span className="bg-vestora-bone px-2 py-0.5 rounded text-[11px] font-medium text-vestora-bronze">
                    &bull; {selectedCategory}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-vestora-muted hidden sm:inline">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-vestora-ivory border border-vestora-cream rounded px-3 py-1.5 text-xs text-vestora-charcoal font-medium focus:outline-none focus:border-vestora-charcoal"
                  >
                    <option value="featured">Featured Atelier Edit</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="popularity">Bestsellers & Popular</option>
                    <option value="rating">Highest Patron Rating</option>
                    <option value="newest">Newest Arrivals</option>
                    <option value="discount">Biggest Reductions</option>
                  </select>
                </div>

                {/* Grid / List View Toggle */}
                <div className="hidden sm:flex border border-vestora-cream rounded p-0.5 bg-vestora-ivory">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded transition ${viewMode === 'grid' ? 'bg-white shadow-sm text-vestora-charcoal' : 'text-vestora-muted'}`}
                    aria-label="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-white shadow-sm text-vestora-charcoal' : 'text-vestora-muted'}`}
                    aria-label="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filter Chips Ribbon */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] uppercase tracking-wider text-vestora-muted font-medium">Active:</span>

                {selectedCategory && (
                  <span className="bg-vestora-bone border border-vestora-sand px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Category: {selectedCategory}
                    <button onClick={() => setSelectedCategory('')}><X className="w-3 h-3 hover:text-red-600" /></button>
                  </span>
                )}
                {selectedGender && (
                  <span className="bg-vestora-bone border border-vestora-sand px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Gender: {selectedGender}
                    <button onClick={() => setSelectedGender('')}><X className="w-3 h-3 hover:text-red-600" /></button>
                  </span>
                )}
                {sustainableOnly && (
                  <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Sustainable
                    <button onClick={() => setSustainableOnly(false)}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {selectedSizes.map((sz) => (
                  <span key={sz} className="bg-vestora-bone border border-vestora-sand px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Size: {sz}
                    <button onClick={() => toggleArrayItem(selectedSizes, setSelectedSizes, sz)}><X className="w-3 h-3 hover:text-red-600" /></button>
                  </span>
                ))}
                {selectedFits.map((fit) => (
                  <span key={fit} className="bg-vestora-bone border border-vestora-sand px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Fit: {fit}
                    <button onClick={() => toggleArrayItem(selectedFits, setSelectedFits, fit)}><X className="w-3 h-3 hover:text-red-600" /></button>
                  </span>
                ))}
                {selectedFabrics.map((fab) => (
                  <span key={fab} className="bg-vestora-bone border border-vestora-sand px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Fabric: {fab}
                    <button onClick={() => toggleArrayItem(selectedFabrics, setSelectedFabrics, fab)}><X className="w-3 h-3 hover:text-red-600" /></button>
                  </span>
                ))}
                {minDiscount > 0 && (
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 px-2.5 py-1 rounded-full text-xs flex items-center gap-1.5">
                    Min {minDiscount}% Off
                    <button onClick={() => setMinDiscount(0)}><X className="w-3 h-3" /></button>
                  </span>
                )}

                <button
                  onClick={clearAllFilters}
                  className="text-xs text-vestora-bronze font-semibold hover:underline ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid / List */}
            {displayedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-vestora-cream p-12 text-center max-w-lg mx-auto my-12">
                <div className="w-16 h-16 bg-vestora-bone rounded-full flex items-center justify-center mx-auto text-vestora-taupe mb-4">
                  <Search className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xl font-medium text-vestora-charcoal">
                  No matching garments found
                </h3>
                <p className="text-xs text-vestora-muted mt-2 leading-relaxed">
                  We could not find any pieces matching your current filter combination. Try resetting filters or searching for verified fabrics like &ldquo;silk&rdquo; or &ldquo;cotton&rdquo;.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-vestora-jet transition"
                >
                  Reset All Filters
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {displayedProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-xl border border-vestora-cream p-4 flex gap-6 items-center">
                    <div className="w-28 h-36 relative flex-shrink-0 bg-vestora-bone rounded overflow-hidden">
                      <Image
                        src={product.variants[0]?.images[0] || ''}
                        alt={product.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-wider text-vestora-bronze font-semibold">{product.brand}</p>
                      <h3 className="font-serif text-lg font-medium text-vestora-charcoal">{product.name}</h3>
                      <p className="text-xs text-vestora-muted mt-0.5">{product.fabric.composition}</p>
                      <p className="text-xs text-vestora-charcoal mt-1 italic">{product.tagline}</p>
                      <div className="mt-3 flex items-center gap-4">
                        <span className="text-base font-bold text-vestora-charcoal">₹{product.price.toLocaleString('en-IN')}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-vestora-muted line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                        )}
                        <span className="text-xs text-vestora-bronze font-medium">
                          {product.fabric.gsm ? `${product.fabric.gsm} GSM` : ''} &bull; {product.specifications.fitType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredProducts.length > visibleCount && (
              <div className="text-center pt-8">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-8 py-3 bg-white border border-vestora-sand text-vestora-charcoal text-xs uppercase tracking-widest font-semibold rounded hover:bg-vestora-bone transition shadow-sm"
                >
                  Load More Garments ({filteredProducts.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ================= MOBILE FILTER DRAWER ================= */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileFilterOpen(false)} />
          <div className="relative w-4/5 max-w-sm bg-[#FCFBF9] h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-vestora-cream">
                <h3 className="font-serif text-base font-medium">Filter Garments</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-4 space-y-5 text-xs">
                {/* Gender */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-2">Audience</label>
                  <div className="grid grid-cols-3 gap-1 bg-vestora-bone p-1 rounded">
                    {['', 'Women', 'Men'].map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGender(g)}
                        className={`py-1 rounded ${selectedGender === g ? 'bg-vestora-charcoal text-white' : 'text-vestora-muted'}`}
                      >
                        {g === '' ? 'All' : g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Slider */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-1">
                    Max Price: ₹{maxPrice.toLocaleString('en-IN')}
                  </label>
                  <input
                    type="range"
                    min="1000"
                    max="25000"
                    step="500"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full accent-vestora-charcoal"
                  />
                </div>

                {/* Categories */}
                <div>
                  <label className="block font-semibold uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 bg-white border border-vestora-cream rounded"
                  >
                    <option value="">All Categories</option>
                    {availableCategories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-vestora-cream space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 bg-vestora-charcoal text-white rounded text-xs uppercase tracking-widest font-semibold"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={clearAllFilters}
                className="w-full py-2 border border-vestora-cream text-vestora-charcoal rounded text-xs uppercase tracking-widest font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-vestora-muted">Loading archive...</div>}>
      <ProductsContent />
    </Suspense>
  );
}

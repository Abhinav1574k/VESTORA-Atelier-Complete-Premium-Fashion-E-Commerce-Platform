'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Plus,
  X,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { Product, OrderStatus, Category, Gender } from '@/types';

export default function AdminPage() {
  const {
    products,
    addProduct,
    deleteProduct,
    orders,
    updateOrderStatus,
    resetDemoData,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'coupons'>('overview');

  // Add Product Modal State
  const [addProductModalOpen, setAddProductModalOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('Vestora Sartorial');
  const [newProdCategory, setNewProdCategory] = useState<Category>('Shirts');
  const [newProdGender, setNewProdGender] = useState<Gender>('Men');
  const [newProdPrice, setNewProdPrice] = useState(3499);
  const [newProdMRP, setNewProdMRP] = useState(4999);
  const [newProdFabric, setNewProdFabric] = useState('100% Giza Cotton');
  const [newProdGSM, setNewProdGSM] = useState(160);
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80');

  // Analytics
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0;
  const activeProductsCount = products.length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName) return;

    const discount = Math.round(((newProdMRP - newProdPrice) / newProdMRP) * 100);

    const created: Product = {
      id: `prod-${Date.now()}`,
      slug: newProdName.toLowerCase().replace(/\s+/g, '-'),
      name: newProdName,
      brand: newProdBrand,
      tagline: 'Artisanal tailoring with verified fabric composition',
      price: newProdPrice,
      originalPrice: newProdMRP,
      discountPercentage: discount > 0 ? discount : 0,
      category: newProdCategory,
      gender: newProdGender,
      rating: 5.0,
      reviewCount: 1,
      isNewArrival: true,
      isSustainable: true,
      variants: [
        {
          id: `var-${Date.now()}-default`,
          colorName: 'Standard Editorial',
          colorHex: '#1F1F1E',
          images: [newProdImage],
          sizes: [
            { size: 'S', stock: 10 },
            { size: 'M', stock: 15 },
            { size: 'L', stock: 12 },
            { size: 'XL', stock: 8 },
          ],
        },
      ],
      fabric: {
        composition: newProdFabric,
        gsm: newProdGSM,
        texture: 'Refined weave with natural hand',
        softness: 'Soft',
        thickness: 'Medium Weight',
        breathability: 'High',
        stretch: 'Natural fiber elasticity',
        wrinkleResistance: 'Moderate',
        moistureManagement: 'High capillary absorption',
        careInstructions: ['Dry clean or wash cold (30°C)', 'Line dry in shade'],
      },
      specifications: {
        fitType: 'Regular Fit',
        designDetails: ['Single needle precision stitching', 'Genuine shell buttons'],
        garmentConstruction: 'Tailored French seam finishing',
        stitchingTechnique: '16 stitches per inch',
        manufacturingOrigin: 'Atelier Workshop, India',
        bestOccasions: ['Smart Casual', 'Workwear'],
        bestSeasons: ['All Season Wear'],
        whatsIncluded: ['1x Garment', '1x Garment Bag'],
      },
      shortDescription: `${newProdName} tailored from ${newProdFabric}.`,
      longDescription: `Exquisite tailoring crafted from ${newProdFabric}. Designed for long-lasting wardrobe elegance.`,
      returnPolicyDays: 15,
      estimatedDaysToDeliver: 2,
    };

    addProduct(created);
    setAddProductModalOpen(false);
    setNewProdName('');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-vestora-cream gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              <ShieldCheck className="w-4 h-4" /> Store Executive Portal
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Vestora Atelier Administrator
            </h1>
            <p className="text-xs text-vestora-muted mt-0.5">
              Manage inventory, fabric specifications, order dispatch status, and customer privileges.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 border border-amber-200 text-amber-800 rounded text-[10px] font-semibold mt-1.5">
              <span>BBA Presentation Mode: Local changes persist in browser storage.</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={resetDemoData}
              title="Reset all orders, inventory, and cart to default presentation state"
              className="px-3.5 py-2.5 border border-amber-300 bg-amber-50/70 text-amber-900 text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-amber-100 transition flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Demo State
            </button>
            <button
              onClick={() => setAddProductModalOpen(true)}
              className="px-4 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-wider font-semibold rounded-lg hover:bg-vestora-jet transition flex items-center gap-1.5 shadow"
            >
              <Plus className="w-4 h-4" /> Add New Garment
            </button>
            <Link
              href="/"
              className="px-4 py-2.5 border border-vestora-cream bg-white text-vestora-charcoal text-xs uppercase tracking-wider font-medium rounded-lg hover:bg-vestora-bone transition"
            >
              View Storefront &rarr;
            </Link>
          </div>
        </div>

        {/* Admin Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-vestora-muted">Total Sales Revenue</p>
              <p className="font-serif text-2xl font-bold text-vestora-charcoal mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">+18.4% this quarter</span>
            </div>
            <div className="w-12 h-12 bg-vestora-bone text-vestora-bronze rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-vestora-muted">Total Orders Processed</p>
              <p className="font-serif text-2xl font-bold text-vestora-charcoal mt-1">{totalOrdersCount}</p>
              <span className="text-[10px] text-vestora-muted mt-1 inline-block">100% On-Time Fulfillment</span>
            </div>
            <div className="w-12 h-12 bg-vestora-bone text-vestora-bronze rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-vestora-muted">Average Order Value (AOV)</p>
              <p className="font-serif text-2xl font-bold text-vestora-charcoal mt-1">₹{avgOrderValue.toLocaleString('en-IN')}</p>
              <span className="text-[10px] text-emerald-700 font-semibold mt-1 inline-block">Prestige Basket</span>
            </div>
            <div className="w-12 h-12 bg-vestora-bone text-vestora-bronze rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-vestora-muted">Active Garments on Loom</p>
              <p className="font-serif text-2xl font-bold text-vestora-charcoal mt-1">{activeProductsCount}</p>
              <span className="text-[10px] text-vestora-bronze font-semibold mt-1 inline-block">All Verified Fabrics</span>
            </div>
            <div className="w-12 h-12 bg-vestora-bone text-vestora-bronze rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-vestora-cream gap-8 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition ${activeTab === 'overview'
                ? 'border-vestora-charcoal text-vestora-charcoal'
                : 'border-transparent text-vestora-muted hover:text-vestora-charcoal'
              }`}
          >
            Orders & Status Management ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition ${activeTab === 'products'
                ? 'border-vestora-charcoal text-vestora-charcoal'
                : 'border-transparent text-vestora-muted hover:text-vestora-charcoal'
              }`}
          >
            Product Catalogue & Inventory ({products.length})
          </button>
        </div>

        {/* TAB 1: ORDERS & STATUS MANAGEMENT */}
        {activeTab === 'overview' && (
          <div className="bg-white rounded-2xl border border-vestora-cream shadow-sm overflow-hidden">
            <div className="p-6 border-b border-vestora-cream flex items-center justify-between">
              <h2 className="font-serif text-base font-semibold text-vestora-charcoal">
                Customer Orders & Live Status Control
              </h2>
              <span className="text-xs text-vestora-muted">Real-time DB synchronization</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-vestora-cream">
                <thead className="bg-vestora-bone text-vestora-charcoal uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Order ID</th>
                    <th className="py-3 px-4 font-semibold">Patron Details</th>
                    <th className="py-3 px-4 font-semibold">Garments</th>
                    <th className="py-3 px-4 font-semibold">Total</th>
                    <th className="py-3 px-4 font-semibold">Payment</th>
                    <th className="py-3 px-4 font-semibold">Fulfillment Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vestora-cream">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-vestora-ivory/60 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-vestora-charcoal">
                        {ord.orderNumber}
                        <span className="block text-[10px] font-sans text-vestora-taupe font-normal">{ord.date}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-vestora-charcoal">{ord.customerName}</p>
                        <p className="text-vestora-muted text-[11px]">{ord.customerEmail}</p>
                        <p className="text-[10px] text-vestora-taupe">{ord.shippingAddress.city}, {ord.shippingAddress.pinCode}</p>
                      </td>

                      <td className="py-3.5 px-4">
                        {ord.items.map((it, i) => (
                          <div key={i} className="text-vestora-charcoal text-[11px]">
                            {it.quantity}x {it.product.name} ({it.selectedSize})
                          </div>
                        ))}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-vestora-charcoal">
                        ₹{ord.total.toLocaleString('en-IN')}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-semibold text-vestora-charcoal block">{ord.paymentMethod}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${ord.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-vestora-bone border border-vestora-sand rounded px-2.5 py-1 text-xs font-semibold text-vestora-charcoal focus:outline-none"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Processing">Processing (Atelier)</option>
                          <option value="Shipped">Shipped (Air Courier)</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled / Refunded</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS CATALOGUE & INVENTORY */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-vestora-cream shadow-sm overflow-hidden">
            <div className="p-6 border-b border-vestora-cream flex items-center justify-between">
              <h2 className="font-serif text-base font-semibold text-vestora-charcoal">
                Active Garments & Inventory Specifications
              </h2>
              <button
                onClick={() => setAddProductModalOpen(true)}
                className="px-3.5 py-1.5 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded"
              >
                + Add Garment
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-vestora-cream">
                <thead className="bg-vestora-bone text-vestora-charcoal uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Garment</th>
                    <th className="py-3 px-4 font-semibold">Category</th>
                    <th className="py-3 px-4 font-semibold">Fabric Composition & GSM</th>
                    <th className="py-3 px-4 font-semibold">Price / MRP</th>
                    <th className="py-3 px-4 font-semibold">Stock Quantity</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vestora-cream">
                  {products.map((p) => {
                    const totalUnits = p.variants.reduce(
                      (acc, v) => acc + v.sizes.reduce((sa, s) => sa + s.stock, 0),
                      0
                    );
                    return (
                      <tr key={p.id} className="hover:bg-vestora-ivory/60 transition">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-12 relative rounded bg-vestora-bone overflow-hidden flex-shrink-0">
                              <Image src={p.variants[0]?.images[0] || ''} alt={p.name} fill className="object-cover" sizes="40px" />
                            </div>
                            <div>
                              <p className="font-semibold text-vestora-charcoal">{p.name}</p>
                              <p className="text-[10px] text-vestora-muted">{p.brand} &bull; {p.gender}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-medium text-vestora-charcoal">
                          {p.category}
                        </td>

                        <td className="py-3 px-4">
                          <p className="font-medium text-vestora-charcoal">{p.fabric.composition}</p>
                          <p className="text-[10px] text-vestora-bronze font-bold">
                            {p.fabric.gsm ? `${p.fabric.gsm} GSM` : 'Artisanal'} &bull; {p.specifications.fitType}
                          </p>
                        </td>

                        <td className="py-3 px-4">
                          <span className="font-bold text-vestora-charcoal">₹{p.price.toLocaleString('en-IN')}</span>
                          <span className="text-[10px] text-vestora-muted line-through block">₹{p.originalPrice.toLocaleString('en-IN')}</span>
                        </td>

                        <td className="py-3 px-4">
                          <span className={`font-semibold ${totalUnits <= 5 ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {totalUnits} units total
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            href={`/products/${p.id}`}
                            className="px-2.5 py-1 text-xs border border-vestora-cream rounded hover:bg-vestora-bone"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="px-2.5 py-1 text-xs border border-red-200 text-red-600 rounded hover:bg-red-50"
                          >
                            Archive
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Garment Modal */}
      {addProductModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAddProductModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream p-6 z-10 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-vestora-cream">
              <h3 className="font-serif text-lg font-medium text-vestora-charcoal">
                Publish New Haute Couture Garment
              </h3>
              <button onClick={() => setAddProductModalOpen(false)}>
                <X className="w-5 h-5 text-vestora-muted" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block text-vestora-charcoal font-semibold mb-1">Garment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sorrento Sea Island Cotton Oxford Shirt"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Atelier Sub-Brand *</label>
                  <select
                    value={newProdBrand}
                    onChange={(e) => setNewProdBrand(e.target.value)}
                    className="w-full bg-white border border-vestora-cream rounded px-2.5 py-2 text-xs"
                  >
                    <option>Vestora Atelier</option>
                    <option>Vestora Sartorial</option>
                    <option>Vestora Virasat</option>
                    <option>Vestora Denim Co.</option>
                    <option>Vestora Essentials</option>
                  </select>
                </div>

                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Category *</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value as Category)}
                    className="w-full bg-white border border-vestora-cream rounded px-2.5 py-2 text-xs"
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Ethnic Wear">Ethnic Wear</option>
                    <option value="Jackets">Jackets</option>
                    <option value="Trousers">Trousers</option>
                    <option value="Jeans">Jeans</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Hoodies">Hoodies</option>
                    <option value="Activewear">Activewear</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Gender *</label>
                  <select
                    value={newProdGender}
                    onChange={(e) => setNewProdGender(e.target.value as Gender)}
                    className="w-full bg-white border border-vestora-cream rounded px-2.5 py-2 text-xs"
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>

                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(Number(e.target.value))}
                    className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">MRP Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProdMRP}
                    onChange={(e) => setNewProdMRP(Number(e.target.value))}
                    className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Fabric Composition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 100% Organic Pima Cotton"
                    value={newProdFabric}
                    onChange={(e) => setNewProdFabric(e.target.value)}
                    className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-vestora-charcoal font-semibold mb-1">Fabric Weight / GSM *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 180"
                    value={newProdGSM}
                    onChange={(e) => setNewProdGSM(Number(e.target.value))}
                    className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-vestora-charcoal font-semibold mb-1">Product Photo URL (Unsplash / CDN) *</label>
                <input
                  type="url"
                  required
                  value={newProdImage}
                  onChange={(e) => setNewProdImage(e.target.value)}
                  className="w-full bg-white border border-vestora-cream rounded px-3 py-2 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-vestora-cream">
                <button
                  type="button"
                  onClick={() => setAddProductModalOpen(false)}
                  className="px-4 py-2 border rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-vestora-charcoal text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Publish Garment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

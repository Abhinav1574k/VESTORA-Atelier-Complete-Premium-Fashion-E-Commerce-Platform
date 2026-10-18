s'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  User as UserIcon,
  Package,
  Heart,
  MapPin,
  RotateCcw,
  Plus,
  Trash2,
  Truck
} from 'lucide-react';
import { useStore } from '@/context/StoreContext';
import { ShippingAddress } from '@/types';

type AccountTab = 'orders' | 'wishlist' | 'addresses' | 'profile';

function AccountContent() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const validTabs: AccountTab[] = ['orders', 'wishlist', 'addresses', 'profile'];
  const initialTab: AccountTab = validTabs.includes(tabParam as AccountTab)
    ? (tabParam as AccountTab)
    : 'orders';

  const {
    user,
    login,
    logout,
    orders,
    wishlist,
    products,
    toggleWishlist,
    addAddress,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<AccountTab>(initialTab);

  // Return modal state
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedOrderIdForReturn, setSelectedOrderIdForReturn] = useState<string>('');
  const [returnReason, setReturnReason] = useState('Fit was too small');
  const [returnActionType, setReturnActionType] = useState<'Exchange' | 'Refund'>('Exchange');

  // New address form
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [newAddr, setNewAddr] = useState<ShippingAddress>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine1: '',
    city: '',
    state: '',
    pinCode: '',
  });

  // Login simulation state if user is logged out
  const [emailInput, setEmailInput] = useState('');

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleReturnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReturnModalOpen(false);
    showToast(
      `Return/Exchange request submitted for ${selectedOrderIdForReturn}. An atelier concierge will contact you within 4 hours.`,
      'success'
    );
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.pinCode) return;
    addAddress(newAddr);
    setAddressModalOpen(false);
    setNewAddr({
      fullName: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      addressLine1: '',
      city: '',
      state: '',
      pinCode: '',
    });
  };

  if (!user) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center p-8 text-center bg-[#FCFBF9]">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-vestora-cream shadow-sm space-y-5">
          <div className="w-16 h-16 bg-vestora-bone rounded-full flex items-center justify-center mx-auto text-vestora-bronze">
            <UserIcon className="w-8 h-8" />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-medium text-vestora-charcoal">
              Welcome to Vestora Atelier
            </h1>
            <p className="text-xs text-vestora-muted mt-1 leading-relaxed">
              Sign in to manage your bespoke wardrobe, track air dispatches, and review tailoring details.
            </p>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
            <strong>BBA College Demo Mode:</strong> Simulated session state for presentation.
          </div>

          {/* Quick Demo Logins */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={() => login('aria.demonte@vestora.com', 'customer', 'Aria De Monte')}
              className="w-full py-2.5 bg-vestora-charcoal text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-vestora-jet transition flex items-center justify-center gap-2 shadow-sm"
            >
              Sign In as Demo Patron (Aria De Monte)
            </button>
            <button
              type="button"
              onClick={() => login('admin@vestora.com', 'admin', 'Atelier Director')}
              className="w-full py-2.5 bg-white border border-vestora-charcoal text-vestora-charcoal text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-vestora-bone transition flex items-center justify-center gap-2"
            >
              Sign In as Demo Admin (Atelier Director)
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-vestora-cream"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase tracking-wider text-vestora-muted">Or enter any custom email</span>
            <div className="flex-grow border-t border-vestora-cream"></div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (emailInput) login(emailInput, 'customer');
            }}
            className="space-y-3"
          >
            <input
              type="email"
              required
              placeholder="e.g. student@college.edu"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full bg-vestora-ivory border border-vestora-cream rounded px-3.5 py-2.5 text-xs focus:outline-none focus:border-vestora-charcoal"
            />
            <button
              type="submit"
              className="w-full py-2.5 bg-vestora-bone border border-vestora-sand text-vestora-charcoal text-xs font-semibold uppercase tracking-wider rounded hover:bg-vestora-cream transition"
            >
              Continue to Demo Account
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF9] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-vestora-cream gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-vestora-bronze font-semibold">
              Patron Profile & Atelier Services
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-vestora-charcoal mt-1">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-vestora-muted mt-1">{user.email}</p>
          </div>

          <button
            onClick={logout}
            className="text-xs text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition self-start md:self-auto"
          >
            Sign Out
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-vestora-cream gap-8 text-xs font-medium uppercase tracking-wider overflow-x-auto">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${activeTab === 'orders'
                ? 'border-vestora-charcoal text-vestora-charcoal font-bold'
                : 'border-transparent text-vestora-muted hover:text-vestora-charcoal'
              }`}
          >
            <Package className="w-4 h-4" /> Order History ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${activeTab === 'wishlist'
                ? 'border-vestora-charcoal text-vestora-charcoal font-bold'
                : 'border-transparent text-vestora-muted hover:text-vestora-charcoal'
              }`}
          >
            <Heart className="w-4 h-4" /> Saved Wishlist ({wishlistedProducts.length})
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 border-b-2 transition flex items-center gap-2 flex-shrink-0 ${activeTab === 'addresses'
                ? 'border-vestora-charcoal text-vestora-charcoal font-bold'
                : 'border-transparent text-vestora-muted hover:text-vestora-charcoal'
              }`}
          >
            <MapPin className="w-4 h-4" /> Shipping Addresses ({user.savedAddresses.length})
          </button>
        </div>

        {/* TAB 1: ORDER HISTORY */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-vestora-cream text-center max-w-md mx-auto">
                <Package className="w-10 h-10 text-vestora-taupe mx-auto mb-3" />
                <h3 className="font-serif text-lg font-medium text-vestora-charcoal">No past orders yet</h3>
                <p className="text-xs text-vestora-muted mt-1">Explore our couture pieces to begin your collection.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-block px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-widest rounded"
                >
                  Discover Catalogue
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="bg-white rounded-2xl border border-vestora-cream shadow-sm p-6 sm:p-8 space-y-6">
                  {/* Order Top Meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-vestora-cream gap-3 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-vestora-bronze tracking-wider">
                        Order #{ord.orderNumber}
                      </span>
                      <p className="text-vestora-muted mt-0.5">Placed on {ord.date} &bull; Payment: {ord.paymentMethod} ({ord.paymentStatus})</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-vestora-bone border border-vestora-sand rounded-full text-xs font-semibold text-vestora-charcoal">
                        <Truck className="w-3.5 h-3.5 text-vestora-bronze" /> {ord.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedOrderIdForReturn(ord.orderNumber);
                          setReturnModalOpen(true);
                        }}
                        className="text-xs text-vestora-bronze hover:underline font-semibold flex items-center gap-1"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Return / Exchange
                      </button>
                    </div>
                  </div>

                  {/* Items in Order */}
                  <div className="space-y-4">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-4 text-xs">
                        <div className="w-16 h-20 relative rounded-lg bg-vestora-bone overflow-hidden flex-shrink-0">
                          <Image
                            src={it.product.variants[0]?.images[0] || ''}
                            alt={it.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${it.productId}`} className="font-semibold text-vestora-charcoal hover:underline">
                            {it.product.name}
                          </Link>
                          <p className="text-vestora-muted text-[11px] mt-0.5">
                            Color: {it.selectedColor} &bull; Size: {it.selectedSize} &bull; Qty: {it.quantity}
                          </p>
                          <p className="text-[10px] text-vestora-bronze font-medium">
                            {it.product.fabric.gsm ? `${it.product.fabric.gsm} GSM &bull; ` : ''} {it.product.fabric.composition}
                          </p>
                        </div>
                        <div className="text-right font-bold text-vestora-charcoal">
                          ₹{(it.unitPrice * it.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="pt-4 border-t border-vestora-cream flex flex-col sm:flex-row sm:items-center justify-between text-xs text-vestora-muted gap-2">
                    <p>Shipping To: {ord.shippingAddress.addressLine1}, {ord.shippingAddress.city}</p>
                    <p className="font-semibold text-vestora-charcoal">
                      Order Total: ₹{ord.total.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: SAVED WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistedProducts.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-vestora-cream text-center max-w-md mx-auto">
                <Heart className="w-10 h-10 text-vestora-taupe mx-auto mb-3" />
                <h3 className="font-serif text-lg font-medium text-vestora-charcoal">Your wishlist is empty</h3>
                <p className="text-xs text-vestora-muted mt-1">Tap the heart icon on any garment to save it here.</p>
                <Link
                  href="/products"
                  className="mt-4 inline-block px-6 py-2.5 bg-vestora-charcoal text-white text-xs uppercase tracking-widest rounded"
                >
                  Explore Garments
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedProducts.map((p) => (
                  <div key={p.id} className="bg-white rounded-xl border border-vestora-cream overflow-hidden p-4 space-y-3">
                    <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden bg-vestora-bone">
                      <Image src={p.variants[0]?.images[0] || ''} alt={p.name} fill className="object-cover" sizes="250px" />
                    </div>
                    <div>
                      <p className="text-[10px] uppercase font-bold text-vestora-bronze">{p.brand}</p>
                      <Link href={`/products/${p.id}`} className="font-serif text-sm font-medium text-vestora-charcoal hover:underline line-clamp-1">
                        {p.name}
                      </Link>
                      <p className="text-xs font-bold text-vestora-charcoal mt-1">₹{p.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link
                        href={`/products/${p.id}`}
                        className="flex-1 py-2 bg-vestora-charcoal text-white text-[11px] font-semibold uppercase tracking-wider rounded text-center"
                      >
                        Select Size
                      </Link>
                      <button
                        onClick={() => toggleWishlist(p.id)}
                        className="p-2 border border-red-200 text-red-600 rounded hover:bg-red-50"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-serif text-lg font-medium">Bespoke Shipping Addresses</h3>
              <button
                onClick={() => setAddressModalOpen(true)}
                className="px-4 py-2 bg-vestora-charcoal text-white text-xs uppercase tracking-wider rounded-lg flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {user.savedAddresses.map((addr, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-vestora-cream shadow-sm text-xs space-y-2 relative">
                  {addr.isDefault && (
                    <span className="absolute top-4 right-4 bg-vestora-bone text-vestora-charcoal border border-vestora-sand text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Default
                    </span>
                  )}
                  <p className="font-bold text-sm text-vestora-charcoal">{addr.fullName}</p>
                  <p className="text-vestora-muted">{addr.addressLine1}</p>
                  {addr.addressLine2 && <p className="text-vestora-muted">{addr.addressLine2}</p>}
                  <p className="text-vestora-muted">{addr.city}, {addr.state} - {addr.pinCode}</p>
                  <p className="text-vestora-muted">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Return / Exchange Modal */}
      {returnModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setReturnModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream p-6 z-10 space-y-4">
            <h3 className="font-serif text-base font-semibold text-vestora-charcoal">
              Submit Return / Exchange Request
            </h3>
            <p className="text-xs text-vestora-muted">Order: {selectedOrderIdForReturn}</p>

            <form onSubmit={handleReturnSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-vestora-charcoal font-medium mb-1">Preferred Resolution:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setReturnActionType('Exchange')}
                    className={`py-2 rounded border text-xs font-semibold ${returnActionType === 'Exchange' ? 'bg-vestora-charcoal text-white' : 'border-vestora-cream bg-white'
                      }`}
                  >
                    Size Exchange (Fastest)
                  </button>
                  <button
                    type="button"
                    onClick={() => setReturnActionType('Refund')}
                    className={`py-2 rounded border text-xs font-semibold ${returnActionType === 'Refund' ? 'bg-vestora-charcoal text-white' : 'border-vestora-cream bg-white'
                      }`}
                  >
                    Atelier Full Refund
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-vestora-charcoal font-medium mb-1">Reason for Return:</label>
                <select
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="w-full p-2 bg-white border border-vestora-cream rounded text-xs"
                >
                  <option>Fit was too small</option>
                  <option>Fit was too relaxed</option>
                  <option>Fabric texture didn&apos;t meet expectations</option>
                  <option>Color differed slightly under domestic lighting</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReturnModalOpen(false)}
                  className="px-4 py-2 border border-vestora-cream rounded text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-vestora-charcoal text-white rounded text-xs font-semibold uppercase tracking-wider"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Address Modal */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setAddressModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#FCFBF9] rounded-2xl shadow-2xl border border-vestora-cream p-6 z-10 space-y-4">
            <h3 className="font-serif text-base font-semibold">Add New Shipping Address</h3>
            <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
              <input
                type="text"
                required
                placeholder="Full Name"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                className="w-full p-2 bg-white border border-vestora-cream rounded"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full p-2 bg-white border border-vestora-cream rounded"
              />
              <input
                type="text"
                required
                placeholder="Address Line"
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                className="w-full p-2 bg-white border border-vestora-cream rounded"
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="City"
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="w-full p-2 bg-white border border-vestora-cream rounded"
                />
                <input
                  type="text"
                  required
                  placeholder="PIN Code"
                  maxLength={6}
                  value={newAddr.pinCode}
                  onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                  className="w-full p-2 bg-white border border-vestora-cream rounded"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-vestora-charcoal text-white rounded font-semibold uppercase tracking-wider"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-vestora-muted">Loading account...</div>}>
      <AccountContent />
    </Suspense>
  );
}

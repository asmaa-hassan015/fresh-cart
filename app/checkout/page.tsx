'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProtectedRoute from '@/app/components/protectedRoute';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import apiClient from '@/app/lib/axios';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, CreditCard, Truck, Shield, Check } from 'lucide-react';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartCount, totalPrice, isLoading: cartLoading } = useCart();
  const { user } = useAuth();
  
  // States
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  
  // Manual address form
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualAddress, setManualAddress] = useState({
    city: '',
    details: '',
    phone: ''
  });

  // Fetch user addresses
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const { data } = await apiClient.get('/addresses');
      
      if (data.status === 'success') {
        setAddresses(data.data || []);
        // Auto-select first address
        if (data.data && data.data.length > 0) {
          setSelectedAddressId(data.data[0]._id);
        } else {
          setShowManualForm(true);
        }
      }
    } catch (error) {
      console.error('Failed to fetch addresses:', error);
      setShowManualForm(true);
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleManualAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setManualAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!showManualForm && !selectedAddressId) {
      toast.error('Please select a delivery address');
      return;
    }

    if (showManualForm) {
      if (!manualAddress.city || !manualAddress.details || !manualAddress.phone) {
        toast.error('Please fill in all address fields');
        return;
      }
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const shippingAddress = showManualForm 
        ? manualAddress 
        : addresses.find(addr => addr._id === selectedAddressId);

      if (paymentMethod === 'cash') {
        // Cash on delivery: POST /orders/:cartId
        const cartId = cartItems[0]?._id; // Assuming cart has an ID
        
        const { data } = await apiClient.post(`/orders/${cartId}`, {
          shippingAddress
        });

        if (data.status === 'success') {
          toast.success('Order placed successfully!');
          router.push('/orders');
        }
      } else {
        // Online payment: POST /orders/checkout-session/:cartId
        const cartId = cartItems[0]?._id;
        
        const { data } = await apiClient.post(`/orders/checkout-session/${cartId}`, {
          shippingAddress
        });

        if (data.status === 'success' && data.session?.url) {
          // Redirect to payment gateway
          window.location.href = data.session.url;
        }
      }
    } catch (error: any) {
      console.error('Failed to place order:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartLoading || loadingAddresses) {
    return (
      <ProtectedRoute requireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading checkout...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-green-600">Home</Link>
              <span>/</span>
              <Link href="/cart" className="hover:text-green-600">Cart</Link>
              <span>/</span>
              <span className="text-gray-900 font-medium">Checkout</span>
            </nav>
          </div>
        </div>

        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Complete Your Order</h1>
                <p className="text-gray-600">Review your items and complete your purchase</p>
              </div>
            </div>
            <Link
              href="/cart"
              className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="hidden sm:inline">Back to Cart</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address Section */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-green-500 px-6 py-4">
                  <div className="flex items-center gap-3 text-white">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <h2 className="font-bold text-lg">Shipping Address</h2>
                      <p className="text-sm text-green-50">Where should we deliver your order?</p>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Delivery Information Alert */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="text-sm font-bold text-blue-900">Delivery Information</h3>
                        <p className="text-sm text-blue-700 mt-1">Please ensure your address is accurate for smooth delivery</p>
                      </div>
                    </div>
                  </div>

                  {/* Saved Addresses or Manual Form */}
                  {showManualForm ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="text"
                            name="city"
                            value={manualAddress.city}
                            onChange={handleManualAddressChange}
                            placeholder="e.g. Cairo, Alexandria, Giza"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Street Address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <textarea
                            name="details"
                            value={manualAddress.details}
                            onChange={handleManualAddressChange}
                            placeholder="Street name, building number, floor, apartment..."
                            rows={3}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <input
                            type="tel"
                            name="phone"
                            value={manualAddress.phone}
                            onChange={handleManualAddressChange}
                            placeholder="01xxxxxxxxx"
                            className="w-full pl-10 pr-32 py-3 border border-gray-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                          />
                          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500">Egyptian numbers only</span>
                        </div>
                      </div>

                      {addresses.length > 0 && (
                        <button
                          onClick={() => setShowManualForm(false)}
                          className="text-sm text-green-600 hover:text-green-700 font-semibold"
                        >
                          Use saved address instead
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <label
                          key={address._id}
                          className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            selectedAddressId === address._id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="radio"
                              name="address"
                              value={address._id}
                              checked={selectedAddressId === address._id}
                              onChange={() => setSelectedAddressId(address._id)}
                              className="mt-1"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-gray-900">{address.name}</h3>
                                <span className="text-xs text-gray-500">{address.city}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">{address.details}</p>
                              <p className="text-sm text-gray-500">{address.phone}</p>
                            </div>
                          </div>
                        </label>
                      ))}
                      <button
                        onClick={() => setShowManualForm(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
                      >
                        + Use different address
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Method Section */}
              <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="bg-green-500 px-6 py-4">
                  <div className="flex items-center gap-3 text-white">
                    <CreditCard className="w-5 h-5" />
                    <div>
                      <h2 className="font-bold text-lg">Payment Method</h2>
                      <p className="text-sm text-green-50">Choose how you'd like to pay</p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  {/* Cash on Delivery */}
                  <label
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'cash'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === 'cash' ? 'bg-green-500' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-6 h-6 ${paymentMethod === 'cash' ? 'text-white' : 'text-gray-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment"
                            value="cash"
                            checked={paymentMethod === 'cash'}
                            onChange={() => setPaymentMethod('cash')}
                          />
                          <h3 className="font-bold text-gray-900">Cash on Delivery</h3>
                          {paymentMethod === 'cash' && (
                            <Check className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-6">Pay when your order arrives at your doorstep</p>
                      </div>
                    </div>
                  </label>

                  {/* Pay Online */}
                  <label
                    className={`block p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === 'card'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        paymentMethod === 'card' ? 'bg-green-500' : 'bg-gray-100'
                      }`}>
                        <CreditCard className={`w-6 h-6 ${paymentMethod === 'card' ? 'text-white' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="payment"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={() => setPaymentMethod('card')}
                          />
                          <h3 className="font-bold text-gray-900">Pay Online</h3>
                          {paymentMethod === 'card' && (
                            <Check className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1 ml-6">Secure payment with Credit/Debit Card via Stripe</p>
                      </div>
                    </div>
                  </label>

                  {/* Security Badge */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="text-sm font-bold text-green-900">Secure & Encrypted</h4>
                        <p className="text-xs text-green-700">Your payment info is protected with 256-bit SSL encryption</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-gray-200 sticky top-24">
                <div className="bg-green-500 px-6 py-4">
                  <h2 className="font-bold text-lg text-white">Order Summary</h2>
                  <p className="text-sm text-green-50">{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="p-6">
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.imageCover}
                            alt={item.product.title}
                            fill
                            className="object-contain p-1"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 line-clamp-1">
                            {item.product.title}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {item.count} × {item.price} EGP
                          </p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">
                          {(item.count * item.price).toFixed(2)} EGP
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Price Summary */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-semibold text-gray-900">{totalPrice.toFixed(2)} EGP</span>
                    </div>
                    <div className="flex justify-between text-sm items-center">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span>Shipping</span>
                      </div>
                      <span className="font-semibold text-green-600">FREE</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-green-600">{totalPrice.toFixed(2)} EGP</span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isPlacingOrder || cartItems.length === 0}
                    className="w-full mt-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isPlacingOrder ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-5 h-5" />
                        Place Order
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="border-t border-gray-200 px-6 py-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                    </svg>
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
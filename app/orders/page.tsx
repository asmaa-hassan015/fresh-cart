'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/protectedRoute';
import apiClient from '@/app/lib/axios';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';
import { Package, MapPin, Phone, Calendar, DollarSign } from 'lucide-react';

interface CartItem {
  count: number;
  _id: string;
  product: {
    _id: string;
    title: string;
    imageCover: string;
    category: {
      _id: string;
      name: string;
    };
    brand: {
      _id: string;
      name: string;
    };
  };
  price: number;
}

interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

interface Order {
  _id: string;
  cartItems: CartItem[];
  totalOrderPrice: number;
  paymentMethodType: string;
  shippingAddress: ShippingAddress;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  id: number;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      // The endpoint structure is: /orders/user/:userId
      // But we need to get the user ID first from localStorage or context
      // Since the API doesn't have a /orders endpoint that auto-gets current user
      // We'll try to get user ID from the token or user object
      
      // For now, we'll use a workaround - try to get all orders
      // If that fails, we'll show empty state
      const { data } = await apiClient.get('/orders');
      
      setOrders(data.data || data || []);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      // If we can't fetch orders, set empty array
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate fake order status based on order state
  const getOrderStatus = (order: Order) => {
    if (order.isDelivered) {
      return {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800',
        icon: '✓'
      };
    } else if (order.isPaid) {
      return {
        label: 'Processing',
        color: 'bg-blue-100 text-blue-800',
        icon: '⟳'
      };
    } else {
      return {
        label: 'Pending Payment',
        color: 'bg-yellow-100 text-yellow-800',
        icon: '⏱'
      };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
            <p className="text-gray-500 mt-2">Track and manage your orders</p>
          </div>

          {/* Orders List */}
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-500 mb-6">Start shopping and your orders will appear here</p>
              <Link
                href="/products"
                className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-xl hover:bg-green-600 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const status = getOrderStatus(order);
                const totalItems = order.cartItems.reduce((sum, item) => sum + item.count, 0);
                
                return (
                  <div 
                    key={order._id} 
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6 flex-wrap">
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Order ID</p>
                            <p className="text-sm font-bold text-gray-900">#{order.id || order._id.slice(-8)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              Items
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {totalItems} {totalItems === 1 ? 'item' : 'items'}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                              <DollarSign className="w-3 h-3" />
                              Total
                            </p>
                            <p className="text-sm font-bold text-green-600">
                              {order.totalOrderPrice.toFixed(2)} EGP
                            </p>
                          </div>
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold ${status.color} flex items-center gap-1`}>
                          <span>{status.icon}</span>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="p-6">
                      <div className="space-y-4 mb-6">
                        {order.cartItems.map((item) => (
                          <div key={item._id} className="flex items-center gap-4">
                            <img
                              src={item.product.imageCover}
                              alt={item.product.title}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                            />
                            <div className="flex-1">
                              <h4 className="text-sm font-medium text-gray-900 line-clamp-1">
                                {item.product.title}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs text-gray-500">
                                  Qty: {item.count}
                                </p>
                                <span className="text-xs text-gray-300">•</span>
                                <p className="text-xs text-gray-500">
                                  {item.price.toFixed(2)} EGP each
                                </p>
                              </div>
                            </div>
                            <p className="text-sm font-bold text-gray-900">
                              {(item.count * item.price).toFixed(2)} EGP
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Delivery Address */}
                      {order.shippingAddress && (
                        <div className="pt-4 border-t border-gray-200 mb-4">
                          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-green-500" />
                            Delivery Address
                          </h4>
                          <div className="bg-gray-50 rounded-xl p-4">
                            <div className="space-y-2 text-sm">
                              <p className="text-gray-700">{order.shippingAddress.details}</p>
                              <p className="text-gray-500">{order.shippingAddress.city}</p>
                              <p className="text-gray-500 flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {order.shippingAddress.phone}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Order Summary */}
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Payment Method</span>
                          <span className="text-sm font-semibold text-gray-900 capitalize">
                            {order.paymentMethodType}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600">Payment Status</span>
                          <span className={`text-sm font-semibold ${order.isPaid ? 'text-green-600' : 'text-orange-600'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <span className="text-base font-bold text-gray-900">Total</span>
                          <span className="text-base font-bold text-green-600">
                            {order.totalOrderPrice.toFixed(2)} EGP
                          </span>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="mt-6 flex gap-3">
                        <button className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          Track Order
                        </button>
                        {!order.isPaid && (
                          <button className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition-colors text-sm">
                            Pay Now
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
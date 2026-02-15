'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/app/components/protectedRoute';
import AccountSidebar from '@/app/components/AccountSidebar';
import apiClient from '@/app/lib/axios';
import toast from 'react-hot-toast';
import { Plus, MapPin, Edit2, Trash2, Home } from 'lucide-react';

interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    details: '',
    phone: '',
    city: '',
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setIsLoading(true);
      // API endpoint: GET /addresses
      const { data } = await apiClient.get('/addresses');
      
      // The response structure is: { status: 'success', data: [...] }
      setAddresses(data.data || []);
    } catch (error: any) {
      console.error('Failed to fetch addresses:', error);
      toast.error('Failed to load addresses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingAddress) {
        // Update existing address
        // API endpoint: PUT /addresses/:id
        const { data } = await apiClient.put(`/addresses/${editingAddress._id}`, formData);
        
        if (data.status === 'success') {
          toast.success('Address updated successfully!');
        }
      } else {
        // Add new address
        // API endpoint: POST /addresses
        const { data } = await apiClient.post('/addresses', formData);
        
        if (data.status === 'success') {
          toast.success('Address added successfully!');
        }
      }

      setShowAddModal(false);
      setEditingAddress(null);
      setFormData({ name: '', details: '', phone: '', city: '' });
      fetchAddresses();
    } catch (error: any) {
      console.error('Failed to save address:', error);
      toast.error(error.response?.data?.message || 'Failed to save address');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setFormData({
      name: address.name,
      details: address.details,
      phone: address.phone,
      city: address.city,
    });
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;

    try {
      // API endpoint: DELETE /addresses/:id
      const { data } = await apiClient.delete(`/addresses/${id}`);
      
      if (data.status === 'success') {
        toast.success('Address deleted successfully!');
        fetchAddresses();
      }
    } catch (error: any) {
      console.error('Failed to delete address:', error);
      toast.error(error.response?.data?.message || 'Failed to delete address');
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingAddress(null);
    setFormData({ name: '', details: '', phone: '', city: '' });
  };

  if (isLoading) {
    return (
      <ProtectedRoute requireAuth>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading addresses...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-3 text-white">
              <span className="text-sm">Home</span>
              <span>/</span>
              <span className="text-sm font-semibold">My Account</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <AccountSidebar />

            {/* Addresses Content */}
            <div className="flex-1">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 min-h-[600px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">My Addresses</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Manage your saved delivery addresses
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-5 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                    Add Address
                  </button>
                </div>

                {/* Addresses List or Empty State */}
                {addresses.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                      <MapPin className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No Addresses Yet</h3>
                    <p className="text-gray-500 mb-8 text-center max-w-md">
                      Add your first delivery address to make checkout faster and easier.
                    </p>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Your First Address
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className="border-2 border-gray-200 rounded-2xl p-5 hover:border-green-500 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center group-hover:bg-green-500 transition-colors">
                              <Home className="w-5 h-5 text-green-600 group-hover:text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{address.name}</h4>
                              <p className="text-xs text-gray-500">{address.city}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(address)}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(address._id)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <p className="text-gray-700">{address.details}</p>
                          <p className="text-gray-500 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {address.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <button
                onClick={handleCloseModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Address Name
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Home, Office"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <input
                  name="city"
                  type="text"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Cairo, Alexandria"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="01xxxxxxxxxx"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Address
                </label>
                <textarea
                  name="details"
                  required
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="Street, building number, floor, apartment..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting 
                    ? 'Saving...' 
                    : editingAddress 
                      ? 'Update Address' 
                      : 'Add Address'
                  }
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isSubmitting}
                  className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
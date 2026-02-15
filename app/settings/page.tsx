'use client';

import { useState } from 'react';
import ProtectedRoute from '@/app/components/protectedRoute';
import AccountSidebar from '@/app/components/AccountSidebar';
import { useAuth } from '@/app/context/AuthContext';
import apiClient from '@/app/lib/axios';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Lock, Truck, RotateCcw, CreditCard, Headset } from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    password: '',
    rePassword: '',
  });

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // API endpoint: PUT /users/updateMe/
      const { data } = await apiClient.put('/users/updateMe/', profileData);
      
      if (data.message === 'success') {
        // Update user in localStorage
        const updatedUser = {
          name: profileData.name,
          email: profileData.email,
          role: user?.role || 'user'
        };
        localStorage.setItem('freshCartUser', JSON.stringify(updatedUser));
        await refreshUser();
        toast.success('Profile updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.password !== passwordData.rePassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // API endpoint: PUT /users/changeMyPassword
      const { data } = await apiClient.put('/users/changeMyPassword', {
        currentPassword: passwordData.currentPassword,
        password: passwordData.password,
        rePassword: passwordData.rePassword,
      });

      if (data.message === 'success') {
        toast.success('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          password: '',
          rePassword: '',
        });
        
        // Update token if API returns a new one
        if (data.token) {
          localStorage.setItem('freshCartToken', data.token);
        }
      }
    } catch (error: any) {
      console.error('Failed to change password:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

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

            {/* Settings Content */}
            <div className="flex-1 space-y-6">
              {/* Account Settings Card */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Account Settings</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Update your profile information and change your password
                  </p>
                </div>

                {/* Profile Information */}
                <div className="mb-8">
                  <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    Profile Information
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">Update your personal details</p>

                  <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        name="name"
                        type="text"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        placeholder="Mohamed Zean"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        placeholder="Enter your email"
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
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        placeholder="01xxxxxxxxxx"
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                </div>

                {/* Account Information Display */}
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Email</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {user?.email}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Role</span>
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {user?.role || 'User'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Change Password */}
                <div>
                  <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-orange-600" />
                    </div>
                    Change Password
                  </h4>
                  <p className="text-sm text-gray-500 mb-6">Update your account password</p>

                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          name="currentPassword"
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Enter your current password"
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          name="password"
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.password}
                          onChange={handlePasswordChange}
                          placeholder="Enter your new password"
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          name="rePassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.rePassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirm your new password"
                          className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Lock className="w-5 h-5" />
                      {isLoading ? 'Changing...' : 'Change Password'}
                    </button>
                  </form>
                </div>
              </div>

              {/* Features Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Truck className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Free Shipping</h4>
                      <p className="text-sm text-gray-600">On orders over 500 EGP</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <RotateCcw className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Easy Returns</h4>
                      <p className="text-sm text-gray-600">30-day return policy</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">Secure Payment</h4>
                      <p className="text-sm text-gray-600">100% secure checkout</p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                      <Headset className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-1">24/7 Support</h4>
                      <p className="text-sm text-gray-600">Dedicated support team</p>
                    </div>
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
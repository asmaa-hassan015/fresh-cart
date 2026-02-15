'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MapPin, Settings, User } from 'lucide-react';

const menuItems = [
  {
    href: '/profile/addresses',
    label: 'My Addresses',
    icon: MapPin,
  },
  {
    href: '/profile/settings',
    label: 'Settings',
    icon: Settings,
  },
];

export default function AccountSidebar() {
  const pathname = usePathname();

  return (
    <div className="w-full lg:w-80 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">My Account</h2>
            <p className="text-sm text-gray-500">Manage your addresses and account settings</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-6 py-4 transition-all border-b border-gray-100 last:border-b-0 ${
                isActive
                  ? 'bg-green-50 text-green-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isActive ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-semibold">{item.label}</span>
              </div>
              <svg
                className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-gray-400'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
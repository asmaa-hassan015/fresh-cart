'use client'

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import UserDropdown from '@/app/components/userDropDownMenu';
import {
    Phone,
    Mail,
    Search,
    Heart,
    ShoppingCart,
    User,
    Menu,
    X,
    ChevronDown,
    Van,
    Gift,
    UserPlus,
    Headset,
    Home,
    Store,
    Grid3x3,
    Award,
    LogOut,
    ChevronRight,
    Package,
    Settings
} from "lucide-react";

const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: Store },
    { href: "/categories", label: "Categories", icon: Grid3x3, hasDropdown: true },
    { href: "/brands", label: "Brands", icon: Award },
];

const categoryDropdownLinks = [
    { href: "/categories", label: "All Categories" },
    { href: "/products?category=6439d2d167d9aa4ca970649f", label: "Electronics" },
    { href: "/products?category=6439d58a0049ad0b52b9003f", label: "Women's Fashion" },
    { href: "/products?category=6439d5b90049ad0b52b90048", label: "Men's Fashion" },
    { href: "/products?category=6439d30b67d9aa4ca97064b1", label: "Beauty & Health" },
];

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const pathname = usePathname();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);
    const [mobileCatExpanded, setMobileCatExpanded] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileOpen(false);
    };

    const closeMobileMenu = () => {
        setMobileOpen(false);
        setMobileCatExpanded(false);
    };

    return (
        <>
            {/* Top Bar */}
            <div className="hidden lg:block text-sm border-b border-gray-100">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center h-10">
                        {/* Left Side - Promo Messages */}
                        <div className="flex items-center gap-6 text-gray-500">
                            <a href="#" className="flex items-center gap-1.5 hover:text-primary-400 transition">
                                <Van className="w-4 h-4 text-green-500" />
                                <span>Free Shipping on Orders 500 EGP</span>
                            </a>
                            <a href="#" className="flex items-center gap-1.5 hover:text-primary-400 transition">
                                <Gift className="w-4 h-4 text-green-500" />
                                <span>New Arrivals Daily</span>
                            </a>
                        </div>

                        {/* Right Side - Contact & Auth */}
                        <div className="flex items-center gap-6">
                            <div className='flex items-center gap-6'>
                                <a className="flex items-center gap-1.5 hover:text-primary-400 transition" href="tel:+18001234567">
                                    <Phone className="w-3.5 h-3.5" />
                                    +1 (800) 123-4567
                                </a>
                                <a className="flex items-center gap-1.5 hover:text-primary-400 transition" href="mailto:support@freshcart.com">
                                    <Mail className="w-3.5 h-3.5" />
                                    support@freshcart.com
                                </a>
                            </div>
                            
                            <span className='w-px h-4 bg-gray-200'>|</span>
                            
                            {/* Top Bar Auth Section */}
                            <div className="flex items-center gap-4">
                                {isLoading ? (
                                    <div className="w-20 h-4 bg-gray-200 animate-pulse rounded"></div>
                                ) : isAuthenticated ? (
                                    <span className="text-gray-600 font-medium">Hi, {user?.name}</span>
                                ) : (
                                    <>
                                        <Link href="/login" className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors">
                                            <User className="w-4 h-4" />
                                            <span>Sign In</span>
                                        </Link>

                                        <Link href="/register" className="flex items-center gap-1.5 text-gray-600 hover:text-primary-600 transition-colors">
                                            <UserPlus className="w-4 h-4" />
                                            <span>Sign Up</span>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-neutral-200">
                <div className="w-auto mx-auto px-4 h-[72px] flex items-center justify-between gap-6">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <img src="/logo.svg" alt="FreshCart" className="h-8" />
                    </Link>

                    {/* Search */}
                    <div className="hidden lg:flex flex-1 max-w-xl relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                            placeholder="Search products..."
                            className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary-500 outline-none transition"
                        />
                        <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center">
                            <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-1 flex-row">
                        <Link href="/contact" className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-gray-200 hover:opacity-80 transition-opacity">
                            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center">
                                <Headset className="w-4 h-4 text-green-400" />
                            </div>
                            <div className="text-xs">
                                <div className="text-gray-400">Support</div>
                                <div className="font-semibold text-gray-700">24/7 Help</div>
                            </div>
                        </Link>
                        {navLinks.map(link => (
                            <div
                                key={link.href}
                                className="relative group"
                                onMouseEnter={() => link.hasDropdown && setCatOpen(true)}
                                onMouseLeave={() => link.hasDropdown && setCatOpen(false)}
                            >
                                <Link
                                    href={link.href}
                                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition
                                        ${pathname === link.href
                                            ? "text-primary-600 bg-primary-50"
                                            : "text-neutral-600 hover:bg-neutral-100"}
                                    `}
                                >
                                    {link.label}
                                    {link.hasDropdown && <ChevronDown className="inline ml-1 w-4 h-4" />}
                                </Link>

                                {link.hasDropdown && catOpen && (
                                    <div className="absolute top-full right-0 mt-2 w-64 rounded-2xl bg-white border border-neutral-100 shadow-xl py-2">
                                        {categoryDropdownLinks.map(c => (
                                            <Link
                                                key={c.href}
                                                href={c.href}
                                                className="block px-4 py-3 text-sm text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition"
                                            >
                                                {c.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right Side Icons & User Menu */}
                    <div className="flex items-center gap-2">
                        {/* Wishlist with Badge */}
                        <Link
                            href="/wishlist"
                            className="p-2 rounded-xl text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition relative"
                        >
                            <Heart className="w-5 h-5" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {wishlistCount > 9 ? '9+' : wishlistCount}
                                </span>
                            )}
                        </Link>

                        {/* Shopping Cart with Badge */}
                        <Link
                            href="/cart"
                            className="p-2 rounded-xl text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition relative"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {cartCount > 9 ? '9+' : cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Menu or Login Button - Desktop */}
                        <div className="hidden md:block">
                            {isLoading ? (
                                <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
                            ) : isAuthenticated ? (
                                <UserDropdown />
                            ) : (
                                <Link
                                    href="/login"
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition"
                                >
                                    <User className="w-4 h-4" />
                                    Sign In
                                </Link>
                            )}
                        </div>

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 rounded-xl hover:bg-neutral-100 transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar Overlay */}
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden transition-opacity duration-300"
                    onClick={closeMobileMenu}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-80 bg-white z-[70] md:hidden transform transition-transform duration-300 ease-out ${
                mobileOpen ? 'translate-x-0' : '-translate-x-full'
            } shadow-2xl overflow-y-auto`}>
                
                {/* Sidebar Header */}
                <div className="sticky top-0 bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo.svg" alt="FreshCart" className="h-8" />
                    </div>
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* User Section */}
                <div className="px-6 py-6 border-b border-gray-200">
                    {isLoading ? (
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                                <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                            </div>
                        </div>
                    ) : isAuthenticated ? (
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                                </div>
                            </div>
                            
                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 gap-2">
                                <Link 
                                    href="/cart" 
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-2 p-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                                >
                                    <ShoppingCart className="w-4 h-4 text-green-600" />
                                    <span className="text-xs font-semibold text-green-700">{cartCount} in Cart</span>
                                </Link>
                                <Link 
                                    href="/wishlist" 
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-2 p-2 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                                >
                                    <Heart className="w-4 h-4 text-red-600" />
                                    <span className="text-xs font-semibold text-red-700">{wishlistCount} Saved</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <Link
                                href="/login"
                                onClick={closeMobileMenu}
                                className="block w-full px-4 py-3 bg-green-500 text-white text-center font-bold rounded-xl hover:bg-green-600 transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                onClick={closeMobileMenu}
                                className="block w-full px-4 py-3 border-2 border-green-500 text-green-600 text-center font-bold rounded-xl hover:bg-green-50 transition-colors"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>

                {/* Navigation Links */}
                <div className="py-4">
                    <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
                    {navLinks.map(link => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href;
                        
                        if (link.hasDropdown) {
                            return (
                                <div key={link.href}>
                                    <button
                                        onClick={() => setMobileCatExpanded(!mobileCatExpanded)}
                                        className={`w-full flex items-center justify-between px-6 py-3 transition-colors ${
                                            isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon className="w-5 h-5" />
                                            <span className="font-semibold">{link.label}</span>
                                        </div>
                                        <ChevronRight className={`w-4 h-4 transition-transform ${mobileCatExpanded ? 'rotate-90' : ''}`} />
                                    </button>
                                    
                                    {/* Subcategories */}
                                    {mobileCatExpanded && (
                                        <div className="bg-gray-50 py-2">
                                            {categoryDropdownLinks.map(cat => (
                                                <Link
                                                    key={cat.href}
                                                    href={cat.href}
                                                    onClick={closeMobileMenu}
                                                    className="block px-12 py-2 text-sm text-gray-600 hover:text-green-600 hover:bg-white transition-colors"
                                                >
                                                    {cat.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                                    isActive ? 'bg-green-50 text-green-600' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-semibold">{link.label}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Account Links (if authenticated) */}
                {isAuthenticated && (
                    <div className="py-4 border-t border-gray-200">
                        <p className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">My Account</p>
                        <Link
                            href="/profile"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <User className="w-5 h-5" />
                            <span className="font-semibold">Profile</span>
                        </Link>
                        <Link
                            href="/orders"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Package className="w-5 h-5" />
                            <span className="font-semibold">My Orders</span>
                        </Link>
                        <Link
                            href="/profile/settings"
                            onClick={closeMobileMenu}
                            className="flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-semibold">Settings</span>
                        </Link>
                    </div>
                )}

                {/* Logout Button */}
                {isAuthenticated && (
                    <div className="px-6 py-4 border-t border-gray-200">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50 text-red-600 font-semibold rounded-xl hover:bg-red-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Logout
                        </button>
                    </div>
                )}

                {/* Footer Info */}
                <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-3">Need help?</p>
                    <div className="space-y-2">
                        <a href="tel:+18001234567" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                            <Phone className="w-4 h-4" />
                            +1 (800) 123-4567
                        </a>
                        <a href="mailto:support@freshcart.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition-colors">
                            <Mail className="w-4 h-4" />
                            support@freshcart.com
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
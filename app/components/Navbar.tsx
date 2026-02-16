'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
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
    Headset
} from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Shop" },
    { href: "/categories", label: "Categories", hasDropdown: true },
    { href: "/brands", label: "Brands" },
];

const categoryDropdownLinks = [
    { href: "/categories", label: "All Categories" },
    { href: "/products?category=6439d2d167d9aa4ca970649f", label: "Electronics" },
    { href: "/products?category=6439d58a0049ad0b52b9003f", label: "Women's Fashion" },
    { href: "/products?category=6439d5b90049ad0b52b90048", label: "Men's Fashion" },
    { href: "/products?category=6439d30b67d9aa4ca97064b1", label: "Beauty & Health" },
];

export default function Navbar() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const { cartCount } = useCart();
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [catOpen, setCatOpen] = useState(false);

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
                        {/* Wishlist */}
                        <Link
                            href="/wishlist"
                            className="p-2 rounded-xl text-neutral-600 hover:bg-primary-50 hover:text-primary-600 transition relative"
                        >
                            <Heart className="w-5 h-5" />
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
                            className="md:hidden p-2 rounded-xl hover:bg-neutral-100"
                        >
                            {mobileOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="md:hidden border-t bg-white px-4 py-6 space-y-3">
                        {/* Mobile Navigation Links */}
                        {navLinks.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="block px-4 py-3 rounded-xl text-sm font-semibold text-neutral-600 hover:bg-neutral-100"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Mobile Auth Section */}
                        <div className="pt-4 border-t border-gray-200">
                            {isLoading ? (
                                <div className="px-4 py-3">
                                    <div className="w-full h-10 bg-gray-200 animate-pulse rounded-xl"></div>
                                </div>
                            ) : isAuthenticated ? (
                                <div className="px-4 py-3">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-emerald-600 text-white font-semibold flex items-center justify-center">
                                            {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Link
                                            href="/profile"
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Profile
                                        </Link>
                                        <Link
                                            href="/orders"
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Orders
                                        </Link>
                                        <Link
                                            href="/wishlist"
                                            onClick={() => setMobileOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Wishlist
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-3 rounded-xl text-center bg-primary-500 text-white text-sm font-bold hover:bg-primary-600 transition"
                                    >
                                        Sign In
                                    </Link>
                                    <Link
                                        href="/register"
                                        onClick={() => setMobileOpen(false)}
                                        className="block px-4 py-3 rounded-xl text-center border-2 border-primary-500 text-primary-600 text-sm font-bold hover:bg-primary-50 transition"
                                    >
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
}
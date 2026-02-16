'use client'

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react"
import CartSkeleton from "../components/CartSkeleton";

export default function CartPage() {
    const { cartItems, cartCount, cartData, updateCartItemCount, removeFromCart, clearCart, isLoading } = useCart();

    if (isLoading) {
        return <CartSkeleton />;
    }

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="bg-[var(--bg-light)] min-h-screen">
                <div className="bg-white border-b border-[var(--border)]">
                    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)]">Shopping Cart</h1>
                        <p className="text-[var(--text-gray)] mt-2">Review your selected items</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-[var(--primary-light)] rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-[var(--primary)]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-dark)] mb-2">Your cart is empty</h2>
                        <p className="text-[var(--text-gray)] mb-6 max-w-sm">Looks like you haven&apos;t added anything to your cart yet. Start shopping and find something you love!</p>
                        <Link
                            href="/products"
                            className="px-8 py-3.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-colors shadow-sm shadow-[var(--primary)]/20"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[var(--bg-light)] min-h-screen pb-20">
            <div className="bg-white border-b border-[var(--border)] mb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[var(--text-dark)]">Shopping Cart</h1>
                        <p className="text-[var(--text-gray)] mt-1">{cartCount} items in your cart</p>
                    </div>
                    <button
                        onClick={() => clearCart()}
                        className="flex items-center gap-2 text-red-500 hover:text-red-700 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-red-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear Cart
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.product._id} className="bg-white rounded-2xl p-4 md:p-6 border border-[var(--border)] shadow-sm flex flex-col md:flex-row gap-6 items-center md:items-start group hover:border-[var(--primary)] transition-colors">
                                {/* Product Image */}
                                <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-[var(--border)]">
                                    <Image
                                        src={item.product.imageCover}
                                        alt={item.product.title}
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="flex-1 w-full text-center md:text-left">
                                    <h3 className="text-lg font-bold text-[var(--text-dark)] mb-1 line-clamp-1">{item.product.title}</h3>
                                    <p className="text-[var(--primary)] font-bold mb-4">{item.price} EGP</p>

                                    <div className="flex items-center justify-center md:justify-between flex-wrap gap-4">
                                        {/* Quantity Controls */}
                                        <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-light)]">
                                            <button
                                                onClick={() => updateCartItemCount(item.product._id, item.count - 1)}
                                                disabled={item.count <= 1}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="w-10 text-center font-semibold text-sm">{item.count}</span>
                                            <button
                                                onClick={() => updateCartItemCount(item.product._id, item.count + 1)}
                                                className="w-9 h-9 flex items-center justify-center hover:bg-gray-200 transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className="font-bold text-lg md:hidden">
                                                {(item.price * item.count).toFixed(2)} EGP
                                            </span>
                                            <button
                                                onClick={() => removeFromCart(item.product._id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Total Price (Desktop) */}
                                <div className="hidden md:block text-right min-w-[100px]">
                                    <span className="block text-sm text-[var(--text-gray)] mb-1">Total</span>
                                    <span className="text-xl font-bold text-[var(--text-dark)]">{(item.price * item.count).toFixed(2)} EGP</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-96 shrink-0">
                        <div className="bg-white rounded-2xl border border-[var(--border)] shadow-sm p-6 md:p-8 sticky top-24">
                            <h2 className="text-xl font-bold text-[var(--text-dark)] mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center text-[var(--text-gray)]">
                                    <span>Subtotal</span>
                                    <span>{cartData?.totalCartPrice || 0} EGP</span>
                                </div>
                                <div className="flex justify-between items-center text-[var(--text-gray)]">
                                    <span>Shipping Estimate</span>
                                    <span className="text-green-600 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between items-center text-[var(--text-gray)]">
                                    <span>Tax Estimate</span>
                                    <span>0 EGP</span>
                                </div>
                            </div>

                            <div className="border-t border-[var(--border)] pt-4 mb-8">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-lg font-bold text-[var(--text-dark)]">Order Total</span>
                                    <span className="text-2xl font-bold text-[var(--text-dark)]">{cartData?.totalCartPrice || 0} EGP</span>
                                </div>
                            </div>

                            <Link
                                href="/checkout"
                                className="w-full flex items-center justify-center gap-2 py-4 bg-[var(--primary)] text-white rounded-xl font-bold hover:bg-[var(--primary-dark)] transition-all shadow-lg shadow-[var(--primary)]/20 hover:shadow-xl hover:shadow-[var(--primary)]/30 active:scale-95 group"
                            >
                                Checkout
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>

                            <div className="mt-6 flex flex-col gap-3 text-center">
                                <p className="text-xs text-[var(--text-gray)]">
                                    Secure Checkout - SSL Encrypted
                                </p>
                                <div className="flex justify-center gap-2 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">
                                    {/* Placeholders for payment icons can go here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import Link from "next/link";
import Image from "next/image";
import { useWishlist } from "@/app/context/WishlistContext";
import { useCart } from "@/app/context/CartContext";
import { Trash2, ShoppingCart } from "lucide-react";

export default function WishlistPage() {
    const { wishlistItems, removeFromWishlist, isLoading } = useWishlist();
    const { addToCart } = useCart();

    if (isLoading) {
        return (
            <div className="bg-[var(--bg-light)] min-h-screen">
                <div className="bg-white border-b border-[var(--border)] mb-8">
                    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
                        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 4, 4].map((i) => (
                            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (!wishlistItems || wishlistItems.length === 0) {
        return (
            <div className="bg-[var(--bg-light)] min-h-screen">
                <div className="bg-white border-b border-[var(--border)]">
                    <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
                        <h1 className="text-3xl md:text-4xl font-bold text-[var(--text-dark)]">Wishlist</h1>
                        <p className="text-[var(--text-gray)] mt-2">Items you&apos;ve saved for later</p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-20">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-12 h-12 text-red-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>
                        </div>
                        <h2 className="text-xl font-bold text-[var(--text-dark)] mb-2">Your wishlist is empty</h2>
                        <p className="text-[var(--text-gray)] mb-6 max-w-sm">Save items you love by tapping the heart icon on any product. They&apos;ll show up here for easy access later.</p>
                        <Link
                            href="/products"
                            className="px-8 py-3.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-colors shadow-sm shadow-[var(--primary)]/20"
                        >
                            Explore Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const moveToCart = async (productId: string) => {
        await addToCart(productId);
        await removeFromWishlist(productId);
    };

    return (
        <div className="bg-[var(--bg-light)] min-h-screen pb-20">
            <div className="bg-white border-b border-[var(--border)] mb-8">
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
                    <h1 className="text-3xl font-bold text-[var(--text-dark)]">Wishlist</h1>
                    <p className="text-[var(--text-gray)] mt-1">{wishlistItems.length} items saved</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden group hover:shadow-lg transition-all duration-300">
                            {/* Image */}
                            <div className="relative aspect-square py-4 bg-gray-50 overflow-hidden border-b border-[var(--border)]">
                                <Image
                                    src={item.imageCover}
                                    alt={item.title}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                />
                                <button
                                    onClick={() => removeFromWishlist(item._id)}
                                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-400 hover:text-red-500 flex items-center justify-center shadow-sm hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                    title="Remove from Wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-4">
                                <h3 className="font-bold text-[var(--text-dark)] line-clamp-1 mb-1" title={item.title}>
                                    {item.title}
                                </h3>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-[var(--primary)] font-bold">{item.price} EGP</span>
                                    <span className="text-xs text-[var(--text-gray)] bg-gray-100 px-2 py-1 rounded-full">
                                        {item.ratingsAverage} ★
                                    </span>
                                </div>

                                <button
                                    onClick={() => moveToCart(item._id)}
                                    className="w-full py-2.5 bg-slate-800 text-white rounded-xl font-bold text-sm hover:bg-slate-900 transition-colors flex items-center justify-center gap-2 active:scale-95"
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    Move to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

'use client';

import Image from "next/image";
import Link from "next/link";
import StarRating from "./StarRating";
import type { Product } from "@/app/lib/api";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import { Heart } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

    const isWishlisted = isInWishlist(product._id);

    // دالة للتعامل مع إضافة المنتج للسلة دون فتح صفحة المنتج
    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault(); // يمنع اللينك الأب من العمل
        e.stopPropagation(); // يمنع وصول الحدث للعناصر الأب
        await addToCart(product._id);
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            await removeFromWishlist(product._id);
        } else {
            await addToWishlist(product._id);
        }
    };

    return (
        <div className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-green-500">

            {/* اللينك يغطي الكارت بالكامل كطبقة أساسية */}
            <Link href={`/products/${product._id}`} className="absolute inset-0 z-0">
                <span className="sr-only">View {product.title}</span>
            </Link>

            {/* Image Container */}
            <div className="relative aspect-square bg-gray-50 overflow-hidden">
                <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />

                {/* Wishlist Button - زدنا الـ z-index ليصبح فوق اللينك */}
                <button
                    onClick={handleWishlist}
                    className={`
                        absolute top-3 right-3 z-10 w-9 h-9 rounded-full
                        backdrop-blur flex items-center justify-center
                        shadow-md transition-all duration-300
                        translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0
                        ${isWishlisted
                            ? "bg-red-50 text-red-500 opacity-100 translate-y-0"
                            : "bg-white/90 text-gray-400 hover:text-red-500 hover:scale-110"}
                    `}
                >
                    <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
                </button>
            </div>

            {/* Info Section */}
            <div className="p-4 flex flex-col gap-2 relative z-10 pointer-events-none">
                {/* pointer-events-none هنا عشان اللينك اللي تحت يشتغل، ونرجع الـ auto للأزرار بس */}

                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-green-600">
                    {product.category.name}
                </span>

                <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug min-h-[2.6rem]">
                    {product.title}
                </h3>

                <div className="flex items-center gap-1.5">
                    <StarRating rating={product.ratingsAverage} />
                    <span className="text-xs text-gray-400">
                        ({product.ratingsAverage.toFixed(1)})
                    </span>
                </div>

                <div className="mt-2 flex items-center justify-between pointer-events-auto">
                    <p className="text-lg font-bold text-gray-900">
                        {product.price.toLocaleString()}
                        <span className="ml-1 text-xs font-normal text-gray-500">EGP</span>
                    </p>

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="
                            relative z-20 flex items-center gap-2 h-10 px-4
                            rounded-xl bg-green-600 text-white
                            font-bold text-sm shadow-lg shadow-green-200
                            transition-all duration-300
                            hover:bg-green-700 hover:scale-105 active:scale-95
                        "
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <span className="hidden sm:inline-block">Add</span>
                    </button>
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateX(-4px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
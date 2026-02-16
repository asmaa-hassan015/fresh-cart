'use client';

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/app/components/ProductCard";
import StarRating from "@/app/components/StarRating";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import toast from "react-hot-toast";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  priceAfterDiscount?: number;
  imageCover: string;
  images: string[];
  category: { _id: string; name: string };
  brand: { _id: string; name: string };
  ratingsAverage: number;
  ratingsQuantity: number;
  quantity: number;
  sold: number;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  
  // Image gallery state
  const allImages = [product.imageCover, ...product.images];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Quantity state
  const [quantity, setQuantity] = useState(1);
  
  // Loading states
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);
  
  // Calculate discount
  const discountPercentage = product.priceAfterDiscount 
    ? Math.round(((product.price - product.priceAfterDiscount) / product.price) * 100)
    : 0;
  
  const displayPrice = product.priceAfterDiscount || product.price;

  // Handle quantity change
  const handleQuantityChange = (action: 'increment' | 'decrement') => {
    if (action === 'increment' && quantity < product.quantity) {
      setQuantity(prev => prev + 1);
    } else if (action === 'decrement' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Add to cart
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    if (product.quantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      // Add to cart multiple times based on quantity
      for (let i = 0; i < quantity; i++) {
        await addToCart(product._id);
      }
      // Only show one success message
      if (quantity === 1) {
        // addToCart already shows toast
      } else {
        toast.success(`${quantity} items added to cart!`);
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Buy now
  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to continue');
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    await handleAddToCart();
    router.push('/checkout');
  };

  // Toggle wishlist
  const handleToggleWishlist = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      router.push('/login?redirect=' + window.location.pathname);
      return;
    }

    setIsAddingToWishlist(true);
    try {
      const apiClient = (await import('@/app/lib/axios')).default;
      
      if (isInWishlist) {
        const { data } = await apiClient.delete(`/wishlist/${product._id}`);
        if (data.status === 'success') {
          setIsInWishlist(false);
          toast.success('Removed from wishlist');
        }
      } else {
        const { data } = await apiClient.post('/wishlist', { productId: product._id });
        if (data.status === 'success') {
          setIsInWishlist(true);
          toast.success('Added to wishlist!');
        }
      }
    } catch (error: any) {
      console.error('Wishlist error:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setIsAddingToWishlist(false);
    }
  };

  return (
    <div className="bg-[var(--bg-light)] min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-[var(--border)] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-[var(--text-gray)] hover:text-[var(--primary)] transition-all duration-200 hover:underline flex items-center gap-1 group">
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
              </svg>
              Home
            </Link>
            <svg className="w-4 h-4 text-[var(--text-gray)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <Link href="/products" className="text-[var(--text-gray)] hover:text-[var(--primary)] transition-colors hover:underline">
              Products
            </Link>
            <svg className="w-4 h-4 text-[var(--text-gray)]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
            <span className="text-[var(--text-dark)] font-medium truncate max-w-[300px]">
              {product.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Product Detail Card */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            
            {/* Image Gallery */}
            <div className="p-6 md:p-10 border-b lg:border-b-0 lg:border-r border-[var(--border)] bg-gradient-to-br from-[var(--bg-light)] to-white">
              {/* Main Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-white mb-6 border border-[var(--border)] group relative shadow-md hover:shadow-xl transition-all duration-300">
                <Image
                  src={allImages[selectedImageIndex]}
                  alt={`${product.title} - Image ${selectedImageIndex + 1}`}
                  width={600}
                  height={600}
                  className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                  priority
                />
                
                {/* Image Counter */}
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-full text-white text-xs font-semibold">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              </div>
              
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`aspect-square rounded-xl overflow-hidden bg-white border-2 transition-all duration-300 hover:scale-105 hover:shadow-md ${
                      selectedImageIndex === idx
                        ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20 shadow-md" 
                        : "border-[var(--border)] hover:border-[var(--primary)]"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.title} thumbnail ${idx + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-full object-contain p-2 hover:scale-110 transition-transform duration-300"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-10 flex flex-col">
              {/* Category Badge */}
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="px-3 py-1.5 bg-[var(--primary-light)] text-[var(--primary)] rounded-full text-xs font-bold uppercase tracking-wide border border-[var(--primary)]/20">
                  {product.category.name}
                </span>
                {product.quantity > 0 && (
                  <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full text-xs font-semibold flex items-center gap-1 border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    In Stock
                  </span>
                )}
              </div>
              
              {/* Product Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--text-dark)] mb-4 leading-tight">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <StarRating rating={product.ratingsAverage} />
                  <span className="text-lg font-bold text-[var(--text-dark)]">
                    {product.ratingsAverage}
                  </span>
                </div>
                <span className="text-sm text-[var(--text-gray)]">
                  ({product.ratingsQuantity} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl md:text-4xl font-bold text-[var(--primary)]">
                    {displayPrice} EGP
                  </span>
                  {product.priceAfterDiscount && (
                    <>
                      <span className="text-lg line-through text-gray-400">
                        {product.price} EGP
                      </span>
                      <span className="px-2 py-1 bg-red-100 text-red-600 rounded-md text-sm font-bold">
                        -{discountPercentage}%
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-[var(--text-dark)] uppercase tracking-wide mb-3">
                  Description
                </h3>
                <p className="text-sm text-[var(--text-gray)] leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector & Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                {/* Quantity */}
                <div className="flex items-center border-2 border-[var(--border)] rounded-xl overflow-hidden hover:border-[var(--primary)] transition-colors bg-white">
                  <button 
                    onClick={() => handleQuantityChange('decrement')}
                    disabled={quantity <= 1}
                    className="w-12 h-12 flex items-center justify-center text-[var(--text-gray)] hover:bg-[var(--bg-light)] hover:text-[var(--primary)] transition-all text-xl font-bold active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    −
                  </button>
                  <span className="w-16 h-12 flex items-center justify-center text-base font-bold border-x-2 border-[var(--border)] bg-[var(--bg-light)]">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => handleQuantityChange('increment')}
                    disabled={quantity >= product.quantity}
                    className="w-12 h-12 flex items-center justify-center text-[var(--text-gray)] hover:bg-[var(--bg-light)] hover:text-[var(--primary)] transition-all text-xl font-bold active:scale-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    +
                  </button>
                </div>
                
                {/* Add to Cart */}
                <button 
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.quantity === 0}
                  className="flex-1 h-12 bg-[var(--primary)] text-white rounded-xl font-bold text-base hover:bg-[var(--primary-dark)] transition-all duration-300 shadow-lg shadow-[var(--primary)]/30 hover:shadow-xl hover:shadow-[var(--primary)]/40 flex items-center justify-center gap-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                      </svg>
                      Add to Cart
                    </>
                  )}
                </button>
                
                {/* Wishlist */}
                <button 
                  onClick={handleToggleWishlist}
                  disabled={isAddingToWishlist}
                  className={`w-12 h-12 border-2 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0 group active:scale-90 ${
                    isInWishlist
                      ? 'border-red-500 bg-red-50 text-red-500'
                      : 'border-[var(--border)] text-[var(--text-gray)] hover:text-red-500 hover:border-red-200 hover:bg-red-50'
                  }`}
                >
                  <svg className={`w-6 h-6 group-hover:scale-110 transition-transform ${isInWishlist ? 'fill-red-500' : ''}`} fill={isInWishlist ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                </button>
              </div>

              {/* Buy Now */}
              <button 
                onClick={handleBuyNow}
                disabled={isAddingToCart || product.quantity === 0}
                className="w-full h-12 mb-8 bg-[var(--text-dark)] text-white rounded-xl font-bold text-base hover:bg-opacity-90 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 active:scale-95 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
                Buy Now
              </button>

              {/* Product Meta */}
              <div className="border-t border-[var(--border)] pt-6 space-y-4 mt-auto">
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[var(--text-dark)] block mb-1">Brand</span>
                    <span className="text-sm text-[var(--text-gray)]">{product.brand.name}</span>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[var(--text-dark)] block mb-1">Availability</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${product.quantity > 0 ? "text-[var(--primary)]" : "text-red-500"}`}>
                        {product.quantity > 0 ? `${product.quantity} units in stock` : "Out of stock"}
                      </span>
                      {product.quantity > 0 && product.quantity < 10 && (
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded text-xs font-semibold">Low Stock</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <svg className="w-5 h-5 text-[var(--primary)] mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
                  </svg>
                  <div className="flex-1">
                    <span className="text-sm font-semibold text-[var(--text-dark)] block mb-1">Total Sold</span>
                    <span className="text-sm text-[var(--text-gray)]">{product.sold.toLocaleString()} units</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-[var(--border)]">
                <div className="text-center p-3 rounded-lg bg-green-50 border border-green-200">
                  <svg className="w-6 h-6 text-green-600 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V3.375c0-.621-.504-1.125-1.125-1.125H6.375c-.621 0-1.125.504-1.125 1.125v10.875m16.5 0h-16.5" />
                  </svg>
                  <span className="text-xs font-semibold text-green-700">Free Delivery</span>
                  <p className="text-[10px] text-green-600 mt-0.5">Orders over 500 EGP</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <svg className="w-6 h-6 text-blue-600 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
                  </svg>
                  <span className="text-xs font-semibold text-blue-700">30 Day Return</span>
                  <p className="text-[10px] text-blue-600 mt-0.5">Money back</p>
                </div>
                
                <div className="text-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                  <svg className="w-6 h-6 text-purple-600 mx-auto mb-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                  <span className="text-xs font-semibold text-purple-700">Secure Payment</span>
                  <p className="text-[10px] text-purple-600 mt-0.5">100% Protected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--text-dark)]">
              You May Also <span className="text-[var(--primary)]">Like</span>
            </h2>
            <p className="text-sm text-[var(--text-gray)] mt-1">
              Similar products you might be interested in
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {relatedProducts.map((p : any) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
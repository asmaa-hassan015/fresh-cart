'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface WishlistContextType {
    wishlistItems: any[];
    isLoading: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const getWishlist = async () => {
        if (!token) {
            setWishlistItems([]);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/wishlist', {
                headers: { token }
            });
            if (data.status === 'success') {
                setWishlistItems(data.data);
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 404 || error.response?.status === 500) {
                setWishlistItems([]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getWishlist();
    }, [token]);

    const addToWishlist = async (productId: string) => {
        if (!token) {
            toast.error('Please login to add to wishlist');
            return;
        }
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/wishlist', { productId }, {
                headers: { token }
            });
            if (data.status === 'success') {
                toast.success(data.message);
                getWishlist();
            }
        } catch (error: any) {
            toast.error('Failed to add to wishlist');
            console.error(error);
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!token) return;
        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
                headers: { token }
            });
            if (data.status === 'success') {
                toast.success('Removed from wishlist');
                getWishlist();
            }
        } catch (error) {
            toast.error('Failed to remove from wishlist');
            console.error(error);
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.some(item => item._id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, isLoading, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

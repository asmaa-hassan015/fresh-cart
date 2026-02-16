'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import apiClient from '@/app/lib/axios';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface CartItem {
    count: number;
    price: number;
    _id: string;
    product: {
        _id: string;
        title: string;
        imageCover: string;
        quantity: number;
    };
}

interface CartData {
    _id: string;
    cartOwner: string;
    products: CartItem[];
    totalCartPrice: number;
}

interface CartContextType {
    cartData: CartData | null;
    cartItems: CartItem[];
    cartCount: number;
    totalPrice: number;
    isLoading: boolean;
    addToCart: (productId: string) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCartItemCount: (productId: string, count: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { token, isAuthenticated } = useAuth();
    const [cartData, setCartData] = useState<CartData | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartCount, setCartCount] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const getCart = async () => {
        if (!token || !isAuthenticated) {
            setCartItems([]);
            setCartCount(0);
            setTotalPrice(0);
            setCartData(null);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            // API endpoint: GET /cart
            const { data } = await apiClient.get('/cart');
            
            if (data.status === 'success') {
                setCartData(data.data);
                setCartItems(data.data.products || []);
                setCartCount(data.numOfCartItems || 0);
                setTotalPrice(data.data.totalCartPrice || 0);
            }
        } catch (error: any) {
            console.error('Failed to fetch cart:', error);
            // If cart doesn't exist (404), set empty cart
            if (error.response?.status === 404) {
                setCartItems([]);
                setCartCount(0);
                setTotalPrice(0);
                setCartData(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && token) {
            getCart();
        } else {
            setCartItems([]);
            setCartCount(0);
            setTotalPrice(0);
            setCartData(null);
        }
    }, [token, isAuthenticated]);

    const addToCart = async (productId: string) => {
        if (!token || !isAuthenticated) {
            toast.error('Please login to add items to cart');
            return;
        }
        
        try {
            // API endpoint: POST /cart
            const { data } = await apiClient.post('/cart', { productId });
            
            if (data.status === 'success') {
                setCartData(data.data);
                setCartItems(data.data.products || []);
                setCartCount(data.numOfCartItems || 0);
                setTotalPrice(data.data.totalCartPrice || 0);
                toast.success('Product added to cart!');
            }
        } catch (error: any) {
            console.error('Failed to add to cart:', error);
            toast.error(error.response?.data?.message || 'Failed to add to cart');
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!token || !isAuthenticated) return;
        
        try {
            // API endpoint: DELETE /cart/:productId
            const { data } = await apiClient.delete(`/cart/${productId}`);
            
            if (data.status === 'success') {
                setCartData(data.data);
                setCartItems(data.data.products || []);
                setCartCount(data.numOfCartItems || 0);
                setTotalPrice(data.data.totalCartPrice || 0);
                toast.success('Item removed from cart');
            }
        } catch (error: any) {
            console.error('Failed to remove from cart:', error);
            toast.error('Failed to remove item');
        }
    };

    const updateCartItemCount = async (productId: string, count: number) => {
        if (!token || !isAuthenticated) return;
        if (count < 1) return;
        
        try {
            // API endpoint: PUT /cart/:productId
            const { data } = await apiClient.put(`/cart/${productId}`, { count });
            
            if (data.status === 'success') {
                setCartData(data.data);
                setCartItems(data.data.products || []);
                setCartCount(data.numOfCartItems || 0);
                setTotalPrice(data.data.totalCartPrice || 0);
            }
        } catch (error: any) {
            console.error('Failed to update cart:', error);
            toast.error('Failed to update quantity');
        }
    };

    const clearCart = async () => {
        if (!token || !isAuthenticated) return;
        
        try {
            // API endpoint: DELETE /cart
            await apiClient.delete('/cart');
            
            setCartItems([]);
            setCartCount(0);
            setTotalPrice(0);
            setCartData(null);
            toast.success('Cart cleared');
        } catch (error: any) {
            console.error('Failed to clear cart:', error);
            toast.error('Failed to clear cart');
        }
    };

    return (
        <CartContext.Provider 
            value={{ 
                cartData,
                cartItems, 
                cartCount, 
                totalPrice,
                isLoading, 
                addToCart, 
                removeFromCart, 
                updateCartItemCount, 
                clearCart, 
                getCart 
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
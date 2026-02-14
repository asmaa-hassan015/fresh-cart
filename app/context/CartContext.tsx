'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from '@/app/context/AuthContext';
import toast from 'react-hot-toast';

interface CartItem {
    count: number;
    price: number;
    product: {
        _id: string;
        title: string;
        imageCover: string;
        quantity: number;
    };
}

interface CartContextType {
    cartDetails: any;
    cartItems: CartItem[];
    numOfCartItems: number;
    isLoading: boolean;
    addToCart: (productId: string) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    updateCount: (productId: string, count: number) => Promise<void>;
    clearCart: () => Promise<void>;
    getCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { token } = useAuth();
    const [cartDetails, setCartDetails] = useState<any>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [numOfCartItems, setNumOfCartItems] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const getCart = async () => {
        if (!token) {
            setCartItems([]);
            setNumOfCartItems(0);
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 4000));
            const { data } = await axios.get('https://ecommerce.routemisr.com/api/v1/cart', {
                headers: { token }
            });
            if (data.status === 'success') {
                setCartDetails(data.data);
                setCartItems(data.data.products);
                setNumOfCartItems(data.numOfCartItems);
            }
        } catch (error: any) {
            console.error(error);
            if (error.response?.status === 404 || error.response?.status === 500) {
                setCartItems([]);
                setNumOfCartItems(0);
                setCartDetails(null);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getCart();
    }, [token]);

    const addToCart = async (productId: string) => {
        if (!token) {
            toast.error('Please login to add items to cart');
            return;
        }
        try {
            const { data } = await axios.post('https://ecommerce.routemisr.com/api/v1/cart', { productId }, {
                headers: { token }
            });
            if (data.status === 'success') {
                toast.success(data.message);
                setCartItems(data.data.products);
                setNumOfCartItems(data.numOfCartItems);
                setCartDetails(data.data);
            }
        } catch (error: any) {
            toast.error('Failed to add to cart');
            console.error(error);
        }
    };

    const removeFromCart = async (productId: string) => {
        if (!token) return;
        try {
            const { data } = await axios.delete(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, {
                headers: { token }
            });
            if (data.status === 'success') {
                toast.success('Item removed from cart');
                setCartItems(data.data.products);
                setNumOfCartItems(data.numOfCartItems);
                setCartDetails(data.data);
            }
        } catch (error) {
            toast.error('Failed to remove item');
            console.error(error);
        }
    };

    const updateCount = async (productId: string, count: number) => {
        if (!token) return;
        if (count < 1) return;
        try {
            const { data } = await axios.put(`https://ecommerce.routemisr.com/api/v1/cart/${productId}`, { count }, {
                headers: { token }
            });
            if (data.status === 'success') {
                setCartItems(data.data.products);
                setNumOfCartItems(data.numOfCartItems);
                setCartDetails(data.data);
                toast.success('Cart updated');
            }
        } catch (error) {
            toast.error('Failed to update cart');
            console.error(error);
        }
    };

    const clearCart = async () => {
        if (!token) return;
        try {
            const { data } = await axios.delete('https://ecommerce.routemisr.com/api/v1/cart', {
                headers: { token }
            });
            if (data.message === 'success') {
                setCartItems([]);
                setNumOfCartItems(0);
                setCartDetails(null);
                toast.success('Cart cleared');
            }
        } catch (error) {
            toast.error('Failed to clear cart');
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cartDetails, cartItems, numOfCartItems, isLoading, addToCart, removeFromCart, updateCount, clearCart, getCart }}>
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

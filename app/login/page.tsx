"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { loginSchema } from '@/app/lib/validators/login.schema';
import toast from "react-hot-toast";
import { useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const { login, isLoading } = useAuth();
    const searchParams = useSearchParams();
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Show message if redirected from protected route
    useEffect(() => {
        const redirect = searchParams.get('redirect');
        if (redirect) {
            toast.error('Please login to access this page');
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        // Validate form data
        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            setErrors(fieldErrors);
            
            // Show first error in toast
            const firstError = Object.values(fieldErrors)[0]?.[0];
            if (firstError) {
                toast.error(firstError);
            }
            return;
        }

        try {
            await login(result.data);
        } catch (error: any) {
            // Errors are handled by axios interceptor and AuthContext
            console.error('Login error:', error);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex">
            {/* Left — Branding */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
                    <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
                        <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">FreshCart</h2>
                    <p className="text-white/80 text-lg max-w-sm leading-relaxed">
                        Your One-Stop Shop for Fresh Products. Join thousands of happy customers who trust FreshCart for their daily needs.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">Welcome Back!</h1>
                    <p className="text-[var(--text-gray)] mb-8">Sign in to continue your fresh shopping experience</p>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className={`w-full px-4 py-3 rounded-xl border ${
                                    errors.email 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
                                } outline-none focus:ring-2 transition-all text-sm bg-[var(--bg-light)]`}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                                Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                className={`w-full px-4 py-3 rounded-xl border ${
                                    errors.password 
                                        ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                                        : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
                                } outline-none focus:ring-2 transition-all text-sm bg-[var(--bg-light)]`}
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-[var(--border)] text-[var(--primary)] focus:ring-[var(--primary)]" 
                                />
                                <span className="text-sm text-[var(--text-gray)]">Remember me</span>
                            </label>
                            <Link 
                                href="/forgot-password" 
                                className="text-sm text-[var(--primary)] font-semibold hover:text-[var(--primary-dark)] transition-colors"
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-colors shadow-sm shadow-[var(--primary)]/20 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>

                    <p className="text-center text-sm text-[var(--text-gray)] mt-8">
                        New to FreshCart?{" "}
                        <Link 
                            href="/register" 
                            className="text-[var(--primary)] font-semibold hover:text-[var(--primary-dark)] transition-colors"
                        >
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { registerSchema } from "@/app/lib/validators/register.schema";

export default function RegisterPage() {
  const { register, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string[]>>({});

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
    const result = registerSchema.safeParse(formData);

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
      await register(result.data);
    } catch (error: any) {
      // Errors are handled by axios interceptor and AuthContext
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex">
      {/* Left — Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 via-emerald-600 to-green-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-center">
          <div className="w-16 h-16 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-8 border border-white/20">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Join FreshCart</h2>
          <p className="text-white/80 text-lg max-w-sm leading-relaxed">
            Create your account and enjoy exclusive deals, faster checkout, and personalized recommendations.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[var(--text-dark)] mb-2">Create Account</h1>
          <p className="text-[var(--text-gray)] mb-8">Join FreshCart and start your fresh shopping experience</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.name 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
                } outline-none focus:ring-2 transition-all text-sm bg-[var(--bg-light)]`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name[0]}</p>
              )}
            </div>

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
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
                } outline-none focus:ring-2 transition-all text-sm bg-[var(--bg-light)]`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone[0]}</p>
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
                placeholder="Create a password"
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

            <div>
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                Confirm Password
              </label>
              <input
                name="rePassword"
                type="password"
                required
                value={formData.rePassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.rePassword 
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200' 
                    : 'border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary-light)]'
                } outline-none focus:ring-2 transition-all text-sm bg-[var(--bg-light)]`}
              />
              {errors.rePassword && (
                <p className="mt-1 text-sm text-red-600">{errors.rePassword[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[var(--primary)] text-white rounded-xl font-bold text-sm hover:bg-[var(--primary-dark)] transition-colors shadow-sm shadow-[var(--primary)]/20 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--text-gray)] mt-8">
            Already have an account?{" "}
            <Link 
              href="/login" 
              className="text-[var(--primary)] font-semibold hover:text-[var(--primary-dark)] transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import Link from "next/link";
import {
  Truck,
  RotateCcw,
  ShieldCheck,
  Headset,
  Facebook,
  Twitter,
  Instagram,
  Phone,
  Mail,
  MapPin,
  ShoppingCart,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full">
      {/* Top Features Bar */}
      <div className="bg-emerald-50 border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Feature icon={<Truck />} title="Free Shipping" desc="On orders over 500 EGP" />
          <Feature icon={<RotateCcw />} title="Easy Returns" desc="14-day return policy" />
          <Feature icon={<ShieldCheck />} title="Secure Payment" desc="100% secure checkout" />
          <Feature icon={<Headset />} title="24/7 Support" desc="Contact us anytime" />
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Brand */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold">
                Fresh<span className="text-emerald-500">Cart</span>
              </span>
            </Link>

            <p className="text-white/60 text-sm max-w-sm">
              FreshCart is your one-stop destination for quality products. From fashion to electronics,
              we bring you the best brands at competitive prices.
            </p>

            <div className="space-y-3 text-sm text-white/70">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-emerald-400" />
                +1 (800) 123-4567
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400" />
                support@freshcart.com
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-emerald-400" />
                123 Commerce Street, New York, NY
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Social icon={<Facebook />} />
              <Social icon={<Twitter />} />
              <Social icon={<Instagram />} />
            </div>
          </div>

          {/* Links */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <Column title="Shop" links={[
              "All Products", "Categories", "Brands", "Electronics", "Men's Fashion", "Women's Fashion"
            ]} />

            <Column title="Account" links={[
              "My Account", "Order History", "Wishlist", "Shopping Cart", "Sign In", "Create Account"
            ]} />

            <Column title="Support" links={[
              "Contact Us", "Help Center", "Shipping Info", "Returns & Refunds", "Track Order"
            ]} />

            <Column title="Legal" links={[
              "Privacy Policy", "Terms of Service", "Cookie Policy"
            ]} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <span>© 2026 FreshCart. All rights reserved.</span>
            <span>Visa · Mastercard · PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ===== Helpers ===== */

function Feature({ icon, title, desc }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-900">{title}</p>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function Column({ title, links }: any) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold uppercase tracking-widest">{title}</h4>
      <ul className="space-y-3 text-sm text-white/60">
        {links.map((l: string, i: number) => (
          <li key={i} className="hover:text-emerald-400 transition">{l}</li>
        ))}
      </ul>
    </div>
  );
}

function Social({ icon }: any) {
  return (
    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 transition">
      {icon}
    </div>
  );
}

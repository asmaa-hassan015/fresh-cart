

import Link from "next/link";
import { getProducts, getCategories } from "./lib/api";
import ProductCard from "./components/ProductCard";
import CategoryCard from "./components/CategoryCard";
import HeroSlider from "./components/HeroSlider";

const FEATURE_BADGES = [
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H6.375c-.621 0-1.125-.504-1.125-1.125V14.25m17.25 0V3.375c0-.621-.504-1.125-1.125-1.125H6.375c-.621 0-1.125.504-1.125 1.125v10.875m16.5 0h-16.5" />
      </svg>
    ),
    title: "Free Shipping",
    desc: "On orders over 500 EGP",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: "Secure Payment",
    desc: "100% secure checkout",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
    title: "Easy Returns",
    desc: "14-day return policy",
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
  {
    icon: (
      <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    title: "24/7 Support",
    desc: "Contact us anytime",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
];

const PROMO_BANNERS = [
  {
    id: "organic-fruits",
    badge: {
      icon: <div className="h-2 w-2 animate-pulse rounded-full bg-red-500" />,
      text: "Deal of the Day",
    },
    gradient: "from-emerald-400 to-teal-500",
    title: "Fresh Organic Fruits",
    description: "Get up to 40% off on selected organic fruits",
    discount: "40% OFF",
    code: "ORGANIC40",
    cta: {
      text: "Shop Now",
      href: "/products",
      color: "text-emerald-600",
    },
  },
  {
    id: "exotic-vegetables",
    badge: {
      icon: (
        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ),
      text: "New Arrivals",
    },
    gradient: "from-orange-400 via-red-400 to-pink-500",
    title: "Exotic Vegetables",
    description: "Discover our latest collection of premium vegetables",
    discount: "25% OFF",
    code: "FRESH25",
    cta: {
      text: "Explore Now",
      href: "/products?sort=newest",
      color: "text-orange-600",
    },
  },
];

const NEWSLETTER_BENEFITS = [
  { text: "Fresh Picks Weekly" },
  { text: "Free Delivery Codes" },
  { text: "Members-Only Deals", hideOnMobile: true },
];

const APP_STORES = [
  {
    id: "app-store",
    icon: (
      <svg className="h-7 w-7 shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
    ),
    subtitle: "Download on",
    title: "App Store",
    href: "#",
  },
  {
    id: "google-play",
    icon: (
      <svg className="h-7 w-7 shrink-0 text-white" viewBox="0 0 24 24" fill="currentColor">
        <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.92V2.734a1 1 0 01.609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-1.4l2.584 1.498c.486.282.486 1.108 0 1.39l-2.584 1.498-2.545-2.545 2.545-2.545v.004zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
      </svg>
    ),
    subtitle: "Get it on",
    title: "Google Play",
    href: "#",
  },
];

const ArrowIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="h-4 w-4 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FeatureBadge = ({ feature }: { feature: typeof FEATURE_BADGES[0] }) => (
  <div className="flex items-center gap-4">
    <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-xl ${feature.bgColor} ${feature.color}`}>
      {feature.icon}
    </div>
    <div>
      <h4 className="text-base font-semibold text-gray-900">{feature.title}</h4>
      <p className="text-sm text-gray-500">{feature.desc}</p>
    </div>
  </div>
);

const FeatureBadgeSmall = ({ feature }: { feature: typeof FEATURE_BADGES[0] }) => (
  <div className="flex items-center gap-3">
    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${feature.bgColor} ${feature.color}`}>
      {feature.icon}
    </div>
    <div>
      <h4 className="text-sm font-semibold text-gray-900">{feature.title}</h4>
      <p className="text-xs text-gray-500">{feature.desc}</p>
    </div>
  </div>
);

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts(40),
    getCategories(),
  ]);

  return (
    <div>
      {/* Hero Slider */}
      <HeroSlider />

      {/* Feature Badges */}
      <section className="border-y border-gray-100 bg-white">
        <div className="mx-auto w-auto px-4 py-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FEATURE_BADGES.map((feature) => (
              <FeatureBadge key={feature.title} feature={feature} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop By Category */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
            Shop By <span className="text-primary-600">Category</span>
          </h2>
          <Link
            href="/categories"
            className="hidden items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:flex"
          >
            View All Categories
            <ArrowIcon />
          </Link>
        </div>
        
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>

        {/* Promo Banners */}
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROMO_BANNERS.map((banner) => (
            <div
              key={banner.id}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${banner.gradient} p-8`}
            >
              <div className="absolute left-4 top-4">
                <div className="flex items-center gap-2 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
                  {banner.badge.icon}
                  <span className="text-xs font-semibold text-white">{banner.badge.text}</span>
                </div>
              </div>
              
              <div className="relative z-10 mt-10">
                <h3 className="mb-2 text-2xl font-bold text-white md:text-3xl">
                  {banner.title}
                </h3>
                <p className="mb-3 text-sm text-white/90">{banner.description}</p>
                
                <div className="mb-5">
                  <div className="mb-2 inline-block rounded-lg bg-white/20 px-4 py-2 backdrop-blur-sm">
                    <span className="text-3xl font-bold text-white">{banner.discount}</span>
                  </div>
                  <p className="text-xs text-white/80">
                    Use code: <span className="font-mono font-bold text-white">{banner.code}</span>
                  </p>
                </div>
                
                <Link
                  href={banner.cta.href}
                  className={`inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold shadow-lg transition-all hover:bg-white/90 ${banner.cta.color}`}
                >
                  {banner.cta.text}
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
              Featured <span className="text-primary-600">Products</span>
            </h2>
            <Link
              href="/products"
              className="hidden items-center gap-2 text-sm font-semibold text-primary-600 transition-colors hover:text-primary-700 sm:flex"
            >
              View All
              <ArrowIcon />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
          <div className="mt-6 text-center sm:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
            >
              View All Products
              <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter + App Download Section */}
      <section className="border-t border-gray-100 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            {/* Newsletter */}
            <div className="rounded-2xl bg-white p-6 shadow-sm lg:p-8">
              <div className="mb-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-600">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="mb-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    NEWSLETTER
                  </div>
                  <h3 className="mb-1 text-2xl font-bold text-gray-900">
                    Get the Freshest Updates <span className="text-primary-600">Delivered Free</span>
                  </h3>
                  <p className="text-sm text-gray-600">
                    Weekly recipes, seasonal offers & exclusive member perks.
                  </p>
                </div>
              </div>

              <div className="mb-4 flex gap-2">
                {NEWSLETTER_BENEFITS.map((benefit) => (
                  <div
                    key={benefit.text}
                    className={`flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-sm ${benefit.hideOnMobile ? 'hidden sm:flex' : ''}`}
                  >
                    <CheckIcon />
                    <span className="font-medium text-gray-700">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="mb-3 flex gap-2">
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3.5 text-sm outline-none transition-all focus:border-primary-600 focus:ring-2 focus:ring-primary-600/20"
                />
                <button className="shrink-0 rounded-xl bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white shadow-md shadow-green-500/20 transition-colors hover:bg-primary-700">
                  Subscribe
                </button>
              </div>
              
              <p className="flex items-center gap-1.5 text-xs text-gray-500">
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Unsubscribe anytime. No spam, ever.
              </p>
            </div>

            {/* Mobile App */}
            <div className="rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 text-white shadow-xl lg:p-8">
              <div className="mb-3 inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                📱 MOBILE APP
              </div>
              <h3 className="mb-2 text-xl font-bold lg:text-2xl">Shop Faster on Our App</h3>
              <p className="mb-5 text-sm text-white/70">Get app-exclusive deals & 15% off your first order.</p>
              
              <div className="mb-5 space-y-2.5">
                {APP_STORES.map((store) => (
                  <a
                    key={store.id}
                    href={store.href}
                    className="group flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/15"
                  >
                    {store.icon}
                    <div className="flex-1 text-left">
                      <p className="text-[10px] leading-none text-white/50">{store.subtitle}</p>
                      <p className="text-base font-semibold leading-snug text-white">{store.title}</p>
                    </div>
                    <svg className="h-5 w-5 text-white/40 transition-colors group-hover:text-white/60" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                ))}
              </div>

              <div className="flex items-center gap-2 border-t border-white/10 pt-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm text-white/70">4.9 · 100K+ downloads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Feature Bar */}
      <section className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {FEATURE_BADGES.map((feature) => (
              <FeatureBadgeSmall key={`bottom-${feature.title}`} feature={feature} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Link from "next/link";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const SLIDES = [
  {
    id: 1,
    title: "Fast & Free Delivery",
    subtitle: "Same day delivery available",
    image: "/hero-slider-img.png",
    primaryBtn: "Order Now",
    secondaryBtn: "Delivery Info",
    href: "/products"
  },
  { 
    id: 2,
    title: "Premium Quality Guaranteed",
    subtitle: "Fresh from farm to your table",
    image: "/hero-slider-img.png",
    primaryBtn: "Shop Now",
    secondaryBtn: "Learn More",
    href: "/products"
  },
  {
    id: 3,
    title: "Organic & Fresh Products",
    subtitle: "100% natural and healthy",
    image: "/hero-slider-img.png",
    primaryBtn: "Browse Now",
    secondaryBtn: "About Us",
    href: "/products"
  }
];

export default function HeroSlider() {
  const [swiperInstance, setSwiperInstance] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="group relative h-[400px] w-full md:h-[500px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        loop={true}
        speed={800}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        onSwiper={setSwiperInstance}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full w-full"
      >
        {SLIDES.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div 
              className="relative h-full w-full"
              style={{
                backgroundImage: `url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center center'
              }}
            >
              {/* Green Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/90 via-green-600/50 to-green-400/30" />

              {/* Content Container */}
              <div className="container relative mx-auto h-full">
                <div className="flex h-full items-center justify-start px-6 md:px-12">
                  <div className="max-w-xl space-y-4 text-white">
                    <h2 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                      {slide.title}
                    </h2>
                    <p className="text-lg font-normal opacity-90 md:text-xl">
                      {slide.subtitle}
                    </p>
                    
                    <div className="flex gap-4 pt-4">
                      <Link 
                        href={slide.href}
                        className="inline-block rounded-lg border-2 border-white bg-white px-8 py-3 font-semibold text-green-700 transition-all hover:scale-105 hover:bg-neutral-100"
                      >
                        {slide.primaryBtn}
                      </Link>
                      <Link 
                        href="#"
                        className="inline-block rounded-lg border-2 border-white bg-transparent px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:bg-white/10"
                      >
                        {slide.secondaryBtn}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}

        {/* Custom Navigation Arrows - Fixed */}
        <button 
          onClick={() => swiperInstance?.slidePrev()}
          className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-700 shadow-lg transition-all hover:scale-110 md:left-8"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button 
          onClick={() => swiperInstance?.slideNext()}
          className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white text-green-700 shadow-lg transition-all hover:scale-110 md:right-8"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </Swiper>

      {/* Custom Functional Pagination Dots */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperInstance?.slideToLoop(index)}
            className={`transition-all duration-300 ${
              activeIndex === index
                ? "h-3 w-8 rounded-md bg-white"
                : "h-3 w-3 rounded-full bg-white/60 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import WaveDivider from '@/components/ui/WaveDivider';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

// Slides with both desktop and mobile images
const slides = [
  {
    id: 1,
    title: 'Premium Peanut Butter',
    subtitle: '100% Natural & Healthy',
    description: 'Made with high-quality roasted peanuts. No added sugar, no preservatives.',
    cta: 'Shop Now',
    link: '/products?category=peanut-butter',
    desktopImage: '/images/hero/hero-desktop-1.jpg',
    mobileImage: '/images/hero/hero-mobile-1.jpg',
    bgColor: '#633bb1',
    textPosition: 'left', // left, center, right
  },
  {
    id: 2,
    title: 'Delicious Oats',
    subtitle: 'Start Your Day Right',
    description: 'Protein-packed oats in amazing flavors. Fuel your fitness journey!',
    cta: 'Explore Oats',
    link: '/products?category=oats',
    desktopImage: '/images/hero/hero-desktop-2.jpg',
    mobileImage: '/images/hero/hero-mobile-2.jpg',
    bgColor: '#fedd00',
    textPosition: 'center',
  },
  {
    id: 3,
    title: 'Bundle & Save',
    subtitle: 'Up to 30% Off',
    description: 'Get more for less with our specially curated bundles.',
    cta: 'View Bundles',
    link: '/products?category=bundles',
    desktopImage: '/images/hero/hero-desktop-3.jpg',
    mobileImage: '/images/hero/hero-mobile-3.jpg',
    bgColor: '#633bb1',
    textPosition: 'right',
  },
];

export default function HeroSlider() {
  return (
    <section className="relative">
      {/* Desktop Slider */}
      <div className="hidden md:block">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          navigation
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="aspect-[2.6/1]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full" style={{ backgroundColor: slide.bgColor }}>
                {/* Background Image */}
                <Image
                  src={slide.desktopImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  onError={(e) => {
                    // Fallback if image doesn't exist
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Overlay gradient for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex items-center">
                  <div className="max-w-7xl mx-auto px-8 lg:px-16 w-full">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6 }}
                      className={`max-w-lg ${
                        slide.textPosition === 'center'
                          ? 'mx-auto text-center'
                          : slide.textPosition === 'right'
                          ? 'ml-auto text-right'
                          : ''
                      }`}
                    >
                      <span className="inline-block px-4 py-1.5 bg-accent-500 text-primary-500 rounded-full text-sm font-bold mb-4">
                        {slide.subtitle}
                      </span>
                      <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 font-display leading-tight">
                        {slide.title}
                      </h1>
                      <p className="text-lg lg:text-xl text-white/90 mb-8">
                        {slide.description}
                      </p>
                      <Link href={slide.link} className="btn-accent">
                        {slide.cta}
                      </Link>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Slider */}
      <div className="md:hidden">
        <Swiper
          modules={[Autoplay, Pagination]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop
          className="aspect-[0.85/1]"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative w-full h-full" style={{ backgroundColor: slide.bgColor }}>
                {/* Background Image */}
                <Image
                  src={slide.mobileImage}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={slide.id === 1}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Content - positioned at bottom for mobile */}
                <div className="absolute bottom-0 left-0 right-0 p-6 pb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                  >
                    <span className="inline-block px-3 py-1 bg-accent-500 text-primary-500 rounded-full text-xs font-bold mb-3">
                      {slide.subtitle}
                    </span>
                    <h1 className="text-2xl font-bold text-white mb-2 font-display">
                      {slide.title}
                    </h1>
                    <p className="text-sm text-white/80 mb-4 line-clamp-2">
                      {slide.description}
                    </p>
                    <Link href={slide.link} className="btn-accent text-sm px-6 py-2.5">
                      {slide.cta}
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <WaveDivider color="#fedd00" />
      </div>
    </section>
  );
}

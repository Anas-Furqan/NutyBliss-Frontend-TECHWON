'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ui/ProductCard';
import { productsAPI } from '@/lib/api';
import { gsap, initGSAP } from '@/lib/gsap';
import { Product } from '@/types';

const homeFeatures = [
  '100% roasted peanut core',
  'No static interactions, fully fluid',
  'Premium organic visual language',
];

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const { data } = await productsAPI.getAll({ featured: true, limit: 3 });
        setFeaturedProducts(data?.products || []);
      } catch {
        setFeaturedProducts([]);
      }
    };
    loadFeatured();
  }, []);

  useEffect(() => {
    initGSAP();
    const root = sectionRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.from('[data-feature-card]', {
        y: 32,
        autoAlpha: 0,
        duration: 0.55,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '[data-feature-wrap]',
          start: 'top 80%',
        },
      });

      gsap.from('[data-product-card]', {
        autoAlpha: 0,
        y: 40,
        duration: 0.65,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '[data-home-products]',
          start: 'top 70%',
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={sectionRef} className="bg-surface pb-16 pt-8">
      <Hero />

      <section data-feature-wrap className="relative z-20 mx-auto mt-20 grid w-[min(1200px,92vw)] gap-4 pb-20 md:grid-cols-3">
        {homeFeatures.map((item) => (
          <article key={item} data-feature-card className="glass-card p-6">
            <p className="font-display text-2xl text-ink">{item}</p>
          </article>
        ))}
      </section>

      <section data-home-products className="relative z-20 mx-auto w-[min(1200px,92vw)] pb-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Featured Collection</p>
            <h2 className="mt-3 font-display text-5xl tracking-tighter leading-tight text-slate-200">Scroll-Revealed Favorites</h2>
          </div>
          <Link href="/shop" className="btn-secondary">View all</Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredProducts.map((product) => (
            <div key={product._id} data-product-card>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


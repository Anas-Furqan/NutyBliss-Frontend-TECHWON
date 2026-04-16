'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NutyProduct } from '@/lib/site-data';
import { gsap, initGSAP } from '@/lib/gsap';
import { useCartStore } from '@/store';
import type { Product as StoreProduct } from '@/types';
import toast from 'react-hot-toast';

type Props = {
  product: NutyProduct;
};

export default function ProductCard({ product }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const isDarkVisual = /cacao|classic-roast|crunchy-bites/i.test(product.slug);

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const readNutrition = (key: string) => {
      const value = product.nutrition.find((entry) => entry.key.toLowerCase() === key.toLowerCase())?.value;
      const match = value?.match(/\d+/);
      return match ? Number(match[0]) : undefined;
    };

    const cartProduct: StoreProduct = {
      _id: product.id,
      title: product.name,
      slug: product.slug,
      description: product.description,
      images: [{ url: product.image, alt: product.name }],
      category: product.category.toLowerCase(),
      variants: [{ size: '340g', price: product.price, stock: 100 }],
      basePrice: product.price,
      totalStock: 100,
      rating: { average: 4.8, count: 40 },
      ingredients: product.ingredients,
      nutritionFacts: {
        servingSize: product.nutrition.find((entry) => entry.key.toLowerCase() === 'serving')?.value,
        calories: readNutrition('Calories'),
        protein: readNutrition('Protein'),
        carbs: readNutrition('Carbs'),
        fat: readNutrition('Fat'),
      },
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };

    addItem(cartProduct, 1, { size: '340g', price: product.price });
    toast.success(`${product.name} added to cart`);
  };

  useEffect(() => {
    initGSAP();
    const el = cardRef.current;
    if (!el) return;

    const imageEl = el.querySelector('[data-jar]');
    const overlayEl = el.querySelector('[data-overlay]');
    const glowEl = el.querySelector('[data-glow]');
    if (!imageEl || !overlayEl || !glowEl) return;

    const onEnter = () => {
      gsap.to(imageEl, { scale: 1.05, rotate: 0, duration: 0.55, ease: 'power2.out' });
      gsap.to(overlayEl, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' });
      gsap.to(glowEl, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
    };
    const onLeave = () => {
      gsap.to(imageEl, { scale: 1, rotate: 0, duration: 0.45, ease: 'power2.out' });
      gsap.to(overlayEl, { autoAlpha: 0, y: 20, duration: 0.25, ease: 'power1.out' });
      gsap.to(glowEl, { autoAlpha: 0, scale: 0.4, duration: 0.35, ease: 'power1.out' });
    };

    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <Link href={`/products/${product.slug}`} className="group block cursor-pointer">
      <article ref={cardRef} className="glass-card relative overflow-hidden p-4">
        <div
          data-glow
          className="pointer-events-none absolute inset-0 z-0 opacity-0"
          style={{
            transform: 'scale(0.4)',
            background:
              'radial-gradient(circle at 25% 30%, rgba(255,140,0,0.28) 0%, transparent 50%), radial-gradient(circle at 75% 70%, rgba(75,0,130,0.24) 0%, transparent 55%)',
          }}
        />
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#11111a]">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: isDarkVisual
                ? 'radial-gradient(circle at 50% 45%, rgba(255,227,170,0.46) 0%, rgba(255,196,118,0.28) 35%, transparent 72%)'
                : 'radial-gradient(circle at 50% 45%, rgba(255,180,90,0.22) 0%, rgba(255,140,0,0.14) 35%, transparent 72%)',
            }}
          />
          <div data-jar className="relative h-full w-full will-change-transform">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div data-overlay className="absolute inset-x-3 bottom-3 translate-y-5 rounded-xl border border-white/10 bg-black/65 p-3 opacity-0 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.16em] text-amber-400">Nutrition Snapshot</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-white">
              {product.nutrition.slice(0, 4).map((entry) => (
                <p key={entry.key}>
                  {entry.key}: <span className="font-semibold text-amber-300">{entry.value}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-slate-300/80">{product.category}</p>
        <h3 className="mt-2 font-display text-2xl tracking-tighter leading-tight text-slate-200">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-300/85">{product.tagline}</p>
        <p className="mt-3 text-lg font-semibold text-amber-400">PKR {product.price.toLocaleString()}</p>
        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffc261] via-[#ff9f1a] to-[#ff8c00] px-5 py-3 text-sm font-bold text-[#1f1307] shadow-[0_16px_30px_rgba(255,140,0,0.45)] transition-all duration-300 hover:brightness-110"
        >
          Add to Cart
        </button>
      </article>
    </Link>
  );
}

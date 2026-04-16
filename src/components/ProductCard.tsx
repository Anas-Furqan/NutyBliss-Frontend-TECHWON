'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { NutyProduct } from '@/lib/site-data';
import { gsap, initGSAP } from '@/lib/gsap';

type Props = {
  product: NutyProduct;
};

export default function ProductCard({ product }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    const el = cardRef.current;
    if (!el) return;

    const imageEl = el.querySelector('[data-jar]');
    const overlayEl = el.querySelector('[data-overlay]');
    if (!imageEl || !overlayEl) return;

    const onEnter = () => {
      gsap.to(imageEl, { scale: 1.08, rotate: 3, duration: 0.7, ease: 'elastic.out(1, 0.55)' });
      gsap.to(overlayEl, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power2.out' });
    };
    const onLeave = () => {
      gsap.to(imageEl, { scale: 1, rotate: 0, duration: 0.45, ease: 'power2.out' });
      gsap.to(overlayEl, { autoAlpha: 0, y: 20, duration: 0.25, ease: 'power1.out' });
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
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f4e8d8]">
          <div data-jar className="relative h-full w-full">
            <Image src={product.image} alt={product.name} fill className="object-cover" />
          </div>
          <div data-overlay className="absolute inset-x-3 bottom-3 rounded-xl bg-white/88 p-3 opacity-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-primary">Nutrition Snapshot</p>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs text-ink">
              {product.nutrition.slice(0, 4).map((entry) => (
                <p key={entry.key}>
                  {entry.key}: <span className="font-semibold">{entry.value}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.16em] text-primary/80">{product.category}</p>
        <h3 className="mt-2 font-display text-2xl text-ink">{product.name}</h3>
        <p className="mt-1 text-sm text-ink/75">{product.tagline}</p>
        <p className="mt-3 text-lg font-semibold text-primary">PKR {product.price.toLocaleString()}</p>
      </article>
    </Link>
  );
}

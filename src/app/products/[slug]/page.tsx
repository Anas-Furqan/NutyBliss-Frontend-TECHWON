'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nutyProducts } from '@/lib/site-data';
import { useCartStore } from '@/store';
import { gsap, initGSAP } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const slugValue = Array.isArray(slug) ? slug[0] : slug;
  const product = nutyProducts.find((item) => item.slug === slugValue);
  const [quantity, setQuantity] = useState(1);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();

  useEffect(() => {
    initGSAP();
    if (!imageWrapRef.current) return;
    const root = imageWrapRef.current;
    const ctx = gsap.context(() => {
      gsap.from('[data-ingredient]', {
        x: -25,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.45,
        scrollTrigger: {
          trigger: '[data-ingredients]',
          start: 'top 78%',
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-surface pt-28 text-ink">
        Product not found.
      </main>
    );
  }

  return (
    <main className="bg-surface pb-20 pt-32">
      <section className="mx-auto grid w-[min(1200px,92vw)] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={imageWrapRef} className="sticky top-28 h-fit">
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-primary/80">Back to shop</Link>
          <div className="group relative mt-4 aspect-square overflow-hidden rounded-[2rem] bg-[#f1e1cd]">
            <Image src={product.image} alt={product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
          <div className="mt-4 rounded-xl bg-white/80 p-3 backdrop-blur">
            <Image src={product.labelImage} alt="Nutrition label reference" width={220} height={120} className="rounded-lg" />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary/75">{product.category}</p>
          <h1 className="mt-3 font-display text-6xl text-ink">{product.name}</h1>
          <p className="mt-4 max-w-2xl text-ink/80">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-primary">PKR {product.price.toLocaleString()}</p>

          <div className="mt-6 flex items-center gap-3">
            <button className="btn-secondary !px-3" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span className="min-w-8 text-center text-ink">{quantity}</span>
            <button className="btn-secondary !px-3" onClick={() => setQuantity((q) => q + 1)}>+</button>
            <Button
              className="ml-2"
              onClick={() =>
                addItem(
                  {
                    _id: product.id,
                    title: product.name,
                    slug: product.slug,
                    description: product.description,
                    images: [{ url: product.image }],
                    category: product.category.toLowerCase(),
                    variants: [],
                    basePrice: product.price,
                    totalStock: 100,
                    rating: { average: 4.8, count: 40 },
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    ingredients: product.ingredients,
                    nutritionFacts: {
                      servingSize: product.nutrition[0]?.value,
                    },
                  },
                  quantity,
                )
              }
            >
              Add to Cart
            </Button>
          </div>

          <GlassCard className="mt-10 p-6">
            <h2 className="font-display text-3xl text-ink">Nutrition Table</h2>
            <div className="mt-4 grid gap-2">
              {product.nutrition.map((entry) => (
                <p key={entry.key} className="flex justify-between border-b border-primary/10 py-1 text-sm">
                  <span>{entry.key}</span>
                  <span className="font-semibold text-ink">{entry.value}</span>
                </p>
              ))}
            </div>
          </GlassCard>

          <section data-ingredients className="mt-10">
            <h2 className="font-display text-3xl text-ink">Ingredients</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {product.ingredients.map((item) => (
                <span key={item} data-ingredient className="rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-sm text-ink">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}


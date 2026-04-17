'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { productsAPI } from '@/lib/api';
import { useAuthStore, useCartStore } from '@/store';
import { gsap, initGSAP } from '@/lib/gsap';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { Product } from '@/types';
import AuthGateModal from '@/components/ui/AuthGateModal';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const slugValueRaw = Array.isArray(slug) ? slug[0] : slug;
  const slugValue = decodeURIComponent(String(slugValueRaw || '')).trim().toLowerCase();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthGate, setShowAuthGate] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!slugValue) return;
        const { data } = await productsAPI.getOne(slugValue);
        setProduct(data?.product || null);
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slugValue]);

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

  if (loading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-surface pt-28 text-ink">
        Loading product...
      </main>
    );
  }

  if (!product) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-surface pt-28 text-ink">
        Product not found.
      </main>
    );
  }

  return (
    <main className="bg-surface pb-32 pt-32">
      <section className="mx-auto grid w-[min(1200px,92vw)] gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div ref={imageWrapRef} className="sticky top-28 h-fit">
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-primary/80">Back to shop</Link>
          <div className="group relative mt-4 aspect-square overflow-hidden rounded-[2rem] border border-white/[0.08] bg-white/[0.03]">
            <Image src={product.images?.[0]?.url || '/images/placeholder.svg'} alt={product.title} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-primary/75">{product.category}</p>
          <h1 className="mt-3 font-display text-6xl tracking-tighter leading-tight text-slate-200">{product.title}</h1>
          <p className="mt-4 max-w-2xl text-slate-300/80">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-primary">PKR {(product.baseDiscountPrice || product.basePrice).toLocaleString()}</p>

          <div className="mt-6 flex items-center gap-3">
            <button className="btn-secondary !px-3" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span className="min-w-8 text-center text-slate-200">{quantity}</span>
            <button className="btn-secondary !px-3" onClick={() => setQuantity((q) => q + 1)}>+</button>
            <Button
              className="ml-2"
              onClick={() => {
                if (!isAuthenticated) {
                  setShowAuthGate(true);
                  return;
                }
                addItem(product, quantity, product.variants?.[0] ? {
                  size: product.variants[0].size,
                  price: product.variants[0].discountPrice || product.variants[0].price,
                } : undefined);
                toast.success('Added to cart');
              }}
            >
              Add to Cart
            </Button>
          </div>

          <GlassCard className="mt-10 p-6">
            <h2 className="font-display text-3xl tracking-tighter leading-tight text-slate-200">Nutrition Table</h2>
            <div className="mt-4 grid gap-2">
              {Object.entries(product.nutritionFacts || {}).map(([key, value]) => (
                <p key={key} className="flex justify-between border-b border-primary/10 py-1 text-sm text-slate-300">
                  <span className="capitalize">{key}</span>
                  <span className="font-semibold text-slate-200">{String(value)}</span>
                </p>
              ))}
            </div>
          </GlassCard>

          <section data-ingredients className="mt-10">
            <h2 className="font-display text-3xl tracking-tighter leading-tight text-slate-200">Ingredients</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(product.ingredients || []).map((item) => (
                <span key={item} data-ingredient className="rounded-full border border-primary/20 bg-white/[0.05] px-4 py-2 text-sm text-slate-200">
                  {item}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
      <AuthGateModal open={showAuthGate} onClose={() => setShowAuthGate(false)} />
    </main>
  );
}


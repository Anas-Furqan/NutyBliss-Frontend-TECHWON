'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef } from 'react';
import { useAuthStore, useCartStore } from '@/store';
import { gsap } from '@/lib/gsap';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const progressRef = useRef<HTMLDivElement>(null);
  const subtotal = getSubtotal();
  const freeShippingThreshold = 4000;
  const progress = Math.min(1, subtotal / freeShippingThreshold);

  useEffect(() => {
    if (!progressRef.current) return;
    gsap.to(progressRef.current, { width: `${progress * 100}%`, duration: 0.7, ease: 'power2.out' });
  }, [progress]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access your cart');
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <main className="bg-surface pb-20 pt-32">
      <section className="mx-auto w-[min(1100px,92vw)]">
        <h1 className="font-display text-6xl text-ink">Cart Overview</h1>
        <div className="mt-5 rounded-xl bg-white/80 p-4 backdrop-blur">
          <p className="text-sm text-ink/80">Free shipping progress</p>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-primary/10">
            <div ref={progressRef} className="h-full w-0 rounded-full bg-gradient-to-r from-primary to-secondary" />
          </div>
          <p className="mt-2 text-xs text-ink/70">
            {progress >= 1 ? 'Unlocked free shipping.' : `Add PKR ${(freeShippingThreshold - subtotal).toLocaleString()} for free shipping.`}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-8 glass-card p-8 text-center">
            <p className="text-ink">Your cart is empty.</p>
            <Link href="/shop" className="btn-primary mt-4">Browse products</Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="space-y-4">
              {items.map((item) => {
                const price = item.variant?.price || item.product.baseDiscountPrice || item.product.basePrice;
                return (
                  <article key={`${item.productId}-${item.variant?.size ?? 'd'}`} className="glass-card flex gap-4 p-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-xl">
                      <Image src={item.product.images[0]?.url || '/images/placeholder.svg'} alt={item.product.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-ink">{item.product.title}</p>
                      <p className="text-sm text-ink/70">PKR {price.toLocaleString()}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <button className="btn-secondary !px-3" onClick={() => updateQuantity(item.productId, item.variant?.size, Math.max(1, item.quantity - 1))}>-</button>
                        <span className="w-8 text-center text-sm text-ink">{item.quantity}</span>
                        <button className="btn-secondary !px-3" onClick={() => updateQuantity(item.productId, item.variant?.size, item.quantity + 1)}>+</button>
                        <button className="btn-secondary ml-auto !px-3" onClick={() => removeItem(item.productId, item.variant?.size)}>Remove</button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <aside className="glass-card h-fit p-5">
              <h2 className="font-display text-3xl text-ink">Summary</h2>
              <p className="mt-3 flex justify-between text-sm"><span>Items</span><span>{totalItems}</span></p>
              <p className="mt-2 flex justify-between text-sm"><span>Subtotal</span><span>PKR {subtotal.toLocaleString()}</span></p>
              <Link href="/checkout" className="btn-primary mt-5 w-full">Checkout</Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

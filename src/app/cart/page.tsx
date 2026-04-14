'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useCartStore } from '@/store';
import GlobalJar from '@/components/GlobalJar';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[70vh] w-[min(1100px,92vw)] flex-col items-center justify-center gap-6 bg-[#f9f0e4]">
        <GlobalJar size="lg" />
        <h1 className="text-6xl font-semibold tracking-[-0.05em] text-[#2a1b12] md:text-8xl">CART EMPTY</h1>
        <Link href="/shop" className="liquid-btn">Browse shop</Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="flex items-end justify-between gap-6">
          <h1 className="text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl">CART</h1>
          <GlobalJar size="md" />
        </div>
      </section>

      <section className="mx-auto grid w-[min(1200px,92vw)] gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const price = item.variant?.price || item.product.baseDiscountPrice || item.product.basePrice;
            return (
              <motion.article key={`${item.productId}-${item.variant?.size}`} layout className="glass-card">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#ead2b6]">
                    <Image src={item.product.images[0]?.url || '/images/placeholder.svg'} alt={item.product.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xl font-semibold tracking-[-0.02em] text-[#2a1b12]">{item.product.title}</p>
                    <p className="mt-1 text-sm text-[#5b4230]/75">{item.variant?.size || 'Standard'}</p>
                    <p className="mt-2 text-lg text-[#2a1b12]">Rs. {price.toLocaleString()}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-[#b8946f]/40">
                        <button onClick={() => updateQuantity(item.productId, item.variant?.size, Math.max(1, item.quantity - 1))} className="p-2">
                          <FiMinus />
                        </button>
                        <span className="w-8 text-center text-[#2a1b12]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.productId, item.variant?.size, item.quantity + 1)} className="p-2">
                          <FiPlus />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.productId, item.variant?.size)} className="text-[#8f653f]">
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>

        <aside className="glass-card h-fit">
          <p className="text-xs uppercase tracking-[0.18em] text-[#5b4230]/70">Summary</p>
          <div className="mt-5 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span></div>
            <div className="mt-3 flex justify-between border-t border-[#b8946f]/35 pt-3 text-2xl font-semibold text-[#2a1b12]">
              <span>Total</span><span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
          <Link href="/checkout" className="liquid-btn mt-6 w-full">Proceed to checkout</Link>
        </aside>
      </section>
    </div>
  );
}


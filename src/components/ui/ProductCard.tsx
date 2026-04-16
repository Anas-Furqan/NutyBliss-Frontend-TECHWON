'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/types';
import { useAuthStore, useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { useState } from 'react';
import AuthGateModal from '@/components/ui/AuthGateModal';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const isDarkVisual = /cacao|dark|chocolate|classic-roast|crunchy-bites/i.test(product.slug);

  const price = product.baseDiscountPrice || product.basePrice;
  const hasDiscount = product.baseDiscountPrice && product.baseDiscountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.baseDiscountPrice!) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowAuthGate(true);
      return;
    }

    if (product.totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    const defaultVariant = product.variants?.[0];
    addItem(
      product,
      1,
      defaultVariant ? { size: defaultVariant.size, price: defaultVariant.discountPrice || defaultVariant.price } : undefined
    );
    toast.success('Added to cart!');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group relative overflow-hidden rounded-[1.25rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl"
      >
        <Link href={`/products/${product.slug}`}>
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-all duration-500 group-hover:opacity-100"
          style={{
            background:
              'radial-gradient(circle at 30% 25%, rgba(255,140,0,0.25) 0%, transparent 50%), radial-gradient(circle at 70% 75%, rgba(75,0,130,0.22) 0%, transparent 56%)',
            transform: 'scale(1.05)',
          }}
        />

        <div className="relative aspect-square overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 z-[1]"
            style={{
              background: isDarkVisual
                ? 'radial-gradient(circle at 50% 45%, rgba(255,227,170,0.5) 0%, rgba(255,196,118,0.3) 35%, transparent 72%)'
                : 'radial-gradient(circle at 50% 45%, rgba(255,180,90,0.2) 0%, rgba(255,140,0,0.14) 35%, transparent 72%)',
            }}
          />
          <Image
            src={product.images[0]?.url || '/images/placeholder.png'}
            alt={product.title}
            fill
            className="z-[2] object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-[#2e1a08]">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full bg-white/85 px-2 py-0.5 text-xs font-semibold text-[#1a1a1a]">
                NEW
              </span>
            )}
            {product.isHotSelling && (
              <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-semibold text-white">
                HOT
              </span>
            )}
          </div>

          {product.totalStock <= 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55">
              <span className="rounded-full bg-white/90 px-4 py-2 font-bold text-[#171717]">
                Sold Out
              </span>
            </div>
          )}

          {product.totalStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 z-[4] rounded-full border border-white/20 bg-[#090909]/88 p-3 text-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-300 hover:bg-[#ff8c00] hover:text-[#1f1409]"
              aria-label="Quick add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-4 text-left">
          <p className="mb-1 text-xs uppercase tracking-wide text-slate-400">
            {product.category.replace('-', ' ')}
          </p>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold tracking-tighter leading-tight text-slate-200 transition-colors group-hover:text-amber-400">
            {product.title}
          </h3>

          {product.rating.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating.average)
                        ? 'fill-accent-500 text-accent-500'
                        : 'text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-400">({product.rating.count})</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-amber-400">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-slate-500 line-through">
                Rs. {product.basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.variants.slice(0, 3).map((variant, i) => (
                <span key={i} className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-300">
                  {variant.size}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs text-slate-400">+{product.variants.length - 3}</span>
              )}
            </div>
          )}

          {product.totalStock > 0 && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-[#ffc261] via-[#ff9f1a] to-[#ff8c00] px-5 py-3 text-sm font-bold text-[#1f1307] shadow-[0_16px_30px_rgba(255,140,0,0.45)] transition-all duration-300 hover:brightness-110"
            >
              Add to Cart
            </button>
          )}
        </div>
        </Link>
      </motion.div>
      <AuthGateModal open={showAuthGate} onClose={() => setShowAuthGate(false)} />
    </>
  );
}

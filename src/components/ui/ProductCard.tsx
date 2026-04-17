'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/types';
import { useAuthStore, useCartStore } from '@/store';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';
import AuthGateModal from '@/components/ui/AuthGateModal';
import { gsap, initGSAP } from '@/lib/gsap';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [showAuthGate, setShowAuthGate] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const isDarkVisual = /cacao|dark|chocolate|classic-roast|crunchy-bites/i.test(product.slug);

  const price = product.baseDiscountPrice || product.basePrice;
  const hasDiscount = product.baseDiscountPrice && product.baseDiscountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.baseDiscountPrice!) / product.basePrice) * 100)
    : 0;

  useEffect(() => {
    initGSAP();
    const root = cardRef.current;
    const jar = jarRef.current;
    const overlay = overlayRef.current;
    if (!root || !jar || !overlay) return;

    const ctx = gsap.context(() => {
      gsap.set(overlay, { yPercent: 22, autoAlpha: 0 });
      gsap.set(jar, { scale: 1, transformOrigin: '50% 50%' });

      const onEnter = () => {
        gsap.to(jar, { scale: 1.05, duration: 0.55, ease: 'power3.out', force3D: true, overwrite: true });
        gsap.to(overlay, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: 'power3.out', overwrite: true });
      };

      const onLeave = () => {
        gsap.to(jar, { scale: 1, duration: 0.42, ease: 'power3.out', overwrite: true });
        gsap.to(overlay, { yPercent: 22, autoAlpha: 0, duration: 0.4, ease: 'power3.out', overwrite: true });
      };

      root.addEventListener('mouseenter', onEnter);
      root.addEventListener('mouseleave', onLeave);

      return () => {
        root.removeEventListener('mouseenter', onEnter);
        root.removeEventListener('mouseleave', onLeave);
      };
    }, root);

    return () => ctx.revert();
  }, []);

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
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group nut-glow-hover relative overflow-hidden rounded-[1.25rem] border border-gray-200 bg-white shadow-sm"
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
          <div ref={jarRef} className="relative h-full w-full will-change-transform">
            <Image
              src={product.images[0]?.url || '/images/placeholder.png'}
              alt={product.title}
              fill
              className="z-[2] object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          </div>

          <div
            ref={overlayRef}
            className="pointer-events-none absolute inset-x-3 bottom-3 z-[5] rounded-2xl border border-gray-200 bg-white/90 p-3 shadow-sm backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.16em] text-[#5C4033]">Nutrition Facts</p>
              <p className="text-sm font-bold text-amber-300">Rs. {price.toLocaleString()}</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-2 text-[11px] text-[#2D3748]">
              <p>Calories: <span className="text-amber-300">{product.nutritionFacts?.calories ?? '--'}</span></p>
              <p>Protein: <span className="text-amber-300">{product.nutritionFacts?.protein ?? '--'}g</span></p>
              <p>Fat: <span className="text-amber-300">{product.nutritionFacts?.fat ?? '--'}g</span></p>
            </div>
          </div>

          <div className="absolute left-2 top-2 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="rounded-full bg-amber-400 px-2 py-0.5 text-xs font-semibold text-[#2e1a08]">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-[#3E2723]">
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
            <div className="absolute inset-0 flex items-center justify-center bg-white/75">
              <span className="rounded-full bg-[#3E2723] px-4 py-2 font-bold text-white">
                Sold Out
              </span>
            </div>
          )}

          {product.totalStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 z-[4] rounded-full border border-gray-300 bg-white p-3 text-[#5C4033] shadow-sm transition-all duration-300 hover:border-[#FF8C00] hover:bg-[#FF8C00] hover:text-white"
              aria-label="Quick add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-4 text-left">
          <p className="mb-1 text-xs uppercase tracking-wide text-[#2D3748]">
            {product.category.replace('-', ' ')}
          </p>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold tracking-tighter leading-tight text-[#3E2723] transition-colors group-hover:text-[#FF8C00]">
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
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-[#2D3748]">({product.rating.count})</span>
            </div>
          )}

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-amber-400">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-[#2D3748] line-through">
                Rs. {product.basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.variants.slice(0, 3).map((variant, i) => (
                <span key={i} className="rounded bg-gray-100 px-2 py-0.5 text-xs text-[#5C4033]">
                  {variant.size}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs text-[#2D3748]">+{product.variants.length - 3}</span>
              )}
            </div>
          )}

          {product.totalStock > 0 && (
            <button
              type="button"
              onClick={handleAddToCart}
              className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-[#FF8C00] px-5 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:brightness-105"
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

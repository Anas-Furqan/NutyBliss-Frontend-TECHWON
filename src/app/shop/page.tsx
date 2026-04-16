'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@/components/ProductCard';
import { nutyProducts } from '@/lib/site-data';
import { Flip, initGSAP } from '@/lib/gsap';

const filters = ['All', 'Organic', 'Classic', 'Crunchy'] as const;
type FilterType = (typeof filters)[number];

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const gridRef = useRef<HTMLDivElement>(null);

  const products = useMemo(
    () => (activeFilter === 'All' ? nutyProducts : nutyProducts.filter((item) => item.category === activeFilter)),
    [activeFilter],
  );

  useEffect(() => {
    initGSAP();
    const container = gridRef.current;
    if (!container) return;
    const state = Flip.getState(container.querySelectorAll('[data-flip-item]'));
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.45, ease: 'power2.inOut', absolute: true, stagger: 0.02 });
    });
  }, [activeFilter]);

  return (
    <main className="relative z-10 bg-surface pb-40 pt-32">
      <section className="mx-auto w-[min(1200px,92vw)] pb-24">
        <p className="text-xs uppercase tracking-[0.2em] text-primary/80">Shop</p>
        <h1 className="mt-3 font-display text-6xl tracking-tighter leading-tight text-slate-200">Organic Pantry Grid</h1>
        <p className="mt-3 max-w-2xl text-slate-300/80">
          Filter by texture and style. Every card has GSAP hover motion and nutrition overlays for premium product clarity.
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`${activeFilter === filter ? 'btn-primary' : 'btn-secondary'} !px-4`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} data-flip-item>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}


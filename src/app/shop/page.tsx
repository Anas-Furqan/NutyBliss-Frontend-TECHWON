'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import ProductCard from '@/components/ui/ProductCard';
import { categoriesAPI, productsAPI } from '@/lib/api';
import { Flip, initGSAP } from '@/lib/gsap';
import { Product } from '@/types';
import toast from 'react-hot-toast';

type CategoryFilter = { id: string; name: string; slug: string };

export default function ShopPage() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<CategoryFilter[]>([{ id: 'all', name: 'All', slug: 'all' }]);
  const gridRef = useRef<HTMLDivElement>(null);

  const fetchCatalog = async (categorySlug = 'all') => {
    try {
      setLoading(true);
      const [{ data: productsData }, { data: categoriesData }] = await Promise.all([
        productsAPI.getAll({ limit: 60, ...(categorySlug !== 'all' ? { category: categorySlug } : {}) }),
        categoriesAPI.getAll(),
      ]);

      const dynamicFilters = [
        { id: 'all', name: 'All', slug: 'all' },
        ...(categoriesData?.categories || []).map((category: any) => ({
          id: category._id || category.id,
          name: category.name,
          slug: category.slug,
        })),
      ];

      setFilters(dynamicFilters);
      setProducts(productsData?.products || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatalog(activeFilter);
  }, [activeFilter]);

  useEffect(() => {
    if (loading) return;
    initGSAP();
    const container = gridRef.current;
    if (!container) return;
    const state = Flip.getState(container.querySelectorAll('[data-flip-item]'));
    requestAnimationFrame(() => {
      Flip.from(state, { duration: 0.45, ease: 'power2.inOut', absolute: true, stagger: 0.02 });
    });
  }, [activeFilter, loading, products.length]);

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
              key={filter.id}
              className={`${activeFilter === filter.slug ? 'btn-primary' : 'btn-secondary'} !px-4`}
              onClick={() => setActiveFilter(filter.slug)}
            >
              {filter.name}
            </button>
          ))}
        </div>

        <div ref={gridRef} className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <p className="col-span-full text-slate-400">Loading products...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <div key={product._id} data-flip-item>
                <ProductCard product={product} />
              </div>
            ))
          ) : (
            <p className="col-span-full text-slate-400">No products found for this category.</p>
          )}
        </div>
      </section>
    </main>
  );
}


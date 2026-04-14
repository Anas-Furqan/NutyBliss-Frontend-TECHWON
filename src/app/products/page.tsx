'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import GlobalJar from '@/components/GlobalJar';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = { limit: '24' };
      const category = searchParams.get('category');
      if (category) params.category = category;
      const { data } = await productsAPI.getAll(params);
      setProducts(data.products);
    } catch (error) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#5b4230]/70">Shop</p>
            <h1 className="mt-4 text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl">
              GALLERY
            </h1>
          </div>
          <GlobalJar size="lg" className="rotate-[-8deg]" />
        </div>
      </section>

      <section className="mx-auto w-[min(1200px,92vw)]">
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-[2rem] bg-[#ead2b6]" />
            ))}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product, index) => {
              const price = product.baseDiscountPrice || product.basePrice;
              return (
                <motion.article
                  key={product._id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="group glass-card magnetic"
                >
                  <Link href={`/products/${product.slug}`} className="block">
                    <div className="relative h-80 overflow-hidden rounded-[1.5rem] bg-[#ead2b6]">
                      <Image
                        src={product.images[0]?.url || '/images/placeholder.svg'}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#5b4230]/70">
                        {product.category.replace('-', ' ')}
                      </p>
                      <h2 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-[#2a1b12]">
                        {product.title}
                      </h2>
                      <p className="mt-3 text-xl font-semibold text-[#2a1b12]">Rs. {price.toLocaleString()}</p>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}


'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllLink?: string;
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllLink,
}: ProductSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="hidden md:inline-flex items-center text-primary-500 font-semibold hover:text-primary-600 transition-colors"
            >
              View All
              <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>

        {viewAllLink && (
          <div className="mt-8 text-center md:hidden">
            <Link href={viewAllLink} className="btn-outline">
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

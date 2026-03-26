'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const categories = [
  {
    name: 'Peanut Butter',
    slug: 'peanut-butter',
    image: '/images/category-peanut-butter.jpg',
    description: 'Premium quality peanut butter',
    color: 'from-amber-500 to-amber-700',
  },
  {
    name: 'Oats',
    slug: 'oats',
    image: '/images/category-oats.jpg',
    description: 'Healthy breakfast options',
    color: 'from-green-500 to-green-700',
  },
  {
    name: 'Bundles',
    slug: 'bundles',
    image: '/images/category-bundles.jpg',
    description: 'Save more with bundles',
    color: 'from-primary-500 to-primary-700',
  },
];

export default function CategoryCards() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you need</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/products?category=${category.slug}`}
                className="block group relative h-64 rounded-2xl overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color}`} />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="relative h-full flex flex-col items-center justify-center text-white p-6 text-center">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-white/80 mb-4">{category.description}</p>
                  <span className="px-6 py-2 border-2 border-white rounded-full font-semibold
                                 group-hover:bg-white group-hover:text-gray-900 transition-colors">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHeart, FiAward, FiUsers, FiTarget } from 'react-icons/fi';
import WaveDivider from '@/components/ui/WaveDivider';

const values = [
  {
    icon: FiHeart,
    title: '100% Natural',
    description: 'We use only the finest ingredients with no artificial preservatives or additives.',
  },
  {
    icon: FiAward,
    title: 'Premium Quality',
    description: 'Every batch is crafted with care to ensure consistent, exceptional quality.',
  },
  {
    icon: FiUsers,
    title: 'Customer First',
    description: 'Your satisfaction is our priority. We listen, we care, we deliver.',
  },
  {
    icon: FiTarget,
    title: 'Health Focused',
    description: 'Supporting your fitness journey with nutritious, delicious products.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-500 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Our Story</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              From a passion for healthy living to Pakistan&apos;s favorite peanut butter brand
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider color="#ffffff" />
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-dark mb-6 font-display">
                Born from a Love for <span className="text-primary-500">Health</span>
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  Nuty Bliss started in 2020 with a simple mission: to provide Pakistan with
                  premium quality peanut butter that&apos;s both delicious and nutritious.
                </p>
                <p>
                  As fitness enthusiasts ourselves, we were frustrated by the lack of natural,
                  preservative-free options in the market. So we decided to create our own.
                </p>
                <p>
                  Today, Nuty Bliss has grown from a small kitchen operation to one of the
                  most trusted names in healthy food products across Pakistan. But our
                  commitment remains the same: quality, purity, and your health.
                </p>
              </div>
              <Link href="/products" className="btn-primary mt-8 inline-block">
                Shop Our Products
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-cream"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-48 h-48 bg-primary-500 rounded-full flex items-center justify-center">
                  <span className="text-accent-500 font-bold text-6xl font-display">NB</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-display">
              Our Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do at Nuty Bliss
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-card p-6 text-center shadow-card"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-500" />
                </div>
                <h3 className="text-lg font-bold text-dark mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-display">
              Ready to Start Your Health Journey?
            </h2>
            <p className="text-white/80 mb-8 text-lg">
              Join thousands of satisfied customers who have made Nuty Bliss a part of their daily routine.
            </p>
            <Link href="/products" className="btn-accent">
              Shop Now
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

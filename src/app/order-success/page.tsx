'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCheck, FiPackage, FiMail, FiPhone } from 'react-icons/fi';
import confetti from 'canvas-confetti';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('orderNumber');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    if (typeof window !== 'undefined' && !showConfetti) {
      setShowConfetti(true);
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#633bb1', '#fedd00', '#ffffff'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#633bb1', '#fedd00', '#ffffff'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [showConfetti]);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center shadow-glass backdrop-blur-2xl md:p-12"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/20"
          >
            <FiCheck className="h-12 w-12 text-emerald-300" />
          </motion.div>

          <h1 className="mb-4 font-display text-3xl font-bold text-slate-100 md:text-4xl">
            Order Confirmed!
          </h1>
          <p className="mb-2 text-lg text-slate-300">
            Thank you for your order. We&apos;ve received it and will process it shortly.
          </p>

          {orderNumber && (
            <div className="mb-8 mt-4 inline-block rounded-xl border border-orange-500/30 bg-orange-500/10 px-5 py-4">
              <p className="text-sm text-slate-400">Order Number</p>
              <p className="font-mono text-2xl font-bold text-amber-300">{orderNumber}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="mt-8 border-t border-white/10 pt-8">
            <h2 className="mb-6 text-lg font-bold text-slate-100">What&apos;s Next?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <FiMail className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Confirmation Email</h3>
                  <p className="text-sm text-slate-400">Check your inbox for order details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <FiPackage className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Order Processing</h3>
                  <p className="text-sm text-slate-400">We&apos;ll pack your order with care</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-white/10">
                  <FiPhone className="h-5 w-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-100">Track Order</h3>
                  <p className="text-sm text-slate-400">Get updates on delivery status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            {orderNumber && (
              <Link
                href={`/track-order?orderNumber=${orderNumber}`}
                className="btn-primary"
              >
                Track Order
              </Link>
            )}
            <Link href="/products" className="btn-outline">
              Continue Shopping
            </Link>
          </div>

          {/* Support Info */}
          <p className="mt-8 text-sm text-slate-400">
            Need help?{' '}
            <Link href="/contact" className="text-amber-300 hover:underline">
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

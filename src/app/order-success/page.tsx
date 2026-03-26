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
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-card p-8 md:p-12 text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <FiCheck className="w-12 h-12 text-green-500" />
          </motion.div>

          <h1 className="text-3xl md:text-4xl font-bold text-dark mb-4 font-display">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 text-lg mb-2">
            Thank you for your order. We&apos;ve received it and will process it shortly.
          </p>

          {orderNumber && (
            <div className="bg-cream rounded-xl p-4 inline-block mt-4 mb-8">
              <p className="text-sm text-gray-500">Order Number</p>
              <p className="text-2xl font-bold text-primary-500 font-mono">{orderNumber}</p>
            </div>
          )}

          {/* Next Steps */}
          <div className="border-t border-gray-100 pt-8 mt-8">
            <h2 className="text-lg font-bold text-dark mb-6">What&apos;s Next?</h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiMail className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Confirmation Email</h3>
                  <p className="text-sm text-gray-500">Check your inbox for order details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPackage className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Order Processing</h3>
                  <p className="text-sm text-gray-500">We&apos;ll pack your order with care</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPhone className="w-5 h-5 text-primary-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-dark">Track Order</h3>
                  <p className="text-sm text-gray-500">Get updates on delivery status</p>
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
          <p className="text-sm text-gray-500 mt-8">
            Need help?{' '}
            <Link href="/contact" className="text-primary-500 hover:underline">
              Contact our support team
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiTrash2, FiArrowLeft, FiTag } from 'react-icons/fi';
import { useCartStore } from '@/store';
import { couponsAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, updateQuantity, removeItem, getSubtotal, discount, couponCode, setCoupon, removeCoupon, clearCart } = useCartStore();
  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const subtotal = getSubtotal();
  const shippingCost = subtotal >= 2000 ? 0 : 200;
  const total = subtotal - discount + shippingCost;

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;

    setApplyingCoupon(true);
    try {
      const { data } = await couponsAPI.validate(couponInput, subtotal);
      setCoupon(data.coupon.code, data.coupon.discount);
      toast.success(`Coupon applied! You saved Rs. ${data.coupon.discount}`);
      setCouponInput('');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <Link href="/products" className="btn-primary">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 font-medium"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.variant?.price || item.product.baseDiscountPrice || item.product.basePrice;
              return (
                <motion.div
                  key={`${item.productId}-${item.variant?.size}`}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white rounded-2xl p-4 md:p-6 shadow-sm"
                >
                  <div className="flex gap-4">
                    <Link href={`/products/${item.product.slug}`} className="relative w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || '/placeholder.png'}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.slug}`}>
                        <h3 className="font-semibold text-gray-900 hover:text-primary-500 transition-colors">
                          {item.product.title}
                        </h3>
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-500 mt-1">Size: {item.variant.size}</p>
                      )}
                      <p className="text-primary-500 font-bold mt-2">
                        Rs. {price.toLocaleString()}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant?.size, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FiMinus className="w-4 h-4" />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.variant?.size, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors"
                          >
                            <FiPlus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-semibold text-gray-900">
                            Rs. {(price * item.quantity).toLocaleString()}
                          </span>
                          <button
                            onClick={() => removeItem(item.productId, item.variant?.size)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <FiTrash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            <Link href="/products" className="flex items-center gap-2 text-primary-500 font-medium hover:underline">
              <FiArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <button
                    onClick={handleApplyCoupon}
                    disabled={applyingCoupon}
                    className="px-4 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
                {couponCode && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-green-600">Coupon "{couponCode}" applied</span>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 border-t pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost}`}</span>
                </div>
                {subtotal < 2000 && (
                  <p className="text-xs text-gray-500">
                    Add Rs. {(2000 - subtotal).toLocaleString()} more for free shipping
                  </p>
                )}
                <div className="flex justify-between text-xl font-bold pt-3 border-t">
                  <span>Total</span>
                  <span className="text-primary-500">Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout" className="btn-accent w-full text-center block mt-6">
                Proceed to Checkout
              </Link>

              <p className="text-xs text-gray-500 text-center mt-4">
                Secure checkout powered by Stripe
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

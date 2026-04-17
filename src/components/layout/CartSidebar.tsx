'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { useCartStore } from '@/store';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, updateQuantity, removeItem, getSubtotal, discount, couponCode, getTotal } = useCartStore();

  const subtotal = getSubtotal();
  const total = getTotal();
  const shippingCost = subtotal >= 2000 ? 0 : 200;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col border-l border-white/10 bg-[#0d0d12]/95 shadow-glass backdrop-blur-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
                      <Dialog.Title className="text-lg font-semibold text-slate-100">
                        Shopping Cart ({items.length})
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="rounded-full p-2 text-slate-200 transition-colors hover:bg-white/[0.08]"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <FiShoppingBag className="mb-4 h-16 w-16 text-slate-500" />
                          <p className="mb-4 text-slate-400">Your cart is empty</p>
                          <button
                            onClick={onClose}
                            className="btn-primary"
                          >
                            Continue Shopping
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <AnimatePresence>
                            {items.map((item) => {
                              const price = item.variant?.price || item.product.baseDiscountPrice || item.product.basePrice;
                              return (
                                <motion.div
                                  key={`${item.productId}-${item.variant?.size}`}
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -20 }}
                                  className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3"
                                >
                                  <div className="relative h-20 w-20 overflow-hidden rounded-lg bg-white/[0.08]">
                                    <Image
                                      src={item.product.images[0]?.url || '/images/placeholder.svg'}
                                      alt={item.product.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="line-clamp-1 text-sm font-medium text-slate-100">
                                      {item.product.title}
                                    </h4>
                                    {item.variant && (
                                      <p className="text-xs text-slate-400">{item.variant.size}</p>
                                    )}
                                    <p className="mt-1 font-semibold text-amber-300">
                                      Rs. {price.toLocaleString()}
                                    </p>
                                    <div className="flex items-center justify-between mt-2">
                                      <div className="flex items-center space-x-2">
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              item.productId,
                                              item.variant?.size,
                                              Math.max(1, item.quantity - 1)
                                            )
                                          }
                                          className="rounded p-1 text-slate-200 transition-colors hover:bg-white/[0.1]"
                                        >
                                          <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium text-slate-200">
                                          {item.quantity}
                                        </span>
                                        <button
                                          onClick={() =>
                                            updateQuantity(
                                              item.productId,
                                              item.variant?.size,
                                              item.quantity + 1
                                            )
                                          }
                                          className="rounded p-1 text-slate-200 transition-colors hover:bg-white/[0.1]"
                                        >
                                          <FiPlus className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() =>
                                          removeItem(item.productId, item.variant?.size)
                                        }
                                        className="rounded p-1 text-red-300 transition-colors hover:bg-red-500/10"
                                      >
                                        <FiTrash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                      <div className="space-y-4 border-t border-white/10 px-4 py-4">
                        {/* Summary */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-slate-300">
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toLocaleString()}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-emerald-300">
                              <span>Discount ({couponCode})</span>
                              <span>-Rs. {discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-slate-300">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost}`}</span>
                          </div>
                          <div className="flex justify-between border-t border-white/10 pt-2 text-lg font-semibold text-slate-100">
                            <span>Total</span>
                            <span className="text-amber-300">
                              Rs. {(total + shippingCost).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Free shipping notice */}
                        {subtotal < 2000 && (
                          <p className="text-center text-xs text-slate-400">
                            Add Rs. {(2000 - subtotal).toLocaleString()} more for free shipping!
                          </p>
                        )}

                        {/* Actions */}
                        <div className="space-y-2">
                          <Link
                            href="/checkout"
                            onClick={onClose}
                            className="btn-primary w-full text-center block"
                          >
                            Checkout
                          </Link>
                          <Link
                            href="/cart"
                            onClick={onClose}
                            className="btn-outline w-full text-center block"
                          >
                            View Cart
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

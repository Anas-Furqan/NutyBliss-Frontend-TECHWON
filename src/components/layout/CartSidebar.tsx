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
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-4 border-b">
                      <Dialog.Title className="text-lg font-semibold text-gray-900">
                        Shopping Cart ({items.length})
                      </Dialog.Title>
                      <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FiX className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                      {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                          <FiShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 mb-4">Your cart is empty</p>
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
                                  className="flex gap-4 p-3 bg-gray-50 rounded-xl"
                                >
                                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white">
                                    <Image
                                      src={item.product.images[0]?.url || '/images/placeholder.svg'}
                                      alt={item.product.title}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm line-clamp-1">
                                      {item.product.title}
                                    </h4>
                                    {item.variant && (
                                      <p className="text-xs text-gray-500">{item.variant.size}</p>
                                    )}
                                    <p className="text-primary-500 font-semibold mt-1">
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
                                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                          <FiMinus className="w-4 h-4" />
                                        </button>
                                        <span className="w-8 text-center text-sm font-medium">
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
                                          className="p-1 hover:bg-gray-200 rounded transition-colors"
                                        >
                                          <FiPlus className="w-4 h-4" />
                                        </button>
                                      </div>
                                      <button
                                        onClick={() =>
                                          removeItem(item.productId, item.variant?.size)
                                        }
                                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
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
                      <div className="border-t px-4 py-4 space-y-4">
                        {/* Summary */}
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-600">
                            <span>Subtotal</span>
                            <span>Rs. {subtotal.toLocaleString()}</span>
                          </div>
                          {discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({couponCode})</span>
                              <span>-Rs. {discount.toLocaleString()}</span>
                            </div>
                          )}
                          <div className="flex justify-between text-gray-600">
                            <span>Shipping</span>
                            <span>{shippingCost === 0 ? 'Free' : `Rs. ${shippingCost}`}</span>
                          </div>
                          <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span className="text-primary-500">
                              Rs. {(total + shippingCost).toLocaleString()}
                            </span>
                          </div>
                        </div>

                        {/* Free shipping notice */}
                        {subtotal < 2000 && (
                          <p className="text-xs text-center text-gray-500">
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

'use client';

import { Fragment, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { FiSearch, FiX } from 'react-icons/fi';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await productsAPI.getAll({ search: query, limit: 6 });
        setResults(data.products);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const handleClose = () => {
    setQuery('');
    setResults([]);
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-start justify-center p-4 pt-20">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl border border-white/10 bg-[#0d0d12]/95 shadow-glass backdrop-blur-2xl transition-all">
                {/* Search Input */}
                <div className="flex items-center gap-3 border-b border-white/10 p-4">
                  <FiSearch className="h-5 w-5 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 bg-transparent text-lg text-slate-100 outline-none placeholder:text-slate-500"
                    autoFocus
                  />
                  <button
                    onClick={handleClose}
                    className="rounded-full p-2 text-slate-300 transition-colors hover:bg-white/[0.08]"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-slate-400">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/[0.05]"
                        >
                          <div className="relative h-16 w-16 overflow-hidden rounded-lg bg-white/[0.08]">
                            <Image
                              src={product.images[0]?.url || '/images/placeholder.svg'}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-100">{product.title}</h4>
                            <p className="text-sm text-slate-400">{product.category}</p>
                            <p className="font-semibold text-amber-300">
                              Rs. {(product.baseDiscountPrice || product.basePrice).toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : query.trim() ? (
                    <div className="p-8 text-center text-slate-400">
                      No products found for &quot;{query}&quot;
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-400">
                      Start typing to search products...
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                {!query.trim() && (
                  <div className="border-t border-white/10 p-4">
                    <p className="mb-2 text-sm text-slate-400">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Peanut Butter', 'Crunchy', 'Oats', 'Bundle'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-slate-200 transition-colors hover:bg-white/[0.1]"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

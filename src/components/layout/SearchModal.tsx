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
              <Dialog.Panel className="w-full max-w-2xl transform rounded-2xl bg-white shadow-xl transition-all">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <FiSearch className="w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products..."
                    className="flex-1 text-lg outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-96 overflow-y-auto">
                  {loading ? (
                    <div className="p-8 text-center text-gray-500">
                      Searching...
                    </div>
                  ) : results.length > 0 ? (
                    <div className="p-2">
                      {results.map((product) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={handleClose}
                          className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                        >
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={product.images[0]?.url || '/placeholder.png'}
                              alt={product.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{product.title}</h4>
                            <p className="text-sm text-gray-500">{product.category}</p>
                            <p className="text-primary-500 font-semibold">
                              Rs. {(product.baseDiscountPrice || product.basePrice).toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : query.trim() ? (
                    <div className="p-8 text-center text-gray-500">
                      No products found for "{query}"
                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      Start typing to search products...
                    </div>
                  )}
                </div>

                {/* Quick Links */}
                {!query.trim() && (
                  <div className="p-4 border-t">
                    <p className="text-sm text-gray-500 mb-2">Popular searches</p>
                    <div className="flex flex-wrap gap-2">
                      {['Peanut Butter', 'Crunchy', 'Oats', 'Bundle'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
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

'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { productsAPI } from '@/lib/api';
import { Product } from '@/types';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';
import GlobalJar from '@/components/GlobalJar';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getOne(slug as string);
      setProduct(data.product);
    } catch (error) {
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return <div className="flex min-h-[60vh] items-center justify-center text-[#5b4230]">Loading...</div>;
  }

  if (!product) {
    return <div className="flex min-h-[60vh] items-center justify-center text-[#5b4230]">Product not found.</div>;
  }

  const variant = product.variants[selectedVariant];
  const price = variant?.discountPrice || variant?.price || product.baseDiscountPrice || product.basePrice;

  const addToCart = () => {
    addItem(product, quantity, variant ? { size: variant.size, price } : undefined);
    toast.success('Added to cart');
  };

  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto grid w-[min(1200px,92vw)] gap-10 py-14 lg:grid-cols-2">
        <div>
          <Link href="/shop" className="text-xs uppercase tracking-[0.18em] text-[#5b4230]/70">Back to gallery</Link>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 overflow-hidden rounded-[2.4rem] bg-[#ead2b6]"
          >
            <div className="relative aspect-square">
              <Image
                src={product.images[selectedImage]?.url || '/images/placeholder.svg'}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
          {product.images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {product.images.map((image, idx) => (
                <button
                  key={image.url}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative h-20 w-20 overflow-hidden rounded-2xl border ${selectedImage === idx ? 'border-[#8f653f]' : 'border-[#b8946f]/30'}`}
                >
                  <Image src={image.url} alt={`${product.title}-${idx}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between">
          <div>
            <GlobalJar size="md" className="mb-8 ml-auto rotate-[10deg]" />
            <p className="text-xs uppercase tracking-[0.2em] text-[#5b4230]/70">{product.category.replace('-', ' ')}</p>
            <h1 className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-[#2a1b12] md:text-8xl">
              {product.title}
            </h1>
            <p className="mt-6 max-w-xl text-[#5b4230]/85">
              {product.shortDescription || product.description}
            </p>
            <p className="mt-8 text-4xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Rs. {price.toLocaleString()}</p>

            {product.variants.length > 0 && (
              <div className="mt-8">
                <p className="mb-3 text-xs uppercase tracking-[0.18em] text-[#5b4230]/70">Size</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((item, idx) => (
                    <button
                      key={item.size}
                      onClick={() => setSelectedVariant(idx)}
                      className={`rounded-full border px-4 py-2 text-sm ${selectedVariant === idx ? 'border-[#8f653f] bg-[#ead2b6]' : 'border-[#b8946f]/40'}`}
                    >
                      {item.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full border border-[#b8946f]/40">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3">
                <FiMinus />
              </button>
              <span className="w-10 text-center text-[#2a1b12]">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="p-3">
                <FiPlus />
              </button>
            </div>
            <button onClick={addToCart} className="liquid-btn">
              <FiShoppingBag className="mr-2" />
              Add to cart
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}


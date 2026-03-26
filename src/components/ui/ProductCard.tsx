'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiShoppingCart } from 'react-icons/fi';
import { Product } from '@/types';
import { useCartStore } from '@/store';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();

  const price = product.baseDiscountPrice || product.basePrice;
  const hasDiscount = product.baseDiscountPrice && product.baseDiscountPrice < product.basePrice;
  const discountPercent = hasDiscount
    ? Math.round(((product.basePrice - product.baseDiscountPrice!) / product.basePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    const defaultVariant = product.variants?.[0];
    addItem(
      product,
      1,
      defaultVariant ? { size: defaultVariant.size, price: defaultVariant.discountPrice || defaultVariant.price } : undefined
    );
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="product-card group"
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image - No border radius for Organic Inn style */}
        <div className="product-card-image">
          <Image
            src={product.images[0]?.url || '/images/placeholder.png'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Badges - Yellow background, purple text for Organic Inn style */}
          <div className="absolute top-2 left-2 flex flex-col gap-1.5">
            {hasDiscount && (
              <span className="product-card-badge product-card-badge-sale">
                -{discountPercent}%
              </span>
            )}
            {product.isNewArrival && (
              <span className="product-card-badge product-card-badge-new">
                NEW
              </span>
            )}
            {product.isHotSelling && (
              <span className="product-card-badge bg-red-500 text-white">
                HOT
              </span>
            )}
          </div>

          {/* Out of stock overlay */}
          {product.totalStock <= 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="bg-white text-dark font-bold px-4 py-2 rounded-btn">
                Sold Out
              </span>
            </div>
          )}

          {/* Quick add button */}
          {product.totalStock > 0 && (
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 p-3 bg-white rounded-full
                         shadow-card opacity-0 group-hover:opacity-100
                         transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
                         hover:bg-accent-500 hover:text-primary-500"
              aria-label="Add to cart"
            >
              <FiShoppingCart className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content - Left aligned for Organic Inn style */}
        <div className="p-4 text-left">
          {/* Category */}
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.category.replace('-', ' ')}
          </p>

          {/* Title */}
          <h3 className="font-bold text-dark mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.title}
          </h3>

          {/* Rating - Yellow stars */}
          {product.rating.count > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(product.rating.average)
                        ? 'fill-accent-500 text-accent-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({product.rating.count})</span>
            </div>
          )}

          {/* Price - Purple for Organic Inn style */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg font-bold text-primary-500">
              Rs. {price.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-sm text-gray-400 line-through">
                Rs. {product.basePrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Variant sizes preview */}
          {product.variants && product.variants.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.variants.slice(0, 3).map((variant, i) => (
                <span key={i} className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {variant.size}
                </span>
              ))}
              {product.variants.length > 3 && (
                <span className="text-xs text-gray-500">+{product.variants.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}

'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiStar, FiMinus, FiPlus, FiShoppingCart, FiHeart, FiShare2 } from 'react-icons/fi';
import { productsAPI, reviewsAPI } from '@/lib/api';
import { Product, Review } from '@/types';
import { useCartStore, useAuthStore } from '@/store';
import ProductCard from '@/components/ui/ProductCard';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const { addItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await productsAPI.getOne(slug as string);
      setProduct(data.product);

      // Fetch related products
      const relatedRes = await productsAPI.getRelated(data.product._id);
      setRelatedProducts(relatedRes.data.products);

      // Fetch reviews
      const reviewsRes = await reviewsAPI.getProductReviews(data.product._id);
      setReviews(reviewsRes.data.reviews);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];
  const price = currentVariant?.discountPrice || currentVariant?.price || product.baseDiscountPrice || product.basePrice;
  const originalPrice = currentVariant?.price || product.basePrice;
  const hasDiscount = price < originalPrice;

  const handleAddToCart = () => {
    if (product.totalStock <= 0) {
      toast.error('Product is out of stock');
      return;
    }

    addItem(
      product,
      quantity,
      currentVariant ? { size: currentVariant.size, price } : undefined
    );
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm mb-8">
          <ol className="flex items-center space-x-2">
            <li><a href="/" className="text-gray-500 hover:text-primary-500">Home</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/products" className="text-gray-500 hover:text-primary-500">Products</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100"
            >
              <Image
                src={product.images[selectedImage]?.url || '/images/placeholder.svg'}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
              {hasDiscount && (
                <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {Math.round(((originalPrice - price) / originalPrice) * 100)}% OFF
                </span>
              )}
            </motion.div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 ${
                      selectedImage === index ? 'ring-2 ring-primary-500' : ''
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`${product.title} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            <span className="text-sm text-primary-500 font-medium uppercase tracking-wide">
              {product.category.replace('-', ' ')}
            </span>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              {product.title}
            </h1>

            {/* Rating */}
            {product.rating.count > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.round(product.rating.average)
                          ? 'fill-accent-400 text-accent-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-gray-600">
                  {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary-500">
                Rs. {price.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">
                  Rs. {originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-600 mb-6">
              {product.shortDescription || product.description.substring(0, 200)}
            </p>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedVariant(index)}
                      disabled={variant.stock <= 0}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                        selectedVariant === index
                          ? 'border-primary-500 bg-primary-50 text-primary-500'
                          : variant.stock <= 0
                          ? 'border-gray-200 text-gray-400 cursor-not-allowed'
                          : 'border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      {variant.size}
                      {variant.stock <= 0 && ' (Sold Out)'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FiMinus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-100 transition-colors"
                  >
                    <FiPlus className="w-5 h-5" />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {currentVariant?.stock || product.totalStock} available
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={product.totalStock <= 0}
                className="flex-1 btn-accent flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiShoppingCart className="w-5 h-5" />
                {product.totalStock <= 0 ? 'Sold Out' : 'Add to Cart'}
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-500 transition-colors">
                <FiHeart className="w-5 h-5" />
              </button>
              <button className="p-4 border-2 border-gray-200 rounded-full hover:border-primary-500 hover:text-primary-500 transition-colors">
                <FiShare2 className="w-5 h-5" />
              </button>
            </div>

            {/* Features */}
            <div className="border-t pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Free shipping on orders above Rs. 2000
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Cash on Delivery available
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                100% Natural ingredients
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16">
          <div className="flex border-b">
            {['description', 'nutrition', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'text-primary-500 border-b-2 border-primary-500'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'reviews' ? `Reviews (${reviews.length})` : tab}
              </button>
            ))}
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <p className="text-gray-600 whitespace-pre-line">{product.description}</p>
                {product.ingredients && product.ingredients.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Ingredients</h3>
                    <p className="text-gray-600">{product.ingredients.join(', ')}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'nutrition' && product.nutritionFacts && (
              <div className="max-w-md">
                <h3 className="font-semibold text-gray-900 mb-4">Nutrition Facts</h3>
                <table className="w-full">
                  <tbody>
                    {product.nutritionFacts.servingSize && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Serving Size</td>
                        <td className="py-2 text-right font-medium">{product.nutritionFacts.servingSize}</td>
                      </tr>
                    )}
                    {product.nutritionFacts.calories && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Calories</td>
                        <td className="py-2 text-right font-medium">{product.nutritionFacts.calories}</td>
                      </tr>
                    )}
                    {product.nutritionFacts.protein && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Protein</td>
                        <td className="py-2 text-right font-medium">{product.nutritionFacts.protein}g</td>
                      </tr>
                    )}
                    {product.nutritionFacts.carbs && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Carbohydrates</td>
                        <td className="py-2 text-right font-medium">{product.nutritionFacts.carbs}g</td>
                      </tr>
                    )}
                    {product.nutritionFacts.fat && (
                      <tr className="border-b">
                        <td className="py-2 text-gray-600">Fat</td>
                        <td className="py-2 text-right font-medium">{product.nutritionFacts.fat}g</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b pb-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-primary-500 font-medium">
                              {review.user.name[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{review.user.name}</p>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'fill-accent-400 text-accent-400'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              {review.isVerifiedPurchase && (
                                <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                                  Verified Purchase
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

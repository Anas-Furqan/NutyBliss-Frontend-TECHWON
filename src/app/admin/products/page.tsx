'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { adminAPI } from '@/lib/api';
import { Product } from '@/types';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllProducts({ page, search, limit: 10 });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await adminAPI.deleteProduct(id);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-display text-4xl tracking-tighter text-[#3E2723]">Products</h1>
        <Link href="/admin/products/new" className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" />
          Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 backdrop-blur-2xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#2D3748]" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm text-[#3E2723] outline-none"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-[#2D3748]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#2D3748]">
                    Loading...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <tr key={product._id} className="hover:bg-white">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={product.images[0]?.url || '/images/placeholder.svg'}
                            alt={product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-[#3E2723] line-clamp-1">{product.title}</p>
                          <p className="text-sm text-[#2D3748]">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize text-[#2D3748]">{product.category.replace('-', ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#3E2723]">
                        Rs. {(product.baseDiscountPrice || product.basePrice).toLocaleString()}
                      </p>
                      {product.baseDiscountPrice && (
                        <p className="text-sm text-[#2D3748] line-through">
                          Rs. {product.basePrice.toLocaleString()}
                        </p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${product.totalStock > 10 ? 'text-green-600' : product.totalStock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                        >
                          <FiEdit2 className="w-4 h-4 text-[#2D3748]" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="rounded-lg p-2 transition-colors hover:bg-red-500/10"
                        >
                          <FiTrash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#2D3748]">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
            <p className="text-sm text-[#2D3748]">
              Showing {products.length} of {pagination.total} products
            </p>
            <div className="flex gap-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchProducts(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    pagination.page === i + 1
                      ? 'bg-orange-500 text-[#1c1206]'
                      : 'bg-gray-100 text-[#2D3748] hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


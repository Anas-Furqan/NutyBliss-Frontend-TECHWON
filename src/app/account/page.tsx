'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit2 } from 'react-icons/fi';
import { useAuthStore } from '@/store';
import { authAPI, ordersAPI } from '@/lib/api';
import { Order } from '@/types';
import toast from 'react-hot-toast';

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, updateUser } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchOrders();
  }, [isHydrated, isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const { data } = await ordersAPI.getMyOrders();
      setOrders(data.orders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              {/* User Info */}
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-primary-500">
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <h2 className="font-semibold text-gray-900">{user?.name}</h2>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: 'orders', icon: FiPackage, label: 'My Orders' },
                  { id: 'profile', icon: FiUser, label: 'Profile' },
                  { id: 'addresses', icon: FiMapPin, label: 'Addresses' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === item.id
                        ? 'bg-primary-50 text-primary-500'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
                >
                  <FiLogOut className="w-5 h-5" />
                  Logout
                </button>
              </nav>

              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="mt-6 btn-primary w-full text-center block"
                >
                  Admin Panel
                </Link>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">My Orders</h2>
                {loading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="border rounded-xl p-4 hover:border-primary-300 transition-colors"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div>
                            <p className="font-semibold text-gray-900">#{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary-500">
                              Rs. {order.total.toLocaleString()}
                            </p>
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-sm text-gray-600">
                            {order.items.length} item(s)
                          </p>
                          <Link
                            href={`/track-order?orderNumber=${order.orderNumber}`}
                            className="text-primary-500 text-sm font-medium hover:underline"
                          >
                            Track Order
                          </Link>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No orders yet</p>
                    <Link href="/products" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Settings</h2>
                <form className="space-y-6 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      disabled
                      className="input-field bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="text"
                      defaultValue={user?.phone}
                      className="input-field"
                    />
                  </div>
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Saved Addresses</h2>
                  <button className="btn-outline">Add Address</button>
                </div>
                {user?.addresses && user.addresses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.addresses.map((address) => (
                      <div key={address._id} className="border rounded-xl p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-primary-100 text-primary-500 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <p className="font-medium text-gray-900">{address.fullName}</p>
                        <p className="text-sm text-gray-600 mt-1">{address.address}</p>
                        <p className="text-sm text-gray-600">{address.city}</p>
                        <p className="text-sm text-gray-600">{address.phone}</p>
                        <button className="mt-3 text-primary-500 text-sm font-medium flex items-center gap-1">
                          <FiEdit2 className="w-4 h-4" /> Edit
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No saved addresses</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

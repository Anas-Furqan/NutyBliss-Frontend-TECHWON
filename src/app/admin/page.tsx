'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiShoppingBag, FiDollarSign, FiUsers, FiPackage, FiTrendingUp, FiAlertCircle, FiTag
} from 'react-icons/fi';
import { adminAPI } from '@/lib/api';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalUsers: number;
  totalRevenue: number;
  avgOrderValue: number;
  monthlyRevenue: number;
  monthlyOrders: number;
  revenueGrowth: number;
  ordersByStatus: Record<string, number>;
  recentOrders: any[];
  topProducts: any[];
  salesChart: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await adminAPI.getDashboard();
      setStats(data.stats);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`,
      change: `${stats?.revenueGrowth || 0}%`,
      icon: FiDollarSign,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      subtitle: `${stats?.monthlyOrders || 0} this month`,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-orange-500',
    },
  ];

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Add Product
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                {stat.change && (
                  <p className="text-sm text-green-500 flex items-center gap-1 mt-1">
                    <FiTrendingUp className="w-4 h-4" />
                    {stat.change} vs last month
                  </p>
                )}
                {stat.subtitle && (
                  <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                )}
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
            <Link href="/admin/orders" className="text-primary-500 text-sm hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats?.recentOrders?.slice(0, 5).map((order: any) => (
              <div key={order._id} className="flex items-center justify-between py-3 border-b last:border-0">
                <div>
                  <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-500">
                    {order.shippingAddress?.fullName || order.user?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">Rs. {order.total?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="text-gray-500 text-center py-4">No orders yet</p>
            )}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h2>
          <div className="space-y-4">
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${getStatusColor(status).split(' ')[0]}`} />
                  <span className="text-gray-600 capitalize">{status}</span>
                </div>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
          <div className="space-y-4">
            {stats?.topProducts?.slice(0, 5).map((item: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-500 font-medium">
                  {index + 1}
                </span>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item._id?.title || 'Unknown Product'}</p>
                  <p className="text-sm text-gray-500">{item.totalSold} sold</p>
                </div>
                <p className="font-medium text-gray-900">Rs. {item.revenue?.toLocaleString()}</p>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <p className="text-gray-500 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/admin/products/new"
              className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiPackage className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">Add Product</p>
            </Link>
            <Link
              href="/admin/orders"
              className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiShoppingBag className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">View Orders</p>
            </Link>
            <Link
              href="/admin/coupons"
              className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiTag className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">Manage Coupons</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border-2 border-dashed border-gray-200 rounded-xl text-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <FiUsers className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="font-medium text-gray-700">View Users</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

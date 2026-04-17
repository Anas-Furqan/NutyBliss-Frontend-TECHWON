'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiShoppingBag,
  FiDollarSign,
  FiUsers,
  FiPackage,
  FiTag,
  FiArrowUpRight,
  FiCalendar,
  FiClock,
  FiBarChart2,
  FiActivity,
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

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-amber-400" />
      </div>
    );
  }

  const formatCurrency = (value: number) => `Rs. ${Number(value || 0).toLocaleString()}`;

  const trendValue = Number(stats?.revenueGrowth || 0);
  const trendLabel = trendValue > 0 ? `+${trendValue}%` : `${trendValue}%`;

  const chartRows = (stats?.salesChart || []).map((row: any) => ({
    day: row?._id,
    orders: Number(row?.orders || 0),
    sales: Number(row?.sales || 0),
  }));
  const maxSales = chartRows.reduce((max, row) => Math.max(max, row.sales), 0) || 1;

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats?.totalRevenue || 0),
      meta: `${trendLabel} vs last month`,
      icon: FiDollarSign,
      iconShell: 'from-emerald-500/20 to-emerald-400/5 text-emerald-300 border-emerald-400/20',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      meta: `${stats?.monthlyOrders || 0} this month`,
      icon: FiShoppingBag,
      iconShell: 'from-cyan-500/20 to-cyan-400/5 text-cyan-300 border-cyan-400/20',
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      meta: `${stats?.topProducts?.length || 0} top sellers tracked`,
      icon: FiPackage,
      iconShell: 'from-violet-500/20 to-violet-400/5 text-violet-300 border-violet-400/20',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      meta: `${formatCurrency(stats?.avgOrderValue || 0)} avg order`,
      icon: FiUsers,
      iconShell: 'from-amber-500/20 to-amber-400/5 text-amber-300 border-amber-400/20',
    },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      confirmed: 'bg-blue-500/20 text-blue-300',
      processing: 'bg-purple-500/20 text-purple-300',
      'in-progress': 'bg-fuchsia-500/20 text-fuchsia-300',
      shipped: 'bg-indigo-500/20 text-indigo-300',
      'on-the-way': 'bg-cyan-500/20 text-cyan-300',
      delivered: 'bg-emerald-500/20 text-emerald-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-gray-100 text-[#2D3748]';
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-[#D2B48C]/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-56 w-56 rounded-full bg-orange-500/12 blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-amber-300/90">Nuty Bliss Admin</p>
            <h1 className="mt-2 font-display text-4xl tracking-tight text-[#3E2723] md:text-5xl">Dashboard Control Room</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#2D3748] md:text-base">
              Track revenue velocity, order momentum, and product performance in one clear command center.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/orders" className="btn-secondary !px-4">
              <FiClock className="mr-2 h-4 w-4" />
              Review Orders
            </Link>
            <Link href="/admin/products/new" className="btn-primary">
              <FiArrowUpRight className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat, index) => (
          <motion.article
            key={stat.title}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 backdrop-blur-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-[#2D3748]">{stat.title}</p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[#3E2723]">{stat.value}</p>
                <p className="mt-2 text-sm text-[#2D3748]">{stat.meta}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl border bg-gradient-to-br ${stat.iconShell}`}>
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl xl:col-span-8">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-3xl tracking-tight text-[#3E2723]">Sales Trend</h2>
              <p className="text-sm text-[#2D3748]">Last 7 days performance snapshot</p>
            </div>
            <div className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-[#2D3748]">
              <FiCalendar className="mr-2 inline h-3.5 w-3.5" />
              Weekly
            </div>
          </div>

          {chartRows.length > 0 ? (
            <div className="grid grid-cols-7 gap-2 md:gap-3">
              {chartRows.map((row) => {
                const barHeight = Math.max(10, Math.round((row.sales / maxSales) * 120));
                const shortLabel = row.day?.slice(5) || '--';
                return (
                  <div key={row.day} className="flex flex-col items-center gap-2">
                    <div className="flex h-36 w-full max-w-[56px] items-end rounded-xl border border-gray-200 bg-white p-1">
                      <div
                        className="w-full rounded-lg bg-gradient-to-t from-amber-500 to-orange-400"
                        style={{ height: `${barHeight}px` }}
                        title={`${shortLabel} | ${formatCurrency(row.sales)} | ${row.orders} orders`}
                      />
                    </div>
                    <p className="text-[11px] text-[#2D3748]">{shortLabel}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#2D3748]">No sales chart data available yet.</p>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#2D3748]">Monthly Revenue</p>
              <p className="mt-1 text-lg font-semibold text-[#3E2723]">{formatCurrency(stats?.monthlyRevenue || 0)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#2D3748]">Average Order</p>
              <p className="mt-1 text-lg font-semibold text-[#3E2723]">{formatCurrency(stats?.avgOrderValue || 0)}</p>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[#2D3748]">Revenue Growth</p>
              <p className={`mt-1 text-lg font-semibold ${trendValue >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
                {trendLabel}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl xl:col-span-4">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl tracking-tight text-[#3E2723]">Order Status</h2>
            <FiBarChart2 className="h-5 w-5 text-[#2D3748]" />
          </div>
          <div className="space-y-3">
            {stats?.ordersByStatus && Object.entries(stats.ordersByStatus).length > 0 ? (
              Object.entries(stats.ordersByStatus).map(([status, count]) => {
                const totalOrders = Number(stats?.totalOrders || 0) || 1;
                const ratio = Math.max(4, Math.round((Number(count) / totalOrders) * 100));
                return (
                  <div key={status} className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="mb-2 flex items-center justify-between">
                      <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(status)}`}>
                        {status}
                      </span>
                      <span className="text-sm font-semibold text-[#3E2723]">{count}</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#2D3748]">No status distribution available yet.</p>
            )}
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl xl:col-span-7">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl tracking-tight text-[#3E2723]">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-[#FF8C00] hover:text-[#e67e00]">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.slice(0, 6).map((order: any) => (
              <div key={order._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#3E2723]">#{order.orderNumber}</p>
                  <p className="text-xs text-[#2D3748]">{order.shippingAddress?.fullName || order.user?.name || 'Unknown customer'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#3E2723]">{formatCurrency(order.total || 0)}</p>
                  <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
            {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
              <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#2D3748]">No orders yet.</p>
            )}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl xl:col-span-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-3xl tracking-tight text-[#3E2723]">Top Products</h2>
            <FiActivity className="h-5 w-5 text-[#2D3748]" />
          </div>
          <div className="space-y-3">
            {stats?.topProducts?.slice(0, 5).map((item: any, index: number) => (
              <div key={`${item?._id?._id || index}`} className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-amber-100 text-xs font-semibold text-[#FF8C00]">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#3E2723]">{item?._id?.title || 'Unknown Product'}</p>
                  <p className="text-xs text-[#2D3748]">{item?.totalSold || 0} sold</p>
                </div>
                <p className="text-sm font-semibold text-[#3E2723]">{formatCurrency(item?.revenue || 0)}</p>
              </div>
            ))}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-[#2D3748]">No sales data yet.</p>
            )}
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl">
        <h2 className="mb-4 font-display text-3xl tracking-tight text-[#3E2723]">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/admin/products/new" className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400/40 hover:bg-orange-50">
            <FiPackage className="mb-3 h-6 w-6 text-[#FF8C00]" />
            <p className="text-sm font-semibold text-[#3E2723]">Add Product</p>
            <p className="mt-1 text-xs text-[#2D3748]">Create a new catalog item</p>
          </Link>
          <Link href="/admin/orders" className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400/40 hover:bg-orange-50">
            <FiShoppingBag className="mb-3 h-6 w-6 text-[#FF8C00]" />
            <p className="text-sm font-semibold text-[#3E2723]">Manage Orders</p>
            <p className="mt-1 text-xs text-[#2D3748]">Update order statuses quickly</p>
          </Link>
          <Link href="/admin/coupons" className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400/40 hover:bg-orange-50">
            <FiTag className="mb-3 h-6 w-6 text-[#FF8C00]" />
            <p className="text-sm font-semibold text-[#3E2723]">Manage Coupons</p>
            <p className="mt-1 text-xs text-[#2D3748]">Launch discount campaigns</p>
          </Link>
          <Link href="/admin/users" className="group rounded-xl border border-gray-200 bg-white p-4 transition hover:border-amber-400/40 hover:bg-orange-50">
            <FiUsers className="mb-3 h-6 w-6 text-[#FF8C00]" />
            <p className="text-sm font-semibold text-[#3E2723]">View Users</p>
            <p className="mt-1 text-xs text-[#2D3748]">Monitor customer activity</p>
          </Link>
        </div>
      </section>
    </div>
  );
}


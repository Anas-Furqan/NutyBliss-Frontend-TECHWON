'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';
import { adminAPI } from '@/lib/api';
import { Order } from '@/types';
import toast from 'react-hot-toast';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getAllOrders({ page, status: statusFilter || undefined, limit: 10 });
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await adminAPI.updateOrderStatus(orderId, { status });
      toast.success('Order status updated');
      fetchOrders(pagination.page);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

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
    return colors[status] || 'bg-white/10 text-slate-300';
  };

  const statuses = ['', 'pending', 'confirmed', 'processing', 'in-progress', 'shipped', 'on-the-way', 'delivered', 'cancelled'];

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl tracking-tighter text-slate-100">Orders</h1>

      {/* Filters */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl">
        <div className="flex flex-wrap gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-11 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-sm text-slate-200 outline-none"
          >
            <option value="">All Status</option>
            {statuses.slice(1).map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Items</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-100">#{order.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-100">{order.shippingAddress?.fullName}</p>
                      <p className="text-sm text-slate-400">{order.shippingAddress?.phone}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-slate-300">{order.items?.length} items</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-100">Rs. {order.total?.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full uppercase ${
                        order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {order.paymentMethod} - {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${getStatusColor(order.status)}`}
                      >
                        {statuses.slice(1).map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/orders/${order._id}`}
                        className="inline-block rounded-lg p-2 transition-colors hover:bg-white/[0.08]"
                      >
                        <FiEye className="w-4 h-4 text-slate-300" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing {orders.length} of {pagination.total} orders
            </p>
            <div className="flex gap-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchOrders(i + 1)}
                  className={`w-8 h-8 rounded-lg text-sm ${
                    pagination.page === i + 1
                      ? 'bg-orange-500 text-[#1c1206]'
                      : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.14]'
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

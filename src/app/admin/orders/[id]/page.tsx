'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { adminAPI } from '@/lib/api';

export default function AdminOrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getOrderDetails(id);
      setOrder(data.order);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;
    fetchOrder();
  }, [id, fetchOrder]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-glass backdrop-blur-2xl">
        <p className="text-slate-300">Order not found.</p>
        <button onClick={() => router.back()} className="btn-outline mt-4">Go Back</button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-300',
    confirmed: 'bg-blue-500/20 text-blue-300',
    processing: 'bg-purple-500/20 text-purple-300',
    'in-progress': 'bg-fuchsia-500/20 text-fuchsia-300',
    shipped: 'bg-indigo-500/20 text-indigo-300',
    'on-the-way': 'bg-cyan-500/20 text-cyan-300',
    delivered: 'bg-emerald-500/20 text-emerald-300',
    cancelled: 'bg-red-500/20 text-red-300',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-100">Order #{order.orderNumber}</h1>
        <button onClick={() => router.back()} className="btn-outline">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-glass backdrop-blur-2xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Items</h2>
          <div className="space-y-4">
            {(order.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div>
                  <p className="font-medium text-slate-100">{item.title}</p>
                  {item.variant?.size && <p className="text-sm text-slate-400">Size: {item.variant.size}</p>}
                  <p className="text-sm text-slate-400">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-300">Rs. {Number(item.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 shadow-glass backdrop-blur-2xl">
          <h2 className="mb-4 text-lg font-semibold text-slate-100">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Status</span>
              <span className={`inline-flex rounded-full px-2 py-1 font-medium capitalize ${statusColors[order.status] || 'bg-white/10 text-slate-300'}`}>
                {order.status}
              </span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Payment</span>
              <span className="font-medium uppercase text-slate-100">{order.paymentMethod} / {order.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Subtotal</span>
              <span className="font-medium text-slate-100">Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Shipping</span>
              <span className="font-medium text-slate-100">Rs. {Number(order.shippingCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Discount</span>
              <span className="font-medium text-emerald-300">-Rs. {Number(order.discount || 0).toLocaleString()}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-white/10 pt-2 text-slate-100">
              <span className="font-semibold">Total</span>
              <span className="font-semibold text-amber-300">Rs. {Number(order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          <h3 className="mb-2 mt-6 text-md font-semibold text-slate-100">Shipping</h3>
          <div className="space-y-1 text-sm text-slate-300">
            <p className="font-medium text-slate-100">{order.shippingAddress?.fullName}</p>
            <p>{order.shippingAddress?.phone}</p>
            <p>{order.shippingAddress?.email}</p>
            <p>{order.shippingAddress?.address}</p>
            <p>{order.shippingAddress?.city} {order.shippingAddress?.postalCode ? `(${order.shippingAddress.postalCode})` : ''}</p>
          </div>
        </div>
      </div>
    </div>
  );
}


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
      <div className="bg-white rounded-xl shadow-sm p-6">
        <p className="text-gray-600">Order not found.</p>
        <button onClick={() => router.back()} className="btn-outline mt-4">Go Back</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
        <button onClick={() => router.back()} className="btn-outline">Back</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Items</h2>
          <div className="space-y-4">
            {(order.items || []).map((item: any, idx: number) => (
              <div key={idx} className="flex items-start justify-between border rounded-lg p-4">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  {item.variant?.size && <p className="text-sm text-gray-600">Size: {item.variant.size}</p>}
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Rs. {Number(item.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-700">
              <span>Status</span>
              <span className="font-medium capitalize">{order.status}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Payment</span>
              <span className="font-medium uppercase">{order.paymentMethod} / {order.paymentStatus}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span className="font-medium">Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Shipping</span>
              <span className="font-medium">Rs. {Number(order.shippingCost || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Discount</span>
              <span className="font-medium">-Rs. {Number(order.discount || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-900 border-t pt-2 mt-2">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">Rs. {Number(order.total || 0).toLocaleString()}</span>
            </div>
          </div>

          <h3 className="text-md font-semibold text-gray-900 mt-6 mb-2">Shipping</h3>
          <div className="text-sm text-gray-700 space-y-1">
            <p className="font-medium">{order.shippingAddress?.fullName}</p>
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


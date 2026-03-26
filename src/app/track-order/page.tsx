'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiPackage, FiTruck, FiCheck, FiClock } from 'react-icons/fi';
import { ordersAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface TrackingInfo {
  orderNumber: string;
  status: string;
  statusHistory: { status: string; timestamp: string; note?: string }[];
  trackingNumber?: string;
  trackingUrl?: string;
  createdAt: string;
}

const statusSteps = [
  { key: 'pending', label: 'Order Placed', icon: FiClock },
  { key: 'confirmed', label: 'Confirmed', icon: FiCheck },
  { key: 'processing', label: 'Processing', icon: FiPackage },
  { key: 'shipped', label: 'Shipped', icon: FiTruck },
  { key: 'delivered', label: 'Delivered', icon: FiCheck },
];

export default function TrackOrderPage() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get('orderNumber') || '');
  const [email, setEmail] = useState('');
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      toast.error('Please enter an order number');
      return;
    }

    setLoading(true);
    setSearched(true);
    try {
      const { data } = await ordersAPI.track(orderNumber, email || undefined);
      setTrackingInfo(data.order);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Order not found');
      setTrackingInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentStep = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-primary-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-3xl md:text-4xl font-bold">Track Your Order</h1>
          <p className="opacity-90 mt-2">Enter your order number to check status</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-sm p-6 -mt-16 relative z-10">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Number *</label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g., NB1234560001"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email used for order"
                className="input-field"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <FiSearch className="w-5 h-5" />
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
        </div>

        {/* Tracking Result */}
        {searched && trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm p-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Order #{trackingInfo.orderNumber}
                </h2>
                <p className="text-sm text-gray-500">
                  Placed on {new Date(trackingInfo.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium capitalize ${
                trackingInfo.status === 'delivered'
                  ? 'bg-green-100 text-green-800'
                  : trackingInfo.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-primary-100 text-primary-800'
              }`}>
                {trackingInfo.status}
              </span>
            </div>

            {/* Progress Steps */}
            {trackingInfo.status !== 'cancelled' && (
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {statusSteps.map((step, index) => {
                    const currentStep = getCurrentStep(trackingInfo.status);
                    const isCompleted = index <= currentStep;
                    const isCurrent = index === currentStep;

                    return (
                      <div key={step.key} className="flex flex-col items-center flex-1">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isCompleted
                            ? 'bg-primary-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <p className={`text-xs mt-2 text-center ${
                          isCompleted ? 'text-primary-500 font-medium' : 'text-gray-400'
                        }`}>
                          {step.label}
                        </p>
                        {index < statusSteps.length - 1 && (
                          <div className={`absolute h-1 w-full top-5 left-1/2 ${
                            index < currentStep ? 'bg-primary-500' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tracking Number */}
            {trackingInfo.trackingNumber && (
              <div className="border-t pt-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Shipping Information</h3>
                <p className="text-gray-600">
                  Tracking Number: <span className="font-medium">{trackingInfo.trackingNumber}</span>
                </p>
                {trackingInfo.trackingUrl && (
                  <a
                    href={trackingInfo.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-500 hover:underline text-sm"
                  >
                    Track with courier
                  </a>
                )}
              </div>
            )}

            {/* Status History */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Order Timeline</h3>
              <div className="space-y-4">
                {trackingInfo.statusHistory?.map((history, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="w-2 h-2 bg-primary-500 rounded-full mt-2" />
                    <div>
                      <p className="font-medium text-gray-900 capitalize">{history.status}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(history.timestamp).toLocaleString()}
                      </p>
                      {history.note && (
                        <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {searched && !trackingInfo && !loading && (
          <div className="bg-white rounded-2xl shadow-sm p-8 mt-8 text-center">
            <p className="text-gray-500">No order found with this number</p>
          </div>
        )}
      </div>
    </div>
  );
}

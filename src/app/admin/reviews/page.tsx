'use client';

import { useCallback, useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [approvedFilter, setApprovedFilter] = useState<'all' | 'approved' | 'pending'>('all');

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    try {
      const params: any = { page: 1, limit: 50 };
      if (approvedFilter === 'approved') params.approved = 'true';
      if (approvedFilter === 'pending') params.approved = 'false';
      const { data } = await adminAPI.getAllReviews(params);
      setReviews(data.reviews || []);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  }, [approvedFilter]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const setApproval = async (reviewId: string, isApproved: boolean) => {
    try {
      await adminAPI.moderateReview(reviewId, isApproved);
      toast.success(isApproved ? 'Review approved' : 'Review rejected');
      fetchReviews();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update review');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <select
          value={approvedFilter}
          onChange={(e) => setApprovedFilter(e.target.value as any)}
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comment</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">Loading...</td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 line-clamp-1">{review.product?.title || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{review.product?.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{review.user?.name}</p>
                      <p className="text-sm text-gray-500">{review.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900">{review.rating}/5</span>
                      {review.isVerifiedPurchase && (
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-700 max-w-md">
                      <p className="line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setApproval(review._id, true)}
                          className="p-2 hover:bg-green-50 rounded-lg"
                          title="Approve"
                        >
                          <FiCheck className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => setApproval(review._id, false)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                          title="Reject"
                        >
                          <FiX className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">No reviews found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


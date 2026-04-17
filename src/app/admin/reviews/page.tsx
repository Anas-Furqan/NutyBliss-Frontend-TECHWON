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
        <h1 className="font-display text-4xl tracking-tighter text-slate-100">Reviews</h1>
        <select
          value={approvedFilter}
          onChange={(e) => setApprovedFilter(e.target.value as any)}
          className="h-11 rounded-lg border border-white/10 bg-white/[0.02] px-4 text-sm text-slate-200 outline-none"
        >
          <option value="all" className="bg-[#0f0f14]">All</option>
          <option value="pending" className="bg-[#0f0f14]">Pending</option>
          <option value="approved" className="bg-[#0f0f14]">Approved</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Comment</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : reviews.length > 0 ? (
                reviews.map((review) => (
                  <tr key={review._id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium text-slate-100">{review.product?.title || 'Unknown'}</p>
                        <p className="text-sm text-slate-400">{review.product?.slug}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-slate-100">{review.user?.name}</p>
                      <p className="text-sm text-slate-400">{review.user?.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-amber-300">{review.rating}/5</span>
                      {review.isVerifiedPurchase && (
                        <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                          Verified
                        </span>
                      )}
                    </td>
                    <td className="max-w-md px-6 py-4 text-slate-300">
                      <p className="line-clamp-2">{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setApproval(review._id, true)}
                          className="rounded-lg p-2 transition-colors hover:bg-emerald-500/10"
                          title="Approve"
                        >
                          <FiCheck className="h-4 w-4 text-emerald-300" />
                        </button>
                        <button
                          onClick={() => setApproval(review._id, false)}
                          className="rounded-lg p-2 transition-colors hover:bg-red-500/10"
                          title="Reject"
                        >
                          <FiX className="h-4 w-4 text-red-300" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">No reviews found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


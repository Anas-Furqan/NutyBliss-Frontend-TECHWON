'use client';

import { useState, useEffect, useCallback } from 'react';
import { FiSearch } from 'react-icons/fi';
import { adminAPI } from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await adminAPI.getUsers({ page, search, limit: 10 });
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div>
      <h1 className="mb-6 font-display text-4xl tracking-tighter text-slate-100">Users</h1>

      {/* Search */}
      <div className="mb-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-2xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] pl-10 pr-4 text-sm text-slate-200 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10 bg-white/[0.02]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">Loading...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08]">
                          <span className="font-medium text-amber-400">
                            {user.name?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <p className="font-medium text-slate-100">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-300">{user.email}</td>
                    <td className="px-6 py-4 text-slate-300">{user.phone || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        user.role === 'admin' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/10 text-slate-300'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        user.isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No users found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-6 py-4">
            <p className="text-sm text-slate-400">
              Showing {users.length} of {pagination.total} users
            </p>
            <div className="flex gap-2">
              {[...Array(pagination.pages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => fetchUsers(i + 1)}
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

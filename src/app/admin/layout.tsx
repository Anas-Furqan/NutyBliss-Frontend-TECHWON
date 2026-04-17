'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiHome, FiPackage, FiShoppingBag, FiUsers, FiTag, FiStar, FiLogOut, FiMenu
} from 'react-icons/fi';
import { useAuthStore } from '@/store';
import { authAPI } from '@/lib/api';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: FiHome },
  { name: 'Products', href: '/admin/products', icon: FiPackage },
  { name: 'Categories', href: '/admin/categories', icon: FiTag },
  { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag },
  { name: 'Users', href: '/admin/users', icon: FiUsers },
  { name: 'Coupons', href: '/admin/coupons', icon: FiTag },
  { name: 'Reviews', href: '/admin/reviews', icon: FiStar },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isHydrated, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAdminLoginRoute = pathname === '/admin/login';

  useEffect(() => {
    if (isAdminLoginRoute) return;
    if (!isHydrated) return;
    if (!isAuthenticated || user?.role !== 'admin') {
      router.push('/admin/login');
    }
  }, [isHydrated, isAuthenticated, user, router, isAdminLoginRoute]);

  if (isAdminLoginRoute) {
    return <>{children}</>;
  }

  if (!isHydrated) return null;
  if (!isAuthenticated || user?.role !== 'admin') return null;

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue local logout even if server cookie clear fails.
    }
    logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#3E2723]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#2D3748]/20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 h-full w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link href="/admin" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#ff8c00] to-[#ff6f00] shadow-[0_12px_24px_rgba(255,140,0,0.32)]">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-[#3E2723]">Admin</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-100 text-amber-400'
                    : 'text-[#2D3748] hover:bg-gray-100 hover:text-[#3E2723]'
                }`}
              >
                <link.icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-4 py-3 text-[#2D3748] transition-colors hover:bg-gray-100"
          >
            <FiHome className="w-5 h-5" />
            View Store
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 rounded-lg px-4 py-3 text-red-400 transition-colors hover:bg-gray-100"
          >
            <FiLogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-2 hover:bg-gray-100 lg:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>
            <div className="flex-1 lg:flex-none" />
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#2D3748]">Welcome, {user?.name}</span>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <span className="font-medium text-amber-400">
                  {user?.name?.[0]?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


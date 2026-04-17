'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCartStore, useAuthStore } from '@/store';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';
import { cartAPI } from '@/lib/api';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/track-order', label: 'Track' },
];

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, getSubtotal, updateQuantity, removeItem } = useCartStore();
  const { isAuthenticated, user } = useAuthStore();

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  const resolveServerCartItemId = async (productId: string, variantSize?: string) => {
    const { data } = await cartAPI.get();
    const serverItems = data?.cart?.items || [];
    const matched = serverItems.find((serverItem: any) => {
      const serverProductId =
        typeof serverItem.product === 'string' ? serverItem.product : serverItem.product?._id;
      const serverVariantSize = serverItem.variant?.size;
      return serverProductId === productId && (serverVariantSize || '') === (variantSize || '');
    });
    return matched?._id as string | undefined;
  };

  const syncQuantityToBackend = async (
    productId: string,
    variantSize: string | undefined,
    nextQuantity: number
  ) => {
    if (!isAuthenticated) return;
    const serverItemId = await resolveServerCartItemId(productId, variantSize);
    if (!serverItemId) return;
    if (nextQuantity < 1) {
      await cartAPI.remove(serverItemId);
      return;
    }
    await cartAPI.update(serverItemId, nextQuantity);
  };

  const handleDecrement = async (item: { productId: string; quantity: number; variant?: { size: string }; product: Product }) => {
    const nextQuantity = item.quantity - 1;
    if (nextQuantity < 1) {
      removeItem(item.productId, item.variant?.size);
    } else {
      updateQuantity(item.productId, item.variant?.size, nextQuantity);
    }
    try {
      await syncQuantityToBackend(item.productId, item.variant?.size, nextQuantity);
    } catch {
      // Keep local UX responsive even if API sync fails.
    }
  };

  const handleIncrement = async (item: { productId: string; quantity: number; variant?: { size: string }; product: Product }) => {
    const nextQuantity = item.quantity + 1;
    updateQuantity(item.productId, item.variant?.size, nextQuantity);
    try {
      await syncQuantityToBackend(item.productId, item.variant?.size, nextQuantity);
    } catch {
      // Keep local UX responsive even if API sync fails.
    }
  };

  const handleRemove = async (item: { productId: string; variant?: { size: string }; product: Product }) => {
    removeItem(item.productId, item.variant?.size);
    try {
      await syncQuantityToBackend(item.productId, item.variant?.size, 0);
    } catch {
      // Keep local UX responsive even if API sync fails.
    }
  };

  const handleOpenCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to use cart');
      router.push('/login');
      return;
    }
    setCartOpen(true);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#E5E7EB] bg-white/95 px-4 py-2 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-gray-200 bg-white">
              <Image src="/images/logo.jpeg" alt="Nuty logo" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-lg tracking-tighter leading-tight text-[#3E2723]">Nuty Bliss</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${pathname === item.href ? 'bg-orange-50 text-[#FF8C00]' : 'text-[#5C4033] hover:bg-orange-50 hover:text-[#FF8C00]'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 lg:flex">
              {isAuthenticated ? (
                <Link href="/account" className="btn-ghost" title="Open account">
                  {user?.name || 'My Account'}
                </Link>
              ) : (
                <>
                  <Link href="/login" className="btn-ghost">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-ghost">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#5C4033] transition hover:border-[#FF8C00] hover:text-[#FF8C00]"
              onClick={handleOpenCart}
              aria-label="Open cart"
            >
              <Icon path="M3 4h2l2 12h10l2-8H7" />
            </button>
            <span className="mr-1 hidden min-w-5 rounded-full bg-[#FF8C00]/20 px-1.5 py-0.5 text-center text-[10px] font-semibold text-[#FF8C00] md:inline-block">
              {itemCount}
            </span>
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#5C4033] transition hover:border-[#FF8C00] hover:text-[#FF8C00] md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Icon path="M4 7h16M4 12h16M4 17h16" />
            </button>
            <Link
              href={isAuthenticated ? '/account' : '/login'}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-300 bg-white text-[#5C4033] transition hover:border-[#FF8C00] hover:text-[#FF8C00]"
              aria-label="User account"
              title={isAuthenticated ? 'Account' : 'Login'}
            >
              <Icon path="M12 12a4 4 0 100-8 4 4 0 000 8zm-7 9a7 7 0 0114 0" />
            </Link>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-sm md:hidden">
            <div className="grid gap-2">
              {links.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-[#5C4033] hover:bg-orange-50 hover:text-[#FF8C00]">
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                {isAuthenticated ? (
                  <Link href="/account" className="btn-ghost col-span-2 w-full justify-center">
                    {user?.name || 'My Account'}
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="btn-ghost w-full justify-center">
                      Login
                    </Link>
                    <Link href="/signup" className="btn-ghost w-full justify-center">
                      Sign Up
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {cartOpen && (
        <div className="fixed inset-0 z-[70] bg-[#2D3748]/15" onClick={() => setCartOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-gray-200 bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-[#3E2723]">Your Cart</h3>
              <button className="btn-secondary !px-3" onClick={() => setCartOpen(false)} aria-label="Close cart">
                <Icon path="M6 6l12 12M18 6l-12 12" />
              </button>
            </div>

            <div className="space-y-3">
              {items.length === 0 ? (
                <GlassCard className="p-4 text-sm">Cart is empty.</GlassCard>
              ) : (
                items.map((item) => (
                  <GlassCard key={`${item.productId}-${item.variant?.size ?? 'default'}`} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-[#3E2723]">{item.product.title}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <p className="text-xs text-[#2D3748]">Qty {item.quantity}</p>
                          <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-[#5C4033] transition hover:bg-orange-50"
                            onClick={() => void handleDecrement(item)}
                            aria-label="Decrease quantity"
                          >
                            <Icon path="M6 12h12" />
                          </button>
                          <button
                            type="button"
                            className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 text-[#5C4033] transition hover:bg-orange-50"
                            onClick={() => void handleIncrement(item)}
                            aria-label="Increase quantity"
                          >
                            <Icon path="M12 6v12M6 12h12" />
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition hover:bg-red-500/15"
                        onClick={() => void handleRemove(item)}
                        aria-label="Remove item"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M4 7h16" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M7 7l1 12h8l1-12" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M9 7V5h6v2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </GlassCard>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4">
              <p className="flex items-center justify-between text-sm text-[#2D3748]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#3E2723]">PKR {getSubtotal().toLocaleString()}</span>
              </p>
              <Button href="/checkout" className="mt-4 w-full" onClick={() => setCartOpen(false)}>
                Go to Checkout
              </Button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}

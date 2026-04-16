'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useMemo, useState } from 'react';
import { useCartStore } from '@/store';
import GlassCard from '@/components/ui/GlassCard';
import Button from '@/components/ui/Button';

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
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { items, getSubtotal } = useCartStore();

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  return (
    <>
      <header className="floating-shell">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-10 w-10 overflow-hidden rounded-full border border-primary/20 bg-white">
              <Image src="/images/logo.jpeg" alt="Nuty logo" width={40} height={40} className="h-full w-full object-cover" />
            </div>
            <span className="font-display text-lg tracking-tight text-primary">Nuty Bliss</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm transition-colors ${pathname === item.href ? 'text-primary' : 'text-ink/80 hover:text-primary'}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="btn-secondary !px-3"
              onClick={() => setCartOpen(true)}
              aria-label="Open cart"
            >
              <Icon path="M3 4h2l2 12h10l2-8H7" />
              <span className="ml-2 text-xs">{itemCount}</span>
            </button>
            <button
              className="btn-secondary !px-3 md:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Open menu"
            >
              <Icon path="M4 7h16M4 12h16M4 17h16" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mt-3 rounded-xl bg-white/90 p-3 md:hidden">
            <div className="grid gap-2">
              {links.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-lg px-3 py-2 text-sm text-ink/90 hover:bg-primary/10">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {cartOpen && (
        <div className="fixed inset-0 z-[70] bg-black/40" onClick={() => setCartOpen(false)}>
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-md border-l border-white/70 bg-white/80 p-5 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-2xl text-primary">Your Cart</h3>
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
                    <p className="text-sm font-semibold text-ink">{item.product.title}</p>
                    <p className="text-xs text-ink/70">Qty {item.quantity}</p>
                  </GlassCard>
                ))
              )}
            </div>

            <div className="mt-6 border-t border-primary/20 pt-4">
              <p className="flex items-center justify-between text-sm text-ink/80">
                <span>Subtotal</span>
                <span className="font-semibold text-ink">PKR {getSubtotal().toLocaleString()}</span>
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

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { FiMenu, FiShoppingBag, FiX } from 'react-icons/fi';
import { useState } from 'react';
import { useCartStore } from '@/store';
import GlobalJar from '@/components/GlobalJar';

const links = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/cart', label: 'Cart' },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const { items, getSubtotal } = useCartStore();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#b8946f]/30 bg-[#f6ead8]/80 backdrop-blur-md">
        <div className="mx-auto flex h-20 w-[min(1200px,92vw)] items-center justify-between">
          <div className="flex items-center gap-3">
            <GlobalJar size="sm" withLayoutId={false} className="rounded-2xl" />
            <Link href="/" className="text-xl font-semibold tracking-[-0.03em] text-[#2a1b12]">
              NUTY BLISS
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm uppercase tracking-[0.18em] transition-opacity ${
                  pathname === link.href ? 'text-[#2a1b12]' : 'text-[#5b4230]/70 hover:text-[#2a1b12]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCartOpen(true)}
              className="magnetic inline-flex items-center gap-2 rounded-full border border-[#7b5a41]/30 px-4 py-2 text-[#2a1b12]"
            >
              <FiShoppingBag />
              <span className="text-xs uppercase tracking-[0.14em]">{items.length}</span>
            </button>
            <button
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#7b5a41]/30 text-[#2a1b12] md:hidden"
            >
              <FiMenu />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#f1dfc8]/95 backdrop-blur-lg"
          >
            <motion.div
              initial={{ x: '24%' }}
              animate={{ x: 0 }}
              exit={{ x: '24%' }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="ml-auto flex h-full w-full max-w-xl flex-col p-8"
            >
              <button className="mb-8 ml-auto text-[#2a1b12]" onClick={() => setMenuOpen(false)}>
                <FiX size={28} />
              </button>
              <div className="space-y-6">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block text-5xl font-semibold tracking-[-0.04em] text-[#2a1b12] md:text-7xl"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cartOpen && (
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2D3748]/20"
            onClick={() => setCartOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-x-0 bottom-0 max-h-[80vh] overflow-y-auto rounded-t-[2.4rem] bg-[#f6ead8] p-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-4xl font-semibold tracking-[-0.04em] text-[#2a1b12]">Cart</h3>
                <button onClick={() => setCartOpen(false)} className="text-[#2a1b12]">
                  <FiX size={24} />
                </button>
              </div>
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-[#5b4230]/70">Your cart is currently empty.</p>
                ) : (
                  items.map((item) => (
                    <div key={`${item.productId}-${item.variant?.size}`} className="rounded-2xl border border-[#b8946f]/35 p-4">
                      <p className="text-[#2a1b12]">{item.product.title}</p>
                      <p className="text-sm text-[#5b4230]/70">Qty {item.quantity}</p>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-6 flex items-center justify-between border-t border-[#b8946f]/35 pt-5">
                <p className="text-[#5b4230]/80">Subtotal</p>
                <p className="text-2xl font-semibold text-[#2a1b12]">Rs. {getSubtotal().toLocaleString()}</p>
              </div>
              <Link href="/checkout" onClick={() => setCartOpen(false)} className="liquid-btn mt-6">
                Proceed to checkout
              </Link>
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}



'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-primary/15 bg-surface">
      <div className="mx-auto grid w-[min(1200px,92vw)] gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Nuty Bliss</p>
          <h3 className="mt-3 font-display text-4xl text-ink">Crafted for ritual.</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/shop" className="text-ink hover:text-primary">Shop</Link>
          <Link href="/about" className="text-ink hover:text-primary">About</Link>
          <Link href="/contact" className="text-ink hover:text-primary">Contact</Link>
          <Link href="/checkout" className="text-ink hover:text-primary">Checkout</Link>
          <Link href="/login" className="text-ink hover:text-primary">Login</Link>
          <Link href="/signup" className="text-ink hover:text-primary">Signup</Link>
        </div>
        <div>
          <p className="text-sm text-ink/80">Lahore, Pakistan</p>
          <p className="mt-1 text-sm text-ink/80">hello@nutybliss.com</p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-ink/60">
            &copy; {new Date().getFullYear()} Nuty Bliss
          </p>
        </div>
      </div>
    </footer>
  );
}


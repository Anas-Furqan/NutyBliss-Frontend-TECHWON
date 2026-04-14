'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-[#b8946f]/30 bg-[#ead2b6]">
      <div className="mx-auto grid w-[min(1200px,92vw)] gap-10 py-16 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#5b4230]/70">Nuty Bliss</p>
          <h3 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-[#2a1b12]">Crafted for ritual.</h3>
        </div>
        <div className="space-y-3">
          <Link href="/shop" className="block text-[#2a1b12]">Shop</Link>
          <Link href="/about" className="block text-[#2a1b12]">About</Link>
          <Link href="/contact" className="block text-[#2a1b12]">Contact</Link>
          <Link href="/cart" className="block text-[#2a1b12]">Cart</Link>
        </div>
        <div>
          <p className="text-sm text-[#5b4230]/80">Lahore, Pakistan</p>
          <p className="mt-1 text-sm text-[#5b4230]/80">info@nutybliss.pk</p>
          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-[#5b4230]/60">
            &copy; {new Date().getFullYear()} Nuty Bliss
          </p>
        </div>
      </div>
    </footer>
  );
}


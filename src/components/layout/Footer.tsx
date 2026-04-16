'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from '@/lib/gsap';

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;
    const quickX = gsap.quickSetter('[data-footer-float]', 'x', 'px');
    const quickY = gsap.quickSetter('[data-footer-float]', 'y', 'px');
    const mapX = gsap.utils.mapRange(0, window.innerWidth, -12, 12);
    const mapY = gsap.utils.mapRange(0, window.innerHeight, -10, 10);
    const onMove = (event: MouseEvent) => {
      quickX(mapX(event.clientX));
      quickY(mapY(event.clientY));
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <footer ref={footerRef} className="relative z-30 mt-14 overflow-hidden border-t border-white/10 bg-[#08080c]">
      <div data-footer-float className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full border border-white/10 bg-white/5 blur-[1px]" />
      <div data-footer-float className="pointer-events-none absolute -right-8 bottom-6 h-20 w-20 rounded-full border border-white/10 bg-amber-400/10 blur-[1px]" />
      <div className="mx-auto grid w-[min(1200px,92vw)] gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/85">Nuty Bliss</p>
          <h3 className="mt-3 font-display text-4xl tracking-tighter leading-tight text-slate-200">Crafted for ritual.</h3>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link href="/shop" className="text-slate-300/90 hover:text-amber-400">Shop</Link>
          <Link href="/about" className="text-slate-300/90 hover:text-amber-400">About</Link>
          <Link href="/contact" className="text-slate-300/90 hover:text-amber-400">Contact</Link>
          <Link href="/checkout" className="text-slate-300/90 hover:text-amber-400">Checkout</Link>
          <Link href="/login" className="text-slate-300/90 hover:text-amber-400">Login</Link>
          <Link href="/signup" className="text-slate-300/90 hover:text-amber-400">Signup</Link>
        </div>
        <div className="space-y-3">
          <p className="text-sm text-white/80">Lahore, Pakistan</p>
          <p className="text-sm text-white/80">hello@nutybliss.com</p>
          <form className="glass-card mt-2 flex items-center gap-2 p-2">
            <input type="email" placeholder="Join newsletter" className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none placeholder:text-white/45" />
            <button type="submit" className="rounded-full bg-[#FF8C00] px-4 py-2 text-xs font-semibold text-[#1b1207] shadow-neon transition hover:brightness-110">
              Subscribe
            </button>
          </form>
          <p className="text-xs uppercase tracking-[0.18em] text-white/55">
            &copy; {new Date().getFullYear()} Nuty Bliss
          </p>
        </div>
      </div>
    </footer>
  );
}


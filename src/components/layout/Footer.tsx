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
    <footer ref={footerRef} className="relative z-30 mt-14 overflow-hidden border-t border-gray-200 bg-[#F9FAFB]">
      <div data-footer-float className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full border border-gray-200 bg-[#D2B48C]/12 blur-[1px]" />
      <div data-footer-float className="pointer-events-none absolute -right-8 bottom-6 h-20 w-20 rounded-full border border-gray-200 bg-[#FF8C00]/10 blur-[1px]" />
      <div className="mx-auto grid w-[min(1100px,92vw)] gap-10 py-14 text-center md:grid-cols-3 md:text-left">
        <div className="md:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-amber-400/85">Nuty Bliss</p>
          <h3 className="mt-3 font-display text-4xl tracking-tighter leading-tight text-[#3E2723]">Crafted for ritual.</h3>
          <p className="mt-3 text-sm text-[#2D3748]">Lahore, Pakistan</p>
        </div>

        <div className="space-y-4 text-center">
          <p className="text-xs uppercase tracking-[0.18em] text-[#2D3748]">Stay in the Loop</p>
          <form className="glass-card mx-auto mt-2 flex w-full max-w-sm items-center gap-2 p-2 shadow-sm">
            <input type="email" placeholder="Join newsletter" className="w-full bg-transparent px-3 py-2 text-sm text-[#3E2723] outline-none placeholder:text-[#2D3748]/55" />
            <button type="submit" className="rounded-full bg-[#FF8C00] px-4 py-2 text-xs font-semibold text-[#1b1207] shadow-neon transition hover:brightness-110">
              Subscribe
            </button>
          </form>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm pt-1">
            <Link href="/shop" className="text-[#5C4033] hover:text-[#FF8C00]">Shop</Link>
            <Link href="/about" className="text-[#5C4033] hover:text-[#FF8C00]">About</Link>
            <Link href="/contact" className="text-[#5C4033] hover:text-[#FF8C00]">Contact</Link>
            <Link href="/track-order" className="text-[#5C4033] hover:text-[#FF8C00]">Track Order</Link>
          </div>
          <p className="text-xs uppercase tracking-[0.18em] text-[#2D3748]">
            &copy; {new Date().getFullYear()} Nuty Bliss
          </p>
        </div>

        <div className="space-y-3 md:text-right">
          <p className="text-sm text-[#2D3748]">hello@nutybliss.com</p>
          <p className="text-xs text-[#2D3748]">
            Designed and Developed by{' '}
            <a
              href="https://www.linkedin.com/in/anas-furqan/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-400 bg-clip-text font-semibold text-transparent transition hover:brightness-110"
            >
              Anas Furqan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


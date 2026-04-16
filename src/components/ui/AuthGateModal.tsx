'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap, initGSAP } from '@/lib/gsap';

type AuthGateModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
};

export default function AuthGateModal({
  open,
  onClose,
  title = 'Sign in to continue',
  message = 'Please login or create an account to add products to cart and checkout.',
}: AuthGateModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !panelRef.current) return;
    initGSAP();
    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, y: 24, scale: 0.96 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.35, ease: 'power2.out' }
    );
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md" onClick={onClose}>
      <div
        ref={panelRef}
        className="w-full max-w-md rounded-[1.4rem] border border-white/[0.1] bg-[#090909]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Nuty Bliss Access</p>
        <h3 className="mt-2 font-display text-3xl tracking-tighter leading-tight text-slate-200">{title}</h3>
        <p className="mt-3 text-sm text-slate-300/80">{message}</p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Link href="/login" className="btn-primary w-full text-center" onClick={onClose}>
            Login
          </Link>
          <Link href="/signup" className="btn-ghost w-full justify-center" onClick={onClose}>
            Register
          </Link>
        </div>

        <button type="button" onClick={onClose} className="mt-3 w-full text-sm text-slate-400 hover:text-slate-200">
          Not now
        </button>
      </div>
    </div>
  );
}

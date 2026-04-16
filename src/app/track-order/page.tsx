'use client';

import Image from 'next/image';
import { FormEvent, useRef, useState } from 'react';
import { gsap, initGSAP } from '@/lib/gsap';

const states = ['Ordered', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered'];

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [revealed, setRevealed] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  const onTrack = (event: FormEvent) => {
    event.preventDefault();
    if (!orderId.trim()) return;
    initGSAP();
    setRevealed(true);
    requestAnimationFrame(() => {
      if (!timelineRef.current || !markerRef.current) return;
      gsap.fromTo(
        '[data-track-item]',
        { autoAlpha: 0, x: 24 },
        { autoAlpha: 1, x: 0, stagger: 0.14, duration: 0.48, ease: 'power2.out' },
      );
      gsap.fromTo(
        '[data-track-line]',
        { scaleY: 0, transformOrigin: 'center top' },
        { scaleY: 1, duration: 0.7, ease: 'power2.out' },
      );
      const finalY = (states.length - 1) * 108;
      gsap.fromTo(markerRef.current, { y: 0, autoAlpha: 0 }, { y: finalY, autoAlpha: 1, duration: 1.2, ease: 'power3.inOut' });
    });
  };

  return (
    <main className="min-h-[88vh] bg-surface pb-32 pt-32">
      <section className="mx-auto w-[min(980px,92vw)]">
        <h1 className="text-center font-display text-6xl tracking-tighter leading-tight text-slate-200">Track Order</h1>
        <p className="mt-3 text-center text-slate-300/80">Enter your order ID and reveal delivery progress.</p>

        <form onSubmit={onTrack} className="mx-auto mt-8 max-w-2xl">
          <div className="rounded-full border border-orange-500/50 bg-white/[0.03] p-2 shadow-[0_0_0_1px_rgba(255,140,0,0.22),0_0_24px_rgba(255,140,0,0.22)] backdrop-blur-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <input
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="NB-ORDER-2026-001"
                className="h-14 flex-1 rounded-full border border-white/10 bg-[#090913] px-6 text-lg text-slate-200 outline-none placeholder:text-slate-500 focus:border-[#FF8C00]"
              />
              <button type="submit" className="h-14 rounded-full bg-[#FF8C00] px-7 text-sm font-semibold text-[#1c1206] shadow-neon transition hover:brightness-110">
                Track
              </button>
            </div>
          </div>
        </form>

        {revealed && (
          <div ref={timelineRef} className="relative mx-auto mt-12 max-w-3xl">
            <div className="absolute left-5 top-0 h-full w-px bg-white/10" />
            <div data-track-line className="absolute left-5 top-0 h-full w-px bg-gradient-to-b from-[#FF8C00] to-[#4B0082]" />
            <div ref={markerRef} className="absolute left-[6px] top-0 z-20 h-8 w-8 overflow-hidden rounded-full border border-white/20 bg-black/70 shadow-[0_12px_30px_rgba(0,0,0,0.45)]">
              <Image src="/images/logo.jpeg" alt="Nuty marker" fill className="object-cover" />
            </div>

            <div className="space-y-7 pl-16">
              {states.map((item, index) => (
                <article key={item} data-track-item className="glass-card p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-400">Step {index + 1}</p>
                  <h2 className="mt-2 font-display text-3xl tracking-tighter leading-tight text-slate-200">{item}</h2>
                  <p className="mt-2 text-sm text-slate-300/75">Premium timeline preview for live order transit states.</p>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

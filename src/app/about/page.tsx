'use client';

import { useEffect, useRef } from 'react';
import { gsap, initGSAP } from '@/lib/gsap';

const timeline = [
  { title: 'Farm Selection', text: 'Organic growers from rain-fed regions deliver fresh high-oil peanuts.' },
  { title: 'Small Batch Roast', text: 'Each lot is profiled to unlock sweetness and depth without bitterness.' },
  { title: 'Stone Textureing', text: 'The blend is milled to creamy body while preserving natural nut fragrance.' },
  { title: 'Jar & Seal', text: 'Every jar is sealed fresh, labeled, and shipped with lot traceability.' },
];

export default function AboutPage() {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    const root = wrapRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-timeline-line]',
        { scaleY: 0, transformOrigin: 'top center' },
        {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: '[data-timeline]',
            start: 'top 75%',
            end: 'bottom 75%',
            scrub: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={wrapRef} className="bg-surface pb-16 pt-32">
      <section className="mx-auto w-[min(1000px,92vw)]">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">About</p>
        <h1 className="mt-3 font-display text-6xl text-ink md:text-7xl">Farm-to-Jar Timeline</h1>
      </section>

      <section data-timeline className="relative mx-auto mt-12 w-[min(1000px,92vw)]">
        <div className="absolute left-6 top-0 h-full w-[2px] bg-primary/15">
          <div data-timeline-line className="h-full w-full bg-gradient-to-b from-primary to-secondary" />
        </div>

        <div className="space-y-10 pl-16">
          {timeline.map((step) => (
            <article key={step.title} className="glass-card p-5">
              <h2 className="font-display text-3xl text-ink">{step.title}</h2>
              <p className="mt-2 text-ink/80">{step.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}


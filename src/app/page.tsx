'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import GlobalJar from '@/components/GlobalJar';

gsap.registerPlugin(ScrollTrigger);

const highlights = [
  'Small-batch roasted peanuts',
  'Velvet texture, zero fillers',
  'Crafted for daily ritual',
];

export default function HomePage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !jarRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(jarRef.current, { y: -120, scale: 0.58, rotate: -7 });

      gsap.to(jarRef.current, {
        y: 120,
        scale: 1,
        rotate: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '55% top',
          scrub: true,
        },
      });

      gsap.to(jarRef.current, {
        y: 560,
        scale: 0.78,
        rotate: 8,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: '58% top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }, sectionRef);

    return () => {
      context.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative overflow-hidden bg-[#f9f0e4]">
      <div ref={jarRef} className="pointer-events-none fixed left-1/2 top-20 z-30 -translate-x-1/2">
        <GlobalJar size="xl" />
      </div>

      <section className="mx-auto grid min-h-[86vh] w-[min(1200px,92vw)] items-end pb-24 pt-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs uppercase tracking-[0.24em] text-[#5b4230]/70"
        >
          Nuty Bliss — editorial pantry
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mt-5 text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl"
        >
          PEANUT BUTTER,
          <br />
          SCULPTED.
        </motion.h1>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/shop" className="liquid-btn">Shop the gallery</Link>
          <Link href="/about" className="magnetic rounded-full border border-[#7b5a41]/35 px-6 py-3 text-xs uppercase tracking-[0.18em] text-[#2a1b12]">
            Our story
          </Link>
        </div>
      </section>

      <section className="mx-auto grid w-[min(1200px,92vw)] gap-6 pb-28 pt-24 md:grid-cols-3">
        {highlights.map((item) => (
          <div key={item} className="glass-card">
            <p className="text-2xl font-semibold tracking-[-0.03em] text-[#2a1b12]">{item}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto w-[min(1200px,92vw)] pb-32">
        <div className="rounded-[2.6rem] bg-[#2a1b12] px-8 py-16 md:px-16">
          <p className="text-xs uppercase tracking-[0.2em] text-[#f1dfc8]/70">Fresh drop</p>
          <h2 className="mt-4 text-6xl font-semibold tracking-[-0.05em] text-[#f9f0e4] md:text-8xl">
            DISCOVER THE SIGNATURE COLLECTION
          </h2>
          <p className="mt-5 max-w-2xl text-[#f1dfc8]/75">
            Deep roast notes, clean ingredient decks, and a gallery-forward curation for indulgent everyday nutrition.
          </p>
          <Link href="/shop" className="liquid-btn mt-8">Enter shop</Link>
        </div>
      </section>
    </div>
  );
}


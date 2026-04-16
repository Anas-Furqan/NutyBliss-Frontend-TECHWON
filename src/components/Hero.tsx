'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { gsap, initGSAP, Observer } from '@/lib/gsap';

const frontOrnaments = ['/images/product (4).jpeg', '/images/product (5).jpeg'];
const backOrnaments = ['/images/product (2).jpeg', '/images/product (3).jpeg'];

export default function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    const root = rootRef.current;
    const jar = jarRef.current;
    if (!root || !jar) return;

    const ctx = gsap.context(() => {
      const front = gsap.utils.toArray<HTMLElement>('[data-front]');
      const back = gsap.utils.toArray<HTMLElement>('[data-back]');

      gsap.from('[data-hero-copy]', {
        y: 28,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: 'power2.out',
      });

      gsap.to(jar, {
        rotate: 360,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
          pin: '[data-hero-pin]',
        },
      });

      gsap.to([...front, ...back], {
        y: 'random(-40,40)',
        x: 'random(-30,30)',
        rotate: 'random(-25,25)',
        duration: 'random(3.2,5.8)',
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: 0.08,
      });

      const quickX = gsap.quickSetter('[data-float]', 'x', 'px');
      const quickY = gsap.quickSetter('[data-float]', 'y', 'px');
      const mapX = gsap.utils.mapRange(0, window.innerWidth, -16, 16);
      const mapY = gsap.utils.mapRange(0, window.innerHeight, -20, 20);

      const onMove = (event: MouseEvent) => {
        quickX(mapX(event.clientX));
        quickY(mapY(event.clientY));
      };

      window.addEventListener('mousemove', onMove);
      Observer.create({
        target: window,
        type: 'wheel,touch,pointer',
        onDown: () => gsap.to(front, { scale: 1.08, duration: 0.2, overwrite: true }),
        onUp: () => gsap.to(front, { scale: 1, duration: 0.25, overwrite: true }),
      });
      return () => window.removeEventListener('mousemove', onMove);
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative min-h-[140vh] pt-28">
      <div data-hero-pin className="sticky top-20 z-20 mx-auto max-w-7xl px-4">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p data-hero-copy className="text-sm uppercase tracking-[0.22em] text-primary/80">
              Organic Energy Collection
            </p>
            <h1 data-hero-copy className="mt-4 text-5xl font-bold text-ink md:text-7xl">
              Premium Peanut Butter, Animated to Feel Tasty.
            </h1>
            <p data-hero-copy className="mt-5 max-w-xl text-base text-ink/80">
              Nuty blends deep-roasted peanuts and rich cacao notes into a premium pantry ritual with clean ingredients.
            </p>
            <div data-hero-copy className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Explore Shop
              </Link>
              <Link href="/about" className="btn-secondary">
                Farm to Jar Story
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[420px] w-full max-w-[420px]">
            {backOrnaments.map((src, idx) => (
              <div
                key={`back-${src}-${idx}`}
                data-back
                data-float
                className="absolute z-0 overflow-hidden rounded-full"
                style={{ left: `${10 + idx * 52}%`, top: `${14 + idx * 20}%`, width: 92, height: 92, opacity: 0.4 }}
              >
                <Image src={src} alt="Back layer ornament" fill className="object-cover" />
              </div>
            ))}

            <div ref={jarRef} className="relative z-20 h-full w-full drop-shadow-[0_28px_48px_rgba(62,39,35,0.28)]">
              <Image
                src="/images/product (1).jpeg"
                alt="Nuty peanut butter hero jar"
                fill
                priority
                className="rounded-[2.2rem] object-cover"
              />
            </div>

            {frontOrnaments.map((src, idx) => (
              <div
                key={`front-${src}-${idx}`}
                data-front
                data-float
                className="absolute z-30 overflow-hidden rounded-full border border-white/40"
                style={{ left: `${idx * 60}%`, top: `${58 + idx * 14}%`, width: 106, height: 106 }}
              >
                <Image src={src} alt="Front layer ornament" fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

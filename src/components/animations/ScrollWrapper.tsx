'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap';
import type { ReactNode } from 'react';

export default function ScrollWrapper({ children }: { children: ReactNode }) {
  const frameRef = useRef<number>();

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = requestAnimationFrame(raf);
    };

    frameRef.current = requestAnimationFrame(raf);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

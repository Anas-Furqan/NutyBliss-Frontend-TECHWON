'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mainRef.current) return;
    gsap.fromTo(
      mainRef.current,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
    );
  }, [pathname]);

  return <main key={pathname} ref={mainRef} className="min-h-screen">{children}</main>;
}


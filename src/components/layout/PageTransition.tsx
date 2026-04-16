'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from '@/lib/gsap';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    gsap.fromTo(
      containerRef.current,
      { autoAlpha: 0, y: 22 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power2.out' },
    );
  }, [pathname]);

  return <div key={pathname} ref={containerRef} className="overflow-visible">{children}</div>;
}


'use client';

import { useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import { gsap, initGSAP } from '@/lib/gsap';

type Ornament = {
  id: number;
  x: number;
  y: number;
  size: number;
  depth: number;
  src: string;
  alt: string;
};

const assets = [
  { src: '/images/product (4).jpeg', alt: 'Chocolate swirl ornament' },
  { src: '/images/product (5).jpeg', alt: 'Flying peanut ornament' },
  { src: '/images/product (2).jpeg', alt: 'Organic nut ornament' },
];

export default function FlyingOrnaments() {
  const rootRef = useRef<HTMLDivElement>(null);

  const ornaments = useMemo<Ornament[]>(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const asset = assets[i % assets.length];
        return {
          id: i,
          x: Math.round(gsap.utils.random(3, 95)),
          y: Math.round(gsap.utils.random(4, 92)),
          size: Math.round(gsap.utils.random(42, 120)),
          depth: Number(gsap.utils.random(0.2, 1).toFixed(2)),
          src: asset.src,
          alt: asset.alt,
        };
      }),
    [],
  );

  useEffect(() => {
    initGSAP();
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('[data-ornament]', root);

      items.forEach((item) => {
        const depth = Number(item.dataset.depth ?? '0.5');
        gsap.to(item, {
          y: `${gsap.utils.random(-22, 22)}`,
          x: `${gsap.utils.random(-18, 18)}`,
          rotate: gsap.utils.random(-8, 8),
          duration: gsap.utils.random(4, 8),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });

        gsap.to(item, {
          yPercent: -28 * depth,
          ease: 'none',
          scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ornaments.map((item) => (
        <div
          key={item.id}
          data-ornament
          data-depth={item.depth}
          className="absolute will-change-transform"
          style={{
            left: `${item.x}%`,
            top: `${item.y}%`,
            width: item.size,
            height: item.size,
            opacity: 0.18 + item.depth * 0.4,
            filter: item.depth > 0.78 ? 'blur(0.6px)' : 'none',
          }}
        >
          <Image
            src={item.src}
            alt={item.alt}
            fill
            className="rounded-full object-cover"
            sizes="120px"
          />
        </div>
      ))}
    </div>
  );
}

'use client';

import { useMemo } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';

type Ornament = {
  id: number;
  size: number;
  left: number;
  top: number;
  depth: number;
  tone: string;
};

export default function Ornaments() {
  const { scrollY } = useScroll();

  const ornaments = useMemo<Ornament[]>(
    () => [
      { id: 1, size: 180, left: 6, top: 10, depth: 0.2, tone: '#f0dfc7' },
      { id: 2, size: 110, left: 88, top: 14, depth: 0.45, tone: '#d3b28a' },
      { id: 3, size: 240, left: 79, top: 58, depth: 0.68, tone: '#f7e8d6' },
      { id: 4, size: 120, left: 21, top: 60, depth: 0.52, tone: '#c59a6a' },
      { id: 5, size: 140, left: 47, top: 30, depth: 0.32, tone: '#e8ccab' },
    ],
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {ornaments.map((ornament) => (
        <OrnamentLayer key={ornament.id} ornament={ornament} scrollY={scrollY} />
      ))}
    </div>
  );
}

function OrnamentLayer({
  ornament,
  scrollY,
}: {
  ornament: Ornament;
  scrollY: MotionValue<number>;
}) {
  const parallaxY = useTransform(scrollY, [0, 2400], [0, ornament.depth * 220]);

  return (
    <motion.div
      style={{ y: parallaxY }}
      className="absolute will-change-transform"
      animate={{ y: [0, -14, 0] }}
      transition={{ duration: 4 + ornament.depth * 2.2, repeat: Number.POSITIVE_INFINITY, ease: 'easeInOut' }}
    >
      <svg
        viewBox="0 0 200 200"
        width={ornament.size}
        height={ornament.size}
        style={{
          position: 'absolute',
          left: `${ornament.left}vw`,
          top: `${ornament.top}vh`,
          filter: ornament.depth > 0.55 ? 'blur(0.8px)' : 'none',
          opacity: ornament.depth > 0.5 ? 0.65 : 0.4,
        }}
      >
        <path
          d="M168 95c26 41-9 92-66 95C47 194 9 157 9 107 9 55 46 7 101 7c47 0 49 45 67 88Z"
          fill={ornament.tone}
        />
      </svg>
    </motion.div>
  );
}


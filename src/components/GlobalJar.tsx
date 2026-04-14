'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import clsx from 'clsx';

type GlobalJarProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  src?: string;
  withLayoutId?: boolean;
};

const sizeMap = {
  sm: 'h-12 w-12',
  md: 'h-24 w-24',
  lg: 'h-44 w-44',
  xl: 'h-72 w-72',
};

export default function GlobalJar({
  size = 'md',
  className,
  src = '/images/logo.jpeg',
  withLayoutId = true,
}: GlobalJarProps) {
  return (
    <motion.div
      layoutId={withLayoutId ? 'global-jar' : undefined}
      transition={{ type: 'spring', stiffness: 150, damping: 24 }}
      className={clsx(
        'relative overflow-hidden rounded-[2rem] border border-[#7c5d3e]/25 bg-[#f3e7d4] shadow-[0_30px_80px_rgba(94,67,44,0.24)]',
        sizeMap[size],
        className,
      )}
    >
      <Image src={src} alt="Nuty Bliss jar" fill className="object-cover" priority />
    </motion.div>
  );
}


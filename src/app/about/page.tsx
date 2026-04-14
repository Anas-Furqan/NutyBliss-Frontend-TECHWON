'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import GlobalJar from '@/components/GlobalJar';

const pillars = [
  { title: 'Roast Discipline', text: 'Every batch is roasted to a controlled profile for depth and sweetness.' },
  { title: 'Texture Craft', text: 'From creamy to crush, each jar is tuned for a premium spoon-feel.' },
  { title: 'Clean Ingredients', text: 'No noise in the label. Just what belongs in a functional pantry.' },
];

export default function AboutPage() {
  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#5b4230]/70">About</p>
            <h1 className="mt-4 text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl">
              RITUAL
              <br />
              DRIVEN
            </h1>
          </div>
          <GlobalJar size="lg" className="rotate-[6deg]" />
        </div>
      </section>

      <section className="mx-auto grid w-[min(1200px,92vw)] gap-6 md:grid-cols-3">
        {pillars.map((pillar, index) => (
          <motion.div
            key={pillar.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            viewport={{ once: true }}
            className="glass-card"
          >
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">{pillar.title}</h2>
            <p className="mt-3 text-[#5b4230]/80">{pillar.text}</p>
          </motion.div>
        ))}
      </section>

      <section className="mx-auto mt-16 w-[min(1200px,92vw)] rounded-[2.6rem] bg-[#2a1b12] px-8 py-14 md:px-16">
        <p className="text-xs uppercase tracking-[0.2em] text-[#f1dfc8]/70">Our promise</p>
        <h2 className="mt-4 text-5xl font-semibold tracking-[-0.05em] text-[#f9f0e4] md:text-7xl">
          Always premium. Always nourishing.
        </h2>
        <p className="mt-5 max-w-2xl text-[#f1dfc8]/75">
          Nuty Bliss exists for people who want taste without compromise and design without clutter.
        </p>
        <Link href="/shop" className="liquid-btn mt-8">Shop now</Link>
      </section>
    </div>
  );
}


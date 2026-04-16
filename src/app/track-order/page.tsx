'use client';

import { useMemo, useState } from 'react';
import { deliverySteps } from '@/lib/site-data';

export default function TrackOrderPage() {
  const [step, setStep] = useState(2);
  const progress = useMemo(() => (step / (deliverySteps.length - 1)) * 100, [step]);

  return (
    <main className="bg-surface pb-20 pt-32">
      <section className="mx-auto w-[min(980px,92vw)]">
        <h1 className="font-display text-6xl text-ink">Track Order</h1>
        <p className="mt-3 text-ink/75">Visual delivery lane with a moving peanut marker.</p>

        <div className="glass-card mt-8 p-6">
          <div className="relative h-2 rounded-full bg-primary/10">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${progress}%` }} />
            <div className="absolute -top-4 transition-all duration-300" style={{ left: `calc(${progress}% - 10px)` }}>
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-secondary" fill="currentColor">
                <path d="M10 2c-2 0-4 1-5 3s-1 5 1 7 2 6 0 8c3 2 7 2 10 0-2-2-2-6 0-8s2-5 1-7-3-3-5-3h-2z" />
              </svg>
            </div>
          </div>

          <div className="mt-7 grid gap-3 md:grid-cols-5">
            {deliverySteps.map((item, index) => (
              <button
                key={item}
                className={`rounded-lg border px-3 py-2 text-left text-sm ${index <= step ? 'border-primary bg-primary/10 text-ink' : 'border-primary/15 text-ink/60'}`}
                onClick={() => setStep(index)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

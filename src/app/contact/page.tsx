'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import GlobalJar from '@/components/GlobalJar';

type ContactForm = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async () => {
    setSending(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    toast.success('Message received. We will reply shortly.');
    reset();
    setSending(false);
  };

  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#5b4230]/70">Contact</p>
            <h1 className="mt-4 text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl">
              LET&apos;S
              <br />
              TALK
            </h1>
          </div>
          <GlobalJar size="lg" className="rotate-[-8deg]" />
        </div>
      </section>

      <section className="mx-auto grid w-[min(1200px,92vw)] gap-8 lg:grid-cols-2">
        <div className="glass-card">
          <p className="text-xs uppercase tracking-[0.2em] text-[#5b4230]/70">Studio</p>
          <p className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Lahore, Pakistan</p>
          <p className="mt-2 text-[#5b4230]/80">info@nutybliss.pk</p>
          <p className="mt-1 text-[#5b4230]/80">+92 300 1234567</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4">
          <div>
            <input
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
              className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 text-[#2a1b12] outline-none"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>
          <div>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Email"
              className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 text-[#2a1b12] outline-none"
            />
            {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register('subject', { required: 'Subject is required' })}
              placeholder="Subject"
              className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 text-[#2a1b12] outline-none"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-700">{errors.subject.message}</p>}
          </div>
          <div>
            <textarea
              rows={6}
              {...register('message', { required: 'Message is required' })}
              placeholder="Message"
              className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 text-[#2a1b12] outline-none"
            />
            {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>}
          </div>
          <button disabled={sending} className="liquid-btn w-full">
            {sending ? 'Sending...' : 'Send message'}
          </button>
        </form>
      </section>
    </div>
  );
}


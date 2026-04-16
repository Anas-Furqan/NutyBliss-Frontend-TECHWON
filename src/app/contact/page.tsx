'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import GlassCard from '@/components/ui/GlassCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

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
    <main className="bg-surface pb-16 pt-32">
      <section className="mx-auto w-[min(1100px,92vw)]">
        <p className="text-xs uppercase tracking-[0.22em] text-primary/75">Contact</p>
        <h1 className="mt-3 font-display text-6xl text-ink">Floating Support Desk</h1>
      </section>

      <section className="mx-auto mt-10 grid w-[min(1100px,92vw)] gap-8 lg:grid-cols-2">
        <GlassCard className="p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Studio</p>
          <p className="mt-4 font-display text-3xl text-ink">Lahore, Pakistan</p>
          <p className="mt-2 text-ink/80">hello@nutybliss.com</p>
          <p className="mt-1 text-ink/80">+92 300 1234567</p>
        </GlassCard>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card space-y-4 p-6">
          <div>
            <Input
              {...register('name', { required: 'Name is required' })}
              placeholder="Name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-700">{errors.name.message}</p>}
          </div>
          <div>
            <Input
              type="email"
              {...register('email', { required: 'Email is required' })}
              placeholder="Email"
            />
            {errors.email && <p className="mt-1 text-sm text-red-700">{errors.email.message}</p>}
          </div>
          <div>
            <Input
              {...register('subject', { required: 'Subject is required' })}
              placeholder="Subject"
            />
            {errors.subject && <p className="mt-1 text-sm text-red-700">{errors.subject.message}</p>}
          </div>
          <div>
            <textarea
              rows={6}
              {...register('message', { required: 'Message is required' })}
              placeholder="Message"
              className="focus-gradient w-full rounded-xl2"
            />
            {errors.message && <p className="mt-1 text-sm text-red-700">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" >
            {sending ? 'Sending...' : 'Send message'}
          </Button>
        </form>
      </section>
    </main>
  );
}


'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type SignupForm = { name: string; email: string; phone: string; password: string };

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<SignupForm>();

  return (
    <main className="min-h-screen bg-surface pt-28">
      <section className="mx-auto grid w-[min(1080px,92vw)] overflow-hidden rounded-[1.6rem] border border-primary/15 bg-white/75 backdrop-blur lg:grid-cols-2">
        <div className="relative min-h-[360px] border-b border-primary/10 lg:border-b-0 lg:border-r">
          <Image src="/images/product (3).jpeg" alt="Nuty signup visual" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-transparent" />
        </div>

        <div className="p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Join Nuty</p>
          <h1 className="mt-3 font-display text-5xl text-ink">Signup</h1>
          <form onSubmit={handleSubmit(() => undefined)} className="mt-6 space-y-4">
            <Input {...register('name')} placeholder="Full name" />
            <Input {...register('email')} type="email" placeholder="Email" />
            <Input {...register('phone')} placeholder="Phone" />
            <Input {...register('password')} type="password" placeholder="Password" />
            <Button type="submit" className="w-full">Create account</Button>
          </form>
          <p className="mt-4 text-sm text-ink/70">
            Already have an account? <Link href="/login" className="text-primary">Login</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

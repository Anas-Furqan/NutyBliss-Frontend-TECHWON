'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();

  return (
    <main className="min-h-screen bg-surface pt-28">
      <section className="mx-auto grid w-[min(1080px,92vw)] overflow-hidden rounded-[1.6rem] border border-primary/15 bg-white/75 backdrop-blur lg:grid-cols-2">
        <div className="relative min-h-[360px] border-b border-primary/10 lg:border-b-0 lg:border-r">
          <Image src="/images/product (1).jpeg" alt="Nuty auth visual" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 to-transparent" />
        </div>

        <div className="p-8">
          <p className="text-xs uppercase tracking-[0.2em] text-primary/70">Welcome Back</p>
          <h1 className="mt-3 font-display text-5xl text-ink">Login</h1>
          <form onSubmit={handleSubmit(() => undefined)} className="mt-6 space-y-4">
            <Input {...register('email')} type="email" placeholder="Email" />
            <Input {...register('password')} type="password" placeholder="Password" />
            <Button type="submit" className="w-full">Continue</Button>
          </form>
          <p className="mt-4 text-sm text-ink/70">
            New here? <Link href="/signup" className="text-primary">Create account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { gsap, initGSAP } from '@/lib/gsap';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type LoginForm = { email: string; password: string };

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    if (!jarRef.current) return;
    gsap.to(jarRef.current, {
      rotateY: 360,
      transformPerspective: 900,
      transformOrigin: 'center center',
      duration: 9,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  const onSubmit = async (values: LoginForm) => {
    try {
      const { data } = await authAPI.login(values);
      setAuth(data.user, data.token);
      toast.success('Welcome back!');
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/shop');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="min-h-screen bg-surface pb-32 pt-24">
      <section className="mx-auto grid min-h-[78vh] w-[min(1180px,94vw)] overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-white/[0.03] backdrop-blur-2xl lg:grid-cols-2">
        <div className="grain-bg relative flex items-center justify-center overflow-hidden border-b border-white/[0.08] lg:border-b-0 lg:border-r">
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute -right-10 bottom-10 h-28 w-28 rounded-full bg-[#4B0082]/35 blur-2xl" />
          <div ref={jarRef} className="relative h-[360px] w-[360px] will-change-transform">
            <Image src="/images/product (1).jpeg" alt="Nuty jar rotator" fill priority className="rounded-[2rem] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        <div className="flex items-center p-8 lg:p-12">
          <div className="w-full">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-400">Welcome Back</p>
            <h1 className="mt-3 font-display text-5xl tracking-tighter leading-tight text-slate-200">Login</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <label className="group relative block">
                <input {...register('email')} type="email" placeholder=" " className="peer h-14 w-full border-b border-white/20 bg-transparent px-1 text-slate-200 outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-slate-400 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Email</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>

              <label className="group relative block">
                <input {...register('password')} type="password" placeholder=" " className="peer h-14 w-full border-b border-white/20 bg-transparent px-1 text-slate-200 outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-slate-400 transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Password</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>

              <button type="submit" className="btn-primary w-full">Continue</button>
            </form>

            <p className="mt-5 text-sm text-slate-300/80">
              New here? <Link href="/signup" className="text-amber-400">Create account</Link>
            </p>
            <p className="mt-2 text-sm text-slate-400">
              Admin? <Link href="/admin/login" className="text-amber-400">Access admin login</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

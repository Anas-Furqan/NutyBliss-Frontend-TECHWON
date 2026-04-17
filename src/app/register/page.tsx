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

type SignupForm = { name: string; email: string; phone: string; password: string };

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<SignupForm>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const router = useRouter();
  const jarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    if (!jarRef.current) return;
    gsap.to(jarRef.current, {
      rotateY: -360,
      transformPerspective: 900,
      transformOrigin: 'center center',
      duration: 10,
      repeat: -1,
      ease: 'none',
    });
  }, []);

  const onSubmit = async (values: SignupForm) => {
    try {
      const { data } = await authAPI.register(values);
      setAuth(data.user, data.token);
      toast.success('Account created successfully');
      router.push('/shop');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="min-h-screen bg-surface pb-32 pt-24">
      <section className="mx-auto grid min-h-[78vh] w-[min(1180px,94vw)] overflow-hidden rounded-[1.8rem] border border-gray-200 bg-white backdrop-blur-2xl lg:grid-cols-2">
        <div className="grain-bg relative flex items-center justify-center overflow-hidden border-b border-gray-200 lg:border-b-0 lg:border-r">
          <div className="absolute -left-10 top-10 h-24 w-24 rounded-full bg-amber-400/20 blur-2xl" />
          <div className="absolute -right-10 bottom-10 h-28 w-28 rounded-full bg-[#4B0082]/35 blur-2xl" />
          <div ref={jarRef} className="relative h-[360px] w-[360px] will-change-transform">
            <Image src="/images/product (3).jpeg" alt="Nuty jar rotator" fill priority className="rounded-[2rem] object-cover shadow-[0_20px_50px_rgba(0,0,0,0.5)]" />
          </div>
        </div>

        <div className="flex items-center p-8 lg:p-12">
          <div className="w-full">
            <p className="text-xs uppercase tracking-[0.22em] text-amber-400">Join Nuty</p>
            <h1 className="mt-3 font-display text-5xl tracking-tighter leading-tight text-[#3E2723]">Signup</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
              <label className="group relative block">
                <input {...register('name')} placeholder=" " className="peer h-14 w-full border-b border-gray-300 bg-transparent px-1 text-[#3E2723] outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-[#2D3748] transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Full name</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>
              <label className="group relative block">
                <input {...register('email')} type="email" placeholder=" " className="peer h-14 w-full border-b border-gray-300 bg-transparent px-1 text-[#3E2723] outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-[#2D3748] transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Email</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>
              <label className="group relative block">
                <input {...register('phone')} placeholder=" " className="peer h-14 w-full border-b border-gray-300 bg-transparent px-1 text-[#3E2723] outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-[#2D3748] transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Phone</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>
              <label className="group relative block">
                <input {...register('password')} type="password" placeholder=" " className="peer h-14 w-full border-b border-gray-300 bg-transparent px-1 text-[#3E2723] outline-none transition-colors focus:border-[#FF8C00]" />
                <span className="pointer-events-none absolute left-1 top-4 text-sm text-[#2D3748] transition-all peer-focus:-top-3 peer-focus:text-xs peer-focus:text-amber-400 peer-[&:not(:placeholder-shown)]:-top-3 peer-[&:not(:placeholder-shown)]:text-xs">Password</span>
                <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF8C00] to-[#ffc266] transition-all duration-300 peer-focus:w-full" />
              </label>
              <button type="submit" className="btn-primary w-full">Create account</button>
            </form>

            <p className="mt-5 text-sm text-[#2D3748]/80">
              Already registered? <Link href="/login" className="text-amber-400">Login</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}


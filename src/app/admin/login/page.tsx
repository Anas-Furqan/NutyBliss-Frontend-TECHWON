'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/lib/api';
import { useAuthStore } from '@/store';
import { gsap, initGSAP } from '@/lib/gsap';
import toast from 'react-hot-toast';

type AdminLoginForm = {
  email: string;
  password: string;
};

export default function AdminLoginPage() {
  const { register, handleSubmit } = useForm<AdminLoginForm>();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isAuthenticated, user, isHydrated } = useAuthStore();
  const router = useRouter();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initGSAP();
    if (!panelRef.current) return;
    gsap.fromTo(panelRef.current, { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' });
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    if (isAuthenticated && user?.role === 'admin') {
      router.push('/admin');
    }
  }, [isHydrated, isAuthenticated, user, router]);

  const onSubmit = async (values: AdminLoginForm) => {
    try {
      const { data } = await authAPI.login(values);
      if (data?.user?.role !== 'admin') {
        toast.error('Admin access only');
        return;
      }
      setAuth(data.user, data.token);
      toast.success('Welcome Admin');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <main className="min-h-screen bg-[#F9FAFB] px-4 py-20 text-[#3E2723]">
      <div ref={panelRef} className="mx-auto w-full max-w-md rounded-[1.4rem] border border-gray-200 bg-white p-6 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <p className="text-xs uppercase tracking-[0.2em] text-amber-400">Nuty Bliss</p>
        <h1 className="mt-2 font-display text-4xl tracking-tighter">Admin Login</h1>
        <p className="mt-2 text-sm text-[#2D3748]">Secure admin-only access panel.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <input
            {...register('email', { required: true })}
            type="email"
            placeholder="Admin email"
            className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#3E2723] outline-none"
          />
          <input
            {...register('password', { required: true })}
            type="password"
            placeholder="Password"
            className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-[#3E2723] outline-none"
          />
          <button type="submit" className="btn-primary w-full">
            Access Admin Panel
          </button>
        </form>
      </div>
    </main>
  );
}



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCartStore, useAuthStore } from '@/store';
import { ordersAPI } from '@/lib/api';
import GlobalJar from '@/components/GlobalJar';

type CheckoutForm = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  paymentMethod: 'cod' | 'card';
};

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, discount, couponCode, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: {
      fullName: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      paymentMethod: 'cod',
    },
  });

  const paymentMethod = watch('paymentMethod');
  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/cart');
    }
  }, [items.length, router]);

  if (items.length === 0) {
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true);
    try {
      const order = await ordersAPI.create({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
        },
        paymentMethod: data.paymentMethod,
        couponCode: couponCode || undefined,
      });
      clearCart();
      toast.success('Order placed successfully');
      router.push(`/order-success?orderNumber=${order.data.order.orderNumber}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f9f0e4] pb-24">
      <section className="mx-auto w-[min(1200px,92vw)] py-16">
        <div className="flex items-end justify-between gap-5">
          <h1 className="text-7xl font-semibold tracking-[-0.06em] text-[#2a1b12] md:text-9xl">CHECKOUT</h1>
          <GlobalJar size="md" className="rotate-[-8deg]" />
        </div>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto grid w-[min(1200px,92vw)] gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="glass-card space-y-4">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Contact</h2>
            <input {...register('fullName', { required: 'Name is required' })} placeholder="Full name" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
            {errors.fullName && <p className="text-sm text-red-700">{errors.fullName.message}</p>}
            <input {...register('email', { required: 'Email is required' })} placeholder="Email" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
            {errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}
            <input {...register('phone', { required: 'Phone is required' })} placeholder="Phone" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
            {errors.phone && <p className="text-sm text-red-700">{errors.phone.message}</p>}
          </section>

          <section className="glass-card space-y-4">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Shipping</h2>
            <input {...register('address', { required: 'Address is required' })} placeholder="Address" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
            {errors.address && <p className="text-sm text-red-700">{errors.address.message}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <input {...register('city', { required: 'City is required' })} placeholder="City" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
                {errors.city && <p className="text-sm text-red-700">{errors.city.message}</p>}
              </div>
              <input {...register('postalCode')} placeholder="Postal code" className="w-full rounded-2xl border border-[#b8946f]/35 bg-white/60 px-4 py-3 outline-none" />
            </div>
          </section>

          <section className="glass-card">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Payment</h2>
            <div className="mt-4 grid gap-3">
              <label className={`rounded-2xl border p-4 ${paymentMethod === 'cod' ? 'border-[#8f653f] bg-[#ead2b6]/70' : 'border-[#b8946f]/35'}`}>
                <input type="radio" value="cod" {...register('paymentMethod')} className="mr-2" />
                Cash on Delivery
              </label>
              <label className={`rounded-2xl border p-4 ${paymentMethod === 'card' ? 'border-[#8f653f] bg-[#ead2b6]/70' : 'border-[#b8946f]/35'}`}>
                <input type="radio" value="card" {...register('paymentMethod')} className="mr-2" />
                Credit / Debit Card
              </label>
            </div>
          </section>
        </div>

        <aside className="glass-card h-fit">
          <h3 className="text-3xl font-semibold tracking-[-0.03em] text-[#2a1b12]">Summary</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></div>
            {discount > 0 && <div className="flex justify-between"><span>Discount</span><span>-Rs. {discount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span></div>
            <div className="flex justify-between border-t border-[#b8946f]/35 pt-3 text-2xl font-semibold text-[#2a1b12]">
              <span>Total</span><span>Rs. {total.toLocaleString()}</span>
            </div>
          </div>
          <button disabled={loading} className="liquid-btn mt-6 w-full">
            {loading ? 'Processing...' : 'Place order'}
          </button>
        </aside>
      </form>
    </div>
  );
}


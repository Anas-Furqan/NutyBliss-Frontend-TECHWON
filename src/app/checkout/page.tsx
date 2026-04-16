'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCartStore } from '@/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';

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
  const { items, getSubtotal, discount, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { paymentMethod: 'cod' },
  });

  const paymentMethod = watch('paymentMethod');
  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal - discount + shipping;

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    clearCart();
    toast.success('Order placed successfully');
    setLoading(false);
  };

  return (
    <main className="bg-surface pb-20 pt-32">
      <section className="mx-auto w-[min(1200px,92vw)]">
        <h1 className="font-display text-6xl text-ink">One-Page Checkout</h1>
      </section>

      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 grid w-[min(1200px,92vw)] gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="space-y-4 p-6">
            <h2 className="font-display text-3xl text-ink">Contact</h2>
            <Input {...register('fullName', { required: 'Name is required' })} placeholder="Full name" />
            {errors.fullName && <p className="text-sm text-red-700">{errors.fullName.message}</p>}
            <Input {...register('email', { required: 'Email is required' })} placeholder="Email" />
            {errors.email && <p className="text-sm text-red-700">{errors.email.message}</p>}
            <Input {...register('phone', { required: 'Phone is required' })} placeholder="Phone" />
            {errors.phone && <p className="text-sm text-red-700">{errors.phone.message}</p>}
          </GlassCard>

          <GlassCard className="space-y-4 p-6">
            <h2 className="font-display text-3xl text-ink">Shipping</h2>
            <Input {...register('address', { required: 'Address is required' })} placeholder="Address" />
            {errors.address && <p className="text-sm text-red-700">{errors.address.message}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input {...register('city', { required: 'City is required' })} placeholder="City" />
                {errors.city && <p className="text-sm text-red-700">{errors.city.message}</p>}
              </div>
              <Input {...register('postalCode')} placeholder="Postal code" />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="font-display text-3xl text-ink">Payment</h2>
            <div className="mt-4 grid gap-3">
              <label className={`rounded-xl border p-4 ${paymentMethod === 'cod' ? 'border-primary bg-primary/10' : 'border-primary/15'}`}>
                <input type="radio" value="cod" {...register('paymentMethod')} className="mr-2" />
                Cash on Delivery
              </label>
              <label className={`rounded-xl border p-4 ${paymentMethod === 'card' ? 'border-primary bg-primary/10' : 'border-primary/15'}`}>
                <input type="radio" value="card" {...register('paymentMethod')} className="mr-2" />
                Credit / Debit Card
              </label>
            </div>
          </GlassCard>
        </div>

        <aside className="glass-card h-fit p-6">
          <h3 className="font-display text-3xl text-ink">Summary</h3>
          <div className="mt-4 space-y-2">
            <p className="flex justify-between text-sm"><span>Items</span><span>{items.length}</span></p>
            <p className="flex justify-between text-sm"><span>Subtotal</span><span>Rs. {subtotal.toLocaleString()}</span></p>
            {discount > 0 && <p className="flex justify-between text-sm"><span>Discount</span><span>-Rs. {discount.toLocaleString()}</span></p>}
            <p className="flex justify-between text-sm"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `Rs. ${shipping}`}</span></p>
            <p className="flex justify-between border-t border-primary/15 pt-3 text-xl font-semibold text-ink"><span>Total</span><span>Rs. {total.toLocaleString()}</span></p>
          </div>
          <Button type="submit" className="mt-6 w-full" disabled={loading || items.length === 0}>
            {loading ? 'Processing...' : 'Place order'}
          </Button>
        </aside>
      </form>
    </main>
  );
}

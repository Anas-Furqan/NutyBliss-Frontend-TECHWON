'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAuthStore, useCartStore } from '@/store';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import GlassCard from '@/components/ui/GlassCard';
import { authAPI, ordersAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Address } from '@/types';

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
  const { isAuthenticated, updateUser } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CheckoutForm>({
    defaultValues: { paymentMethod: 'cod' },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const paymentMethod = watch('paymentMethod');
  const subtotal = getSubtotal();
  const shipping = subtotal >= 2000 ? 0 : 200;
  const total = subtotal - discount + shipping;

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const hydrateCheckout = async () => {
      try {
        const { data } = await authAPI.getMe();
        const me = data?.user;
        if (!me) return;

        updateUser(me);
        const addresses: Address[] = me.addresses || [];
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find((addr) => addr.isDefault) || addresses[0];

        if (defaultAddress?._id) {
          setSelectedAddressId(defaultAddress._id);
        }

        setValue('fullName', defaultAddress?.fullName || me.name || '');
        setValue('email', me.email || '');
        setValue('phone', defaultAddress?.phone || me.phone || '');
        setValue('address', defaultAddress?.address || '');
        setValue('city', defaultAddress?.city || '');
        setValue('postalCode', defaultAddress?.postalCode || '');
      } catch {
        // Keep checkout usable even if profile fetch fails.
      }
    };

    hydrateCheckout();
  }, [isAuthenticated, router]);

  const applySavedAddress = (addressId: string) => {
    setSelectedAddressId(addressId);
    const address = savedAddresses.find((addr) => addr._id === addressId);
    if (!address) return;

    setValue('fullName', address.fullName || '');
    setValue('phone', address.phone || '');
    setValue('address', address.address || '');
    setValue('city', address.city || '');
    setValue('postalCode', address.postalCode || '');
  };

  const onSubmit = async (values: CheckoutForm) => {
    if (!isAuthenticated) {
      toast.error('Please login to continue checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          variant: item.variant,
        })),
        shippingAddress: {
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          address: values.address.trim(),
          city: values.city.trim(),
          postalCode: values.postalCode?.trim(),
        },
        paymentMethod: values.paymentMethod,
      };

      const { data } = await ordersAPI.create(payload);
      clearCart();
      toast.success('Order placed successfully');
      router.push(`/order-success?orderNumber=${data?.order?.orderNumber || ''}`);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-surface pb-20 pt-32">
      <section className="mx-auto w-[min(1200px,92vw)]">
        <h1 className="font-display text-6xl text-ink">One-Page Checkout</h1>
      </section>

      <form noValidate onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-8 grid w-[min(1200px,92vw)] gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <GlassCard className="space-y-4 p-6">
            <h2 className="font-display text-3xl text-ink">Contact</h2>
            {savedAddresses.length > 0 && (
              <div>
                <label className="mb-1 block text-sm text-slate-300">Use saved address</label>
                <select
                  value={selectedAddressId}
                  onChange={(e) => applySavedAddress(e.target.value)}
                  className="focus-gradient rounded-xl2 w-full"
                >
                  {savedAddresses.map((address) => (
                    <option key={address._id} value={address._id}>
                      {address.fullName} - {address.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <Input {...register('fullName', { required: 'Name is required' })} placeholder="Full name" autoComplete="name" />
            {errors.fullName && <p className="text-sm text-[#EF4444]">{errors.fullName.message}</p>}
            <Input type="email" {...register('email', { required: 'Email is required' })} placeholder="Email" autoComplete="email" />
            {errors.email && <p className="text-sm text-[#EF4444]">{errors.email.message}</p>}
            <Input {...register('phone', { required: 'Phone is required' })} placeholder="Phone" autoComplete="tel" />
            {errors.phone && <p className="text-sm text-[#EF4444]">{errors.phone.message}</p>}
            {savedAddresses.length > 0 && (
              <p className="text-xs text-slate-400">Manage addresses in your account to auto-fill checkout faster.</p>
            )}
          </GlassCard>

          <GlassCard className="space-y-4 p-6">
            <h2 className="font-display text-3xl text-ink">Shipping</h2>
            <Input {...register('address', { required: 'Address is required' })} placeholder="Address" autoComplete="street-address" />
            {errors.address && <p className="text-sm text-[#EF4444]">{errors.address.message}</p>}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Input {...register('city', { required: 'City is required' })} placeholder="City" autoComplete="address-level2" />
                {errors.city && <p className="text-sm text-[#EF4444]">{errors.city.message}</p>}
              </div>
              <Input {...register('postalCode')} placeholder="Postal code" autoComplete="postal-code" />
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

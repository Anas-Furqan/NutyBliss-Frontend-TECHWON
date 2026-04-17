'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUser, FiPackage, FiMapPin, FiLogOut, FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { useAuthStore } from '@/store';
import { authAPI, ordersAPI } from '@/lib/api';
import { Address, Order } from '@/types';
import toast from 'react-hot-toast';

type ProfileForm = {
  name: string;
  phone: string;
};

type AddressForm = {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
};

const initialAddressForm: AddressForm = {
  fullName: '',
  phone: '',
  address: '',
  city: '',
  postalCode: '',
  isDefault: false,
};

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, isHydrated, logout, updateUser } = useAuthStore();

  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses'>('orders');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  const [profileForm, setProfileForm] = useState<ProfileForm>({ name: '', phone: '' });
  const [addressForm, setAddressForm] = useState<AddressForm>(initialAddressForm);

  const addresses = useMemo(() => user?.addresses || [], [user?.addresses]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const bootstrap = async () => {
      try {
        const [meResponse, ordersResponse] = await Promise.all([authAPI.getMe(), ordersAPI.getMyOrders()]);
        const me = meResponse?.data?.user;
        if (me) {
          updateUser(me);
          setProfileForm({
            name: me.name || '',
            phone: me.phone || '',
          });
          const defaultAddress = (me.addresses || []).find((a: Address) => a.isDefault) || me.addresses?.[0];
          if (defaultAddress) {
            setAddressForm({
              fullName: defaultAddress.fullName || '',
              phone: defaultAddress.phone || '',
              address: defaultAddress.address || '',
              city: defaultAddress.city || '',
              postalCode: defaultAddress.postalCode || '',
              isDefault: Boolean(defaultAddress.isDefault),
            });
          }
        }

        setOrders(ordersResponse?.data?.orders || []);
      } catch {
        toast.error('Failed to load account details');
      } finally {
        setLoadingOrders(false);
        setLoadingProfile(false);
      }
    };

    bootstrap();
  }, [isHydrated, isAuthenticated, router, updateUser]);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // Continue local logout if server cookie clear fails.
    }
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!profileForm.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSavingProfile(true);
    try {
      const { data } = await authAPI.updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim(),
      });

      updateUser(data.user);
      toast.success('Profile updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const resetAddressEditor = () => {
    setEditingAddressId(null);
    setAddressForm(initialAddressForm);
  };

  const handleAddressSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!addressForm.fullName.trim() || !addressForm.phone.trim() || !addressForm.address.trim() || !addressForm.city.trim()) {
      toast.error('Please fill all required address fields');
      return;
    }

    setSavingAddress(true);
    try {
      const payload = {
        fullName: addressForm.fullName.trim(),
        phone: addressForm.phone.trim(),
        address: addressForm.address.trim(),
        city: addressForm.city.trim(),
        postalCode: addressForm.postalCode.trim(),
        isDefault: addressForm.isDefault,
      };

      const response = editingAddressId
        ? await authAPI.updateAddress(editingAddressId, payload)
        : await authAPI.addAddress(payload);

      updateUser({ addresses: response?.data?.addresses || [] });
      resetAddressEditor();
      toast.success(editingAddressId ? 'Address updated' : 'Address added');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to save address');
    } finally {
      setSavingAddress(false);
    }
  };

  const editAddress = (address: Address) => {
    setEditingAddressId(address._id || null);
    setAddressForm({
      fullName: address.fullName || '',
      phone: address.phone || '',
      address: address.address || '',
      city: address.city || '',
      postalCode: address.postalCode || '',
      isDefault: Boolean(address.isDefault),
    });
  };

  const removeAddress = async (addressId?: string) => {
    if (!addressId) return;

    try {
      const { data } = await authAPI.deleteAddress(addressId);
      updateUser({ addresses: data.addresses || [] });
      if (editingAddressId === addressId) {
        resetAddressEditor();
      }
      toast.success('Address deleted');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to delete address');
    }
  };

  const setDefaultAddress = async (address: Address) => {
    if (!address._id) return;

    try {
      const { data } = await authAPI.updateAddress(address._id, {
        ...address,
        isDefault: true,
      });
      updateUser({ addresses: data.addresses || [] });
      toast.success('Default address updated');
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to update default address');
    }
  };

  if (!isHydrated || !isAuthenticated) return null;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-500/20 text-yellow-300',
      confirmed: 'bg-blue-500/20 text-blue-300',
      processing: 'bg-purple-500/20 text-purple-300',
      'in-progress': 'bg-fuchsia-500/20 text-fuchsia-300',
      shipped: 'bg-indigo-500/20 text-indigo-300',
      'on-the-way': 'bg-cyan-500/20 text-cyan-300',
      delivered: 'bg-emerald-500/20 text-emerald-300',
      cancelled: 'bg-red-500/20 text-red-300',
    };
    return colors[status] || 'bg-white/10 text-[#2D3748]';
  };

  return (
    <main className="bg-surface pb-32 pt-32">
      <div className="mx-auto w-[min(1240px,94vw)]">
        <h1 className="mb-8 font-display text-5xl tracking-tighter text-[#3E2723]">My Account</h1>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          <aside className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl lg:col-span-1">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-3 grid h-20 w-20 place-items-center rounded-full bg-gray-100">
                <span className="text-3xl font-semibold text-amber-300">{user?.name?.[0]?.toUpperCase()}</span>
              </div>
              <h2 className="text-lg font-semibold text-[#3E2723]">{user?.name}</h2>
              <p className="text-sm text-[#2D3748]">{user?.email}</p>
            </div>

            <nav className="space-y-2">
              {[
                { id: 'orders', icon: FiPackage, label: 'My Orders' },
                { id: 'profile', icon: FiUser, label: 'Profile' },
                { id: 'addresses', icon: FiMapPin, label: 'Addresses' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as 'orders' | 'profile' | 'addresses')}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm transition ${
                    activeTab === item.id
                      ? 'bg-white/[0.10] text-amber-300'
                      : 'text-[#2D3748] hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </button>
              ))}

              <button
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
              >
                <FiLogOut className="h-4 w-4" />
                Logout
              </button>
            </nav>

            {user?.role === 'admin' && (
              <Link href="/admin" className="btn-primary mt-6 w-full justify-center">
                Admin Panel
              </Link>
            )}
          </aside>

          <section className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl">
                <h2 className="mb-6 font-display text-3xl tracking-tight text-[#3E2723]">My Orders</h2>
                {loadingOrders ? (
                  <p className="py-8 text-center text-[#2D3748]">Loading orders...</p>
                ) : orders.length > 0 ? (
                  <div className="space-y-3">
                    {orders.map((order) => (
                      <motion.article
                        key={order._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-gray-200 bg-white p-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-[#3E2723]">#{order.orderNumber}</p>
                            <p className="text-sm text-[#2D3748]">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-amber-300">Rs. {order.total.toLocaleString()}</p>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                          <p className="text-sm text-[#2D3748]">{order.items.length} item(s)</p>
                          <Link href={`/track-order?orderNumber=${order.orderNumber}`} className="text-sm font-medium text-amber-300 hover:text-amber-200">
                            Track Order
                          </Link>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
                    <p className="mb-4 text-[#2D3748]">No orders yet</p>
                    <Link href="/shop" className="btn-primary">
                      Start Shopping
                    </Link>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl">
                <h2 className="mb-6 font-display text-3xl tracking-tight text-[#3E2723]">Profile Settings</h2>

                {loadingProfile ? (
                  <p className="py-8 text-center text-[#2D3748]">Loading profile...</p>
                ) : (
                  <form onSubmit={handleProfileSave} className="grid max-w-xl gap-4">
                    <label className="grid gap-2">
                      <span className="text-sm text-[#2D3748]">Full Name</span>
                      <input
                        value={profileForm.name}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-[#2D3748]">Email</span>
                      <input
                        value={user?.email || ''}
                        disabled
                        className="cursor-not-allowed rounded-xl border border-gray-200 bg-white px-4 py-3 text-[#2D3748]"
                      />
                    </label>

                    <label className="grid gap-2">
                      <span className="text-sm text-[#2D3748]">Phone</span>
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                      />
                    </label>

                    <button type="submit" disabled={savingProfile} className="btn-primary mt-2 w-fit">
                      {savingProfile ? 'Saving...' : 'Save Changes'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl">
                  <h2 className="mb-5 font-display text-3xl tracking-tight text-[#3E2723]">
                    {editingAddressId ? 'Edit Address' : 'Add Address'}
                  </h2>

                  <form onSubmit={handleAddressSubmit} className="grid gap-4 md:grid-cols-2">
                    <input
                      placeholder="Full Name"
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, fullName: e.target.value }))}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                    />
                    <input
                      placeholder="Phone"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                    />
                    <input
                      placeholder="Address"
                      value={addressForm.address}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, address: e.target.value }))}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70 md:col-span-2"
                    />
                    <input
                      placeholder="City"
                      value={addressForm.city}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                    />
                    <input
                      placeholder="Postal Code"
                      value={addressForm.postalCode}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, postalCode: e.target.value }))}
                      className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-[#3E2723] outline-none focus:border-amber-400/70"
                    />

                    <label className="md:col-span-2 flex items-center gap-2 text-sm text-[#2D3748]">
                      <input
                        type="checkbox"
                        checked={addressForm.isDefault}
                        onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                      />
                      Set as default address
                    </label>

                    <div className="md:col-span-2 flex flex-wrap items-center gap-3">
                      <button type="submit" disabled={savingAddress} className="btn-primary">
                        {savingAddress ? 'Saving...' : editingAddressId ? 'Update Address' : 'Add Address'}
                      </button>
                      {editingAddressId && (
                        <button type="button" onClick={resetAddressEditor} className="btn-secondary">
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-6 backdrop-blur-2xl">
                  <h3 className="mb-4 font-display text-2xl tracking-tight text-[#3E2723]">Saved Addresses</h3>
                  {addresses.length > 0 ? (
                    <div className="grid gap-3 md:grid-cols-2">
                      {addresses.map((address) => (
                        <article key={address._id} className="rounded-xl border border-gray-200 bg-white p-4">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <p className="font-medium text-[#3E2723]">{address.fullName}</p>
                            {address.isDefault && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">
                                <FiCheck className="h-3 w-3" /> Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-[#2D3748]">{address.address}</p>
                          <p className="text-sm text-[#2D3748]">{address.city} {address.postalCode}</p>
                          <p className="text-sm text-[#2D3748]">{address.phone}</p>

                          <div className="mt-3 flex flex-wrap items-center gap-2">
                            <button onClick={() => editAddress(address)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-amber-300 hover:bg-gray-100">
                              <FiEdit2 className="h-4 w-4" /> Edit
                            </button>
                            {!address.isDefault && (
                              <button onClick={() => setDefaultAddress(address)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-cyan-300 hover:bg-gray-100">
                                <FiCheck className="h-4 w-4" /> Set Default
                              </button>
                            )}
                            <button onClick={() => removeAddress(address._id)} className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm text-red-300 hover:bg-red-500/10">
                              <FiTrash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="rounded-xl border border-gray-200 bg-white p-4 text-center text-[#2D3748]">No saved addresses yet.</p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}


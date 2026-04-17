import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, CartItem, Product } from '@/types';

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setHydrated: () => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,
      setHydrated: () => set({ isHydrated: true }),
      setAuth: (user, token) => {
        localStorage.setItem('token', token);
        set({ user, token, isAuthenticated: true });
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart-storage');
        set({ user: null, token: null, isAuthenticated: false });
      },
      updateUser: (userData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state, error) => {
        if (error) return;
        state?.setHydrated?.();
      },
    }
  )
);

// Cart Store (for guest users)
interface LocalCartItem {
  productId: string;
  product: Product;
  variant?: { size: string; price: number };
  quantity: number;
}

interface CartState {
  items: LocalCartItem[];
  couponCode: string | null;
  discount: number;
  addItem: (product: Product, quantity: number, variant?: { size: string; price: number }) => void;
  updateQuantity: (productId: string, variantSize: string | undefined, quantity: number) => void;
  removeItem: (productId: string, variantSize?: string) => void;
  clearCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      addItem: (product, quantity, variant) => {
        if (typeof window !== 'undefined') {
          const rawAuth = localStorage.getItem('auth-storage');
          if (!rawAuth) return;

          try {
            const parsed = JSON.parse(rawAuth);
            const state = parsed?.state;
            const isAuthed = Boolean(state?.isAuthenticated && state?.token);
            if (!isAuthed) return;
          } catch {
            return;
          }
        }

        set((state) => {
          const existingIndex = state.items.findIndex(
            (item) =>
              item.productId === product._id &&
              item.variant?.size === variant?.size
          );

          if (existingIndex > -1) {
            const newItems = [...state.items];
            newItems[existingIndex].quantity += quantity;
            return { items: newItems };
          }

          return {
            items: [
              ...state.items,
              { productId: product._id, product, variant, quantity },
            ],
          };
        });
      },
      updateQuantity: (productId, variantSize, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && item.variant?.size === variantSize
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      removeItem: (productId, variantSize) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(item.productId === productId && item.variant?.size === variantSize)
          ),
        }));
      },
      clearCart: () => set({ items: [], couponCode: null, discount: 0 }),
      setCoupon: (code, discount) => set({ couponCode: code, discount }),
      removeCoupon: () => set({ couponCode: null, discount: 0 }),
      getSubtotal: () => {
        const { items } = get();
        return items.reduce((total, item) => {
          const price =
            item.variant?.price ||
            item.product.baseDiscountPrice ||
            item.product.basePrice;
          return total + price * item.quantity;
        }, 0);
      },
      getTotal: () => {
        const { getSubtotal, discount } = get();
        return getSubtotal() - discount;
      },
      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

// UI Store
interface UIState {
  isCartOpen: boolean;
  isSearchOpen: boolean;
  isMobileMenuOpen: boolean;
  setCartOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setMobileMenuOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isCartOpen: false,
  isSearchOpen: false,
  isMobileMenuOpen: false,
  setCartOpen: (open) => set({ isCartOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
}));

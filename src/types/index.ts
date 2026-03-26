export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  images: { url: string; alt?: string }[];
  category: string;
  variants: Variant[];
  basePrice: number;
  baseDiscountPrice?: number;
  totalStock: number;
  rating: {
    average: number;
    count: number;
  };
  tags?: string[];
  ingredients?: string[];
  nutritionFacts?: {
    servingSize?: string;
    calories?: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    fiber?: number;
  };
  isFeatured?: boolean;
  isHotSelling?: boolean;
  isNewArrival?: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  _id?: string;
  size: string;
  price: number;
  discountPrice?: number;
  stock: number;
  sku?: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  variant?: {
    size: string;
    price: number;
  };
  quantity: number;
  price?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  isDefault?: boolean;
}

export interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: Address & { email: string };
  paymentMethod: 'cod' | 'stripe' | 'card';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  shippingCost: number;
  discount: number;
  couponCode?: string;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  trackingUrl?: string;
  statusHistory?: { status: string; timestamp: string; note?: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  title: string;
  image?: string;
  variant?: { size: string; price: number };
  quantity: number;
  price: number;
}

export interface Review {
  _id: string;
  product: string;
  user: { _id: string; name: string };
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  helpful: number;
  createdAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discount: number;
}

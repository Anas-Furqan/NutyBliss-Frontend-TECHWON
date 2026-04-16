'use client';

import UnifiedProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';

type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  return <UnifiedProductCard product={product} />;
}

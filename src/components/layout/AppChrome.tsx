'use client';

import { usePathname } from 'next/navigation';
import { LayoutGroup } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import SmoothScroll from '@/components/SmoothScroll';
import Ornaments from '@/components/Ornaments';
import PageTransition from '@/components/Layout/PageTransition';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-[#f6ead8]">{children}</main>;
  }

  return (
    <SmoothScroll>
      <LayoutGroup id="page-layout">
        <Ornaments />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </LayoutGroup>
    </SmoothScroll>
  );
}

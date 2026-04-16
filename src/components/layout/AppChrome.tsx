'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/layout/Footer';
import ScrollWrapper from '@/components/animations/ScrollWrapper';
import FlyingOrnaments from '@/components/FlyingOrnaments';
import PageTransition from '@/components/layout/PageTransition';

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAdminRoute) {
    return <main className="min-h-screen bg-[#f6ead8]">{children}</main>;
  }

  return (
    <ScrollWrapper>
      <>
        <FlyingOrnaments />
        <Navbar />
        <PageTransition>{children}</PageTransition>
        <Footer />
      </>
    </ScrollWrapper>
  );
}

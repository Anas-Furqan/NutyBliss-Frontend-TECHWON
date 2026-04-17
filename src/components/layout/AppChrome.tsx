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
    return <main className="min-h-screen bg-[#F9FAFB] pb-20 text-[#2D3748]">{children}</main>;
  }

  return (
    <ScrollWrapper>
      <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden overflow-y-visible bg-white text-[#2D3748]">
        <FlyingOrnaments />
        <Navbar />
        <div className="relative flex-1 overflow-y-visible pb-24 pt-20 md:pt-24">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </div>
    </ScrollWrapper>
  );
}

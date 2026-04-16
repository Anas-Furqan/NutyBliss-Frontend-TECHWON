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
      <div className="relative isolate flex min-h-screen flex-col overflow-x-hidden overflow-y-visible bg-[#050505] text-slate-200">
        <FlyingOrnaments />
        <Navbar />
        <div className="relative flex-1 overflow-y-visible pb-32">
          <PageTransition>{children}</PageTransition>
        </div>
        <Footer />
      </div>
    </ScrollWrapper>
  );
}

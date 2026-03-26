'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiFacebook, FiInstagram, FiMail, FiPhone, FiMapPin, FiSend } from 'react-icons/fi';
import WaveDivider from '@/components/ui/WaveDivider';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success('Thank you for subscribing!');
    setEmail('');
    setLoading(false);
  };

  return (
    <footer className="mt-16">
      {/* Wave divider */}
      <WaveDivider color="#633bb1" flip />

      {/* Newsletter Section */}
      <div className="bg-primary-500 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 font-display">
            Subscribe & Get 10% Off
          </h3>
          <p className="text-white/80 mb-6">
            Join our newsletter for exclusive deals, new products, and healthy tips!
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-btn text-dark focus:outline-none focus:ring-2 focus:ring-accent-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-accent whitespace-nowrap"
            >
              <FiSend className="w-5 h-5" />
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-gradient-to-b from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center">
                  <span className="text-primary-500 font-bold text-2xl font-display">N</span>
                </div>
                <span className="text-2xl font-bold font-display">
                  Nuty<span className="text-accent-500">Bliss</span>
                </span>
              </Link>
              <p className="text-white/70 text-sm leading-relaxed">
                Premium quality peanut butter and healthy food products.
                100% Natural, delicious, and nutritious!
              </p>
              <div className="flex space-x-3">
                <a
                  href="https://facebook.com/nutybliss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 rounded-full hover:bg-accent-500 hover:text-primary-500 transition-colors"
                  aria-label="Facebook"
                >
                  <FiFacebook className="w-5 h-5" />
                </a>
                <a
                  href="https://instagram.com/nutybliss"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/10 rounded-full hover:bg-accent-500 hover:text-primary-500 transition-colors"
                  aria-label="Instagram"
                >
                  <FiInstagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display text-accent-500">Quick Links</h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'Shop All', href: '/products' },
                  { name: 'Our Story', href: '/about' },
                  { name: 'Contact Us', href: '/contact' },
                  { name: 'Track Order', href: '/track-order' },
                  { name: 'FAQs', href: '/faqs' },
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/70 hover:text-accent-500 transition-colors text-sm"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display text-accent-500">Categories</h3>
              <ul className="space-y-2.5">
                {[
                  { name: 'Peanut Butter', href: '/products?category=peanut-butter' },
                  { name: 'Oats', href: '/products?category=oats' },
                  { name: 'Bundles', href: '/products?category=bundles' },
                  { name: 'New Arrivals', href: '/products?newArrival=true' },
                  { name: 'Best Sellers', href: '/products?hotSelling=true' },
                ].map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-white/70 hover:text-accent-500 transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-bold mb-4 font-display text-accent-500">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <FiMapPin className="w-5 h-5 text-accent-500 mt-0.5 flex-shrink-0" />
                  <span className="text-white/70 text-sm">
                    Lahore, Pakistan
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <FiPhone className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <a
                    href="tel:+923001234567"
                    className="text-white/70 hover:text-accent-500 text-sm transition-colors"
                  >
                    +92 300 1234567
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <FiMail className="w-5 h-5 text-accent-500 flex-shrink-0" />
                  <a
                    href="mailto:info@nutybliss.pk"
                    className="text-white/70 hover:text-accent-500 text-sm transition-colors"
                  >
                    info@nutybliss.pk
                  </a>
                </li>
              </ul>

              {/* Payment Methods */}
              <div className="mt-6">
                <p className="text-sm text-white/50 mb-2">Payment Methods</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">Visa</span>
                  <span className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">Mastercard</span>
                  <span className="px-3 py-1.5 bg-white/10 rounded text-xs font-medium">COD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-white/50 text-sm">
                &copy; {new Date().getFullYear()} Nuty Bliss. All rights reserved.
              </p>
              <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                <Link href="/privacy-policy" className="text-white/50 hover:text-accent-500 text-sm transition-colors">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-white/50 hover:text-accent-500 text-sm transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/refund-policy" className="text-white/50 hover:text-accent-500 text-sm transition-colors">
                  Refund Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

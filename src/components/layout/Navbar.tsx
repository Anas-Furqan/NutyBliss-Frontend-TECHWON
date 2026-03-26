'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX, FiChevronDown } from 'react-icons/fi';
import { useAuthStore, useCartStore, useUIStore } from '@/store';
import CartSidebar from './CartSidebar';
import SearchModal from './SearchModal';

// Navigation structure with dropdowns
const navItems = [
  { name: 'Home', href: '/' },
  {
    name: 'Peanut Butter',
    href: '/products?category=peanut-butter',
    submenu: [
      { name: 'All Peanut Butter', href: '/products?category=peanut-butter' },
      { name: 'Chunky Flavors', href: '/products?category=peanut-butter&flavor=chunky' },
      { name: 'Smooth Flavors', href: '/products?category=peanut-butter&flavor=smooth' },
      { name: 'Chocolate Flavors', href: '/products?category=peanut-butter&flavor=chocolate' },
      { name: 'Honey Flavors', href: '/products?category=peanut-butter&flavor=honey' },
    ],
  },
  {
    name: 'Oats',
    href: '/products?category=oats',
    submenu: [
      { name: 'All Oats', href: '/products?category=oats' },
      { name: 'Chocolate Cocoa', href: '/products?category=oats&flavor=chocolate' },
      { name: 'Honey Almond', href: '/products?category=oats&flavor=honey-almond' },
      { name: 'Very Berry', href: '/products?category=oats&flavor=berry' },
    ],
  },
  {
    name: 'Bundles',
    href: '/products?category=bundles',
    submenu: [
      { name: 'All Bundles', href: '/products?category=bundles' },
      { name: '500g Bundles', href: '/products?category=bundles&size=500g' },
      { name: '750g Bundles', href: '/products?category=bundles&size=750g' },
    ],
  },
  { name: 'Track Order', href: '/track-order' },
  { name: 'Our Story', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isAuthenticated, user } = useAuthStore();
  const { getItemCount } = useCartStore();
  const { isCartOpen, isSearchOpen, isMobileMenuOpen, setCartOpen, setSearchOpen, setMobileMenuOpen } = useUIStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const itemCount = getItemCount();

  const handleMouseEnter = (name: string) => {
    setActiveDropdown(name);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-[38px] left-0 right-0 z-40 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-navbar' : 'bg-white'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX className="w-6 h-6 text-dark" />
              ) : (
                <FiMenu className="w-6 h-6 text-dark" />
              )}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-500 rounded-full flex items-center justify-center">
                <span className="text-accent-500 font-bold text-xl md:text-2xl font-display">N</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-bold text-dark font-display tracking-wide">
                  Nuty<span className="text-primary-500">Bliss</span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.submenu && handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center gap-1 px-4 py-2 text-[15px] font-semibold transition-colors hover:text-primary-500 ${
                      pathname === item.href || pathname.startsWith(item.href.split('?')[0])
                        ? 'text-primary-500'
                        : 'text-dark'
                    }`}
                  >
                    {item.name}
                    {item.submenu && (
                      <FiChevronDown
                        className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Dropdown Menu */}
                  {item.submenu && (
                    <AnimatePresence>
                      {activeDropdown === item.name && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 mt-1"
                        >
                          {item.submenu.map((subitem) => (
                            <Link
                              key={subitem.name}
                              href={subitem.href}
                              className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-500 transition-colors"
                            >
                              {subitem.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Icons */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5 text-dark" />
              </button>

              <Link
                href={isAuthenticated ? '/account' : '/login'}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors hidden sm:flex"
                aria-label="Account"
              >
                <FiUser className="w-5 h-5 text-dark" />
              </Link>

              <button
                onClick={() => setCartOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors relative"
                aria-label="Cart"
              >
                <FiShoppingCart className="w-5 h-5 text-dark" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-accent-500 text-primary-500 text-xs font-bold rounded-full flex items-center justify-center px-1">
                    {itemCount > 99 ? '99+' : itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              <nav className="px-4 py-4 space-y-1">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <Link
                      href={item.href}
                      onClick={() => !item.submenu && setMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-lg font-semibold transition-colors ${
                        pathname === item.href
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-dark hover:bg-gray-50'
                      }`}
                    >
                      {item.name}
                    </Link>

                    {/* Mobile Submenu */}
                    {item.submenu && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-100">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-2 px-4 text-sm text-gray-600 hover:text-primary-500 transition-colors"
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Account Link */}
                <Link
                  href={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 px-4 rounded-lg font-semibold text-dark hover:bg-gray-50 transition-colors border-t mt-4"
                >
                  {isAuthenticated ? 'My Account' : 'Login / Register'}
                </Link>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Spacer for fixed header (announcement bar + navbar) */}
      <div className="h-[102px] md:h-[118px]" />

      {/* Cart Sidebar */}
      <CartSidebar isOpen={isCartOpen} onClose={() => setCartOpen(false)} />

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

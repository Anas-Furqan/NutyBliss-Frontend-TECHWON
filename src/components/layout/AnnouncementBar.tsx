'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

const announcements = [
  "Buy 2 & get an extra 6% off!",
  "Free Shipping on orders above Rs 3,000",
  "100% Natural - No preservatives!",
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="announcement-bar sticky top-0 z-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="py-1"
          >
            {announcements[currentIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Dots indicator */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 flex gap-1.5 hidden sm:flex">
        {announcements.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-1.5 h-1.5 rounded-full transition-all ${
              index === currentIndex ? 'bg-accent-500 w-4' : 'bg-accent-500/50'
            }`}
          />
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-accent-500/80 hover:text-accent-500 transition-colors"
        aria-label="Close announcement"
      >
        <FiX className="w-4 h-4" />
      </button>
    </div>
  );
}

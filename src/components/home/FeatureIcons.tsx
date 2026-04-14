'use client';

import { motion } from 'framer-motion';
import { FiTruck, FiStar, FiCheck } from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'Free Shipping',
    description: 'On orders above Rs. 3,000',
  },
  {
    icon: FiCheck,
    title: '100% Organic',
    description: 'No preservatives added',
  },
  {
    icon: FiStar,
    title: '5.0 Google Reviews',
    description: 'Customers love us!',
  },
];

export default function FeatureBar() {
  return (
    <section className="relative -mt-4 z-20 px-4 md:px-8 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="feature-bar max-w-6xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="feature-bar-item"
            >
              <feature.icon className="feature-bar-icon" />
              <h3 className="feature-bar-title">{feature.title}</h3>
              <p className="feature-bar-desc">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

// Keep backward compatibility - can be imported as FeatureIcons
export { FeatureBar as FeatureIcons };

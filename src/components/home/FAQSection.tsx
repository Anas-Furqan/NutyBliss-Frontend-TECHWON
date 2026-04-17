'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

const faqs = [
  {
    question: 'What makes Nuty Bliss peanut butter different?',
    answer: 'Our peanut butter is made from 100% high-quality roasted peanuts with no added sugar, no preservatives, and no hydrogenated oils. We focus on natural ingredients and authentic taste.',
  },
  {
    question: 'Is your peanut butter suitable for diabetics?',
    answer: 'Yes! Our natural peanut butter contains no added sugar, making it a suitable option for people managing their sugar intake. However, we always recommend consulting with your healthcare provider.',
  },
  {
    question: 'How should I store peanut butter?',
    answer: 'Store in a cool, dry place. Once opened, you can refrigerate it to extend freshness. Natural separation may occur - simply stir before use.',
  },
  {
    question: 'Do you offer Cash on Delivery?',
    answer: 'Yes, we offer Cash on Delivery (COD) for all orders within Pakistan. You can also pay via card or online banking.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We offer hassle-free returns within 7 days of delivery if the product is damaged or defective. Please contact our support team for assistance.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Delivery typically takes 3-5 business days for major cities and 5-7 days for other areas in Pakistan. You will receive tracking information once your order is shipped.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Frequently Asked Questions</h2>
          <p className="section-subtitle">Got questions? We have answers!</p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-semibold text-slate-100">{faq.question}</span>
                <FiChevronDown
                  className={`h-5 w-5 text-slate-400 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-5 text-slate-300">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

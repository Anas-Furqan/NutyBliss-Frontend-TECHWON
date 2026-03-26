'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import WaveDivider from '@/components/ui/WaveDivider';
import toast from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const contactInfo = [
  {
    icon: FiMapPin,
    title: 'Address',
    content: 'Lahore, Pakistan',
  },
  {
    icon: FiPhone,
    title: 'Phone',
    content: '+92 300 1234567',
    link: 'tel:+923001234567',
  },
  {
    icon: FiMail,
    title: 'Email',
    content: 'info@nutybliss.pk',
    link: 'mailto:info@nutybliss.pk',
  },
  {
    icon: FiClock,
    title: 'Business Hours',
    content: 'Mon - Sat: 9AM - 6PM',
  },
];

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactForm>();

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-primary-500 py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">Contact Us</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Have questions? We&apos;d love to hear from you!
            </p>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider color="#ffffff" />
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold text-dark mb-6 font-display">
                Get in Touch
              </h2>
              <p className="text-gray-600 mb-8">
                Whether you have a question about our products, orders, or anything else,
                our team is ready to answer all your questions.
              </p>

              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-dark">{item.title}</h3>
                      {item.link ? (
                        <a
                          href={item.link}
                          className="text-gray-600 hover:text-primary-500 transition-colors"
                        >
                          {item.content}
                        </a>
                      ) : (
                        <p className="text-gray-600">{item.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-cream rounded-card p-8"
            >
              <h3 className="text-2xl font-bold text-dark mb-6 font-display">
                Send us a Message
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Name *</label>
                    <input
                      {...register('name', { required: 'Name is required' })}
                      className="input-field"
                      placeholder="Your name"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Email *</label>
                    <input
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                      })}
                      className="input-field"
                      placeholder="your@email.com"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Phone</label>
                    <input
                      {...register('phone')}
                      className="input-field"
                      placeholder="+92 3XX XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark mb-1">Subject *</label>
                    <input
                      {...register('subject', { required: 'Subject is required' })}
                      className="input-field"
                      placeholder="What's this about?"
                    />
                    {errors.subject && (
                      <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark mb-1">Message *</label>
                  <textarea
                    {...register('message', { required: 'Message is required' })}
                    rows={5}
                    className="input-field resize-none"
                    placeholder="Tell us more..."
                  />
                  {errors.message && (
                    <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? (
                    <>
                      <span className="spinner w-5 h-5" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}

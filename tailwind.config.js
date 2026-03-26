/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary Purple - Organic Inn exact match
        primary: {
          50: '#f5f0ff',
          100: '#ebe0ff',
          200: '#d9c4ff',
          300: '#bf9eff',
          400: '#9b6deb',
          500: '#633bb1', // Main brand purple
          600: '#5432a0',
          700: '#462888',
          800: '#3a2270',
          900: '#2d1a57',
        },
        // Accent Yellow - Organic Inn exact match
        accent: {
          50: '#fffef0',
          100: '#fffcdb',
          200: '#fff8b3',
          300: '#fff280',
          400: '#feeb4d',
          500: '#fedd00', // Main brand yellow
          600: '#e5c700',
          700: '#b39b00',
          800: '#8a7800',
          900: '#615400',
        },
        // Additional brand colors
        cream: '#fffae9',
        dark: '#121212',
      },
      fontFamily: {
        sans: ['var(--font-mulish)', 'Mulish', 'sans-serif'],
        display: ['var(--font-luckiest)', 'LuckiestGuy', 'cursive'],
        secondary: ['var(--font-gilroy)', 'Gilroy-Semibold', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.6' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
      },
      letterSpacing: {
        'wide': '0.06rem',
      },
      borderRadius: {
        'btn': '12px',
        'card': '16px',
        'feature': '16px',
        'pill': '4rem',
      },
      boxShadow: {
        'btn': '12px 12px 5px rgba(99, 59, 177, 0.15)',
        'btn-hover': '8px 8px 3px rgba(99, 59, 177, 0.2)',
        'btn-accent': '12px 12px 5px rgba(254, 221, 0, 0.3)',
        'btn-accent-hover': '8px 8px 3px rgba(254, 221, 0, 0.4)',
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'feature': '4px 4px 20px rgba(99, 59, 177, 0.2)',
        'navbar': '0 2px 10px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-in-left': 'slideInLeft 0.3s ease-out',
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'marquee': 'marquee 20s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
    },
  },
  plugins: [],
}

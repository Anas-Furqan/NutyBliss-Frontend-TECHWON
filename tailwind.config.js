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
        nuty: {
          purple: '#4B0082',
          orange: '#FF8C00',
          peanut: '#D2B48C',
          chocolate: '#3E2723',
          cream: '#FDF5E6',
        },
        primary: '#4B0082',
        secondary: '#FF8C00',
        accent: '#D2B48C',
        surface: '#FDF5E6',
        ink: '#3E2723',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        display: ['var(--font-fredoka)', 'Fredoka', 'sans-serif'],
      },
      borderRadius: {
        glass: '1.25rem',
        xl2: '1.5rem',
      },
      boxShadow: {
        glass: '0 20px 45px rgba(75, 0, 130, 0.12)',
        glow: '0 0 0 1px rgba(255, 140, 0, 0.2), 0 20px 40px rgba(75, 0, 130, 0.18)',
      },
    },
  },
  plugins: [],
}

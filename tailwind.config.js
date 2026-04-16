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
        nutyOrange: '#FF8C00',
        nutyPurple: '#4B0082',
        nuty: {
          purple: '#4B0082',
          orange: '#FF8C00',
          peanut: '#D2B48C',
          chocolate: '#3E2723',
          cream: '#FDF5E6',
          midnight: '#08080c',
          royalNight: '#0a0510',
        },
        primary: '#4B0082',
        secondary: '#FF8C00',
        accent: '#FF8C00',
        surface: '#08080c',
        surfaceAlt: '#0a0510',
        ink: '#f6f4ff',
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
        glass: '0 20px 45px rgba(3, 3, 8, 0.55)',
        glow: '0 0 0 1px rgba(255, 140, 0, 0.25), 0 20px 40px rgba(75, 0, 130, 0.3)',
        neon: '0 0 0 1px rgba(255, 140, 0, 0.6), 0 0 24px rgba(255, 140, 0, 0.25)',
      },
    },
  },
  plugins: [],
}

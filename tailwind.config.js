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
          surfaceStart: '#FFFFFF',
          surfaceEnd: '#F9FAFB',
          offWhite: '#FDF5E6',
          purple: '#5C4033',
          orange: '#FF8C00',
          peanut: '#D2B48C',
          chocolate: '#3E2723',
          cream: '#FDF5E6',
          midnight: '#FFFFFF',
          royalNight: '#F9FAFB',
        },
        primary: '#FFFFFF',
        secondary: '#5C4033',
        accent: '#FF8C00',
        surface: '#FFFFFF',
        surfaceAlt: '#F9FAFB',
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
        glass: '0 20px 45px rgba(3, 3, 8, 0.55)',
        glow: '0 0 0 1px rgba(255, 140, 0, 0.25), 0 20px 40px rgba(75, 0, 130, 0.3)',
        neon: '0 0 0 1px rgba(255, 140, 0, 0.6), 0 0 24px rgba(255, 140, 0, 0.25)',
      },
    },
  },
  plugins: [],
}

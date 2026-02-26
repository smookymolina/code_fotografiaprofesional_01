/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        'near-black': '#0A0A0A',
        surface: '#111111',
        'surface-hover': '#1A1A1A',
        ivory: '#F5F0E8',
        gold: '#C9A96E',
        'gold-light': '#D4B87A',
        danger: '#E05C5C',
      },
      fontFamily: {
        cormorant: ['"Cormorant Garamond"', 'serif'],
        dm: ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.3em',
        widest3: '0.15em',
      },
      backdropBlur: {
        xl: '24px',
      },
    },
  },
  plugins: [],
}

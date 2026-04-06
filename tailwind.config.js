/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#F5F1E8',
        sage: '#DCE3D2',
        pine: '#234232',
        moss: '#4B7057',
        ink: '#1D241F',
        mist: '#FAF8F2',
      },
      boxShadow: {
        panel: '0 18px 45px rgba(30, 46, 35, 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontFamily: {
        sans: ['"Manrope"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
};

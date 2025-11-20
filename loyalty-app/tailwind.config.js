/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-yellow': '#FFD100', // Happy Potato Yellow
        'brand-red': '#E31837', // Happy Potato Red
        'brand-purple': '#5E2750', // Happy Potato Purple (Text/Accent)
        'brand-orange': '#FFA500', // Accent Orange
        'brand-brown': '#4E342E', // Dark Brown for text
        'brand-bg': '#FFFDF5', // Light warm background
        'brand-text': '#4E342E', // Main text color
        'brand-gray': '#F3F4F6',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'bounce-short': 'bounce 1s infinite',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'axia-blue': '#0066CC',
        'axia-light': '#E6F0FF',
      },
    },
  },
  plugins: [],
} 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#131921',
          light: '#232f3e',
        },
        accent: {
          DEFAULT: '#FF9900',
          dark: '#E88A00',
        },
        cream: '#F7F7F5',
      },
      fontFamily: {
        sans: ['Inter', 'Helvetica', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

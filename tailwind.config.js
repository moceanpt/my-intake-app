const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.{css}', 
  ],
  theme: {
    extend: {
      colors: {
        ...colors, // ✅ includes gray-50, slate, etc.
        coast: {
          50:  '#f1fafc',
          100: '#e0f4f7',
          200: '#c7e9ef',
          300: '#a5d9e3',
          400: '#7ec7d6',
          500: '#5ab5c9',
          600: '#3e9bb1',
          700: '#2e7f93',
          800: '#276879',
          900: '#1c4852',
        },
      },
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  // ➊  Where Tailwind should look for class names
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './Components/**/*.{js,jsx,ts,tsx}',
    './styles/**/*.{css}',
  ],

  // ➋  Design-token tweaks
  theme: {
    extend: {
      colors: {
        ...colors,     // ← puts gray-50, slate-700, etc. back
        coast: {       // ← your custom palette
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

  // ➌  Plugins (leave empty for now)
  plugins: [],
}
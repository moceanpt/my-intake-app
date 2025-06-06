/** @type {import('tailwindcss').Config} */
module.exports = {
  content: {
    // 🔸  ALL the globs go in `files`
    files: [
      './pages/**/*.{js,jsx,ts,tsx}',
      './components/**/*.{js,jsx,ts,tsx}',
      './Components/**/*.{js,jsx,ts,tsx}',
      './styles/**/*.{css}',
    ],

    // 🔸  …and  *here* is where `safelist` lives in v4
    safelist: [
      'bg-blue-600',
      'text-white',
      'border-blue-600',
    ],
  },

  theme: {
    extend: {
      /* add design tokens later */
    },
  },
  plugins: [],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal: {
          950: '#0B0B0D',
          900: '#15161A',
          850: '#1C1E24',
          800: '#262730',
          700: '#383A47',
        },
        crimson: {
          950: '#450A0A',
          900: '#7F1D1D',
          800: '#991B1B',
          600: '#DC2626',
          500: '#EF4444',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f1f7f3',
          100: '#dcece1',
          200: '#b9d9c4',
          300: '#8cbf9f',
          400: '#5fa17c',
          500: '#3f8460',
          600: '#2f684c',
          700: '#27523e',
          800: '#204233',
          900: '#1b372b',
        },
        sand: {
          50: '#faf9f6',
          100: '#f2efe8',
          200: '#e5dfd0',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
        urdu: ['"Noto Nastaliq Urdu"', 'serif'],
      },
    },
  },
  plugins: [],
}

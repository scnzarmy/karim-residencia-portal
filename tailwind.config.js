/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f6f4ef',
          100: '#e9e4d8',
          200: '#d6cbb5',
          300: '#b7a68a',
          400: '#93816a',
          500: '#5f5c48',
          600: '#42503b',
          700: '#333f2e',
          800: '#2b2a26',
          900: '#232425',
        },
        sand: {
          50: '#f7f5f1',
          100: '#efe9df',
          200: '#ddd0ba',
        },
        gold: {
          50: '#faf6ea',
          100: '#f0e6c4',
          400: '#c9b273',
          500: '#b8a360',
          600: '#a38f4f',
          700: '#8a7841',
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

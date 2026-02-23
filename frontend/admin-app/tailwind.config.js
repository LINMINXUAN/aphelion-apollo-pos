/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF7F1',
          100: '#FDEFE6',
          200: '#F8DCCB',
          300: '#F0C2A6',
          400: '#E9A57C',
          500: '#E08A5B',
          600: '#CD7546',
          700: '#A95B34',
          800: '#874828',
          900: '#6F3C22',
        },
        sand: {
          50: '#FBFAF8',
          100: '#F6F1E9',
          200: '#EFE6D9',
          300: '#E5D8C6',
          400: '#D6C4AD',
          500: '#C3AD92',
          600: '#A98F72',
          700: '#8A7257',
          800: '#6E5A45',
          900: '#574739',
        },
        ink: {
          50: '#F7F5F2',
          100: '#EDE7DF',
          200: '#D5CBBE',
          300: '#B5A89A',
          400: '#9B8D7F',
          500: '#7D7368',
          600: '#5E584F',
          700: '#49443E',
          800: '#353230',
          900: '#2B2927',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      boxShadow: {
        soft: '0 8px 24px rgba(41, 33, 26, 0.08)',
        lifted: '0 16px 40px rgba(41, 33, 26, 0.12)',
      },
    },
  },
  plugins: [],
}

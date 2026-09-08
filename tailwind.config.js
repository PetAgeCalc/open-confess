/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffe4ea',
          200: '#ffc9d6',
          300: '#ff9fb5',
          400: '#fb6f95',
          500: '#f0426f',
          600: '#d92a5a',
          700: '#b81f49',
          800: '#921a3d',
          900: '#7a1936',
        },
        plum: {
          500: '#6d4b8a',
          600: '#5a3d73',
          700: '#472f5c',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

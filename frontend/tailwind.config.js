/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          900: '#312e81',
        },
      },
      boxShadow: {
        glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
        soft: '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-sidebar': 'linear-gradient(180deg, #4f46e5 0%, #7c3aed 100%)',
      },
    },
  },
  plugins: [],
};

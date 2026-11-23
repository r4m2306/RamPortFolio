/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Single accent color (indigo). Change these to re-theme the whole site.
        accent: {
          50: '#eef2ff',
          100: '#e0e7ff',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
      },
      boxShadow: {
        soft: '0 8px 30px rgba(15, 23, 42, 0.08)',
        'soft-dark': '0 8px 30px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
}

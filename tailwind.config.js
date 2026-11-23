/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#080E1C',
          900: '#0B1324',
          DEFAULT: '#101B35',
          800: '#101B35',
          700: '#182647',
          600: '#223561',
        },
        royal: {
          50: '#EEF3FF',
          100: '#E0E8FE',
          200: '#C7D5FD',
          300: '#9FB8FC',
          400: '#6D92F7',
          DEFAULT: '#315FEA',
          500: '#315FEA',
          600: '#244BC8',
          700: '#1B389D',
          800: '#182E7D',
        },
        canvas: '#F7F8FA',
        surface: '#FFFFFF',
        muted: '#64748B',
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      borderRadius: {
        'card': '0.75rem',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 27, 53, 0.05), 0 1px 2px -1px rgba(16, 27, 53, 0.05)',
        'card': '0 4px 6px -1px rgba(16, 27, 53, 0.06), 0 2px 4px -2px rgba(16, 27, 53, 0.04)',
        'elevated': '0 10px 15px -3px rgba(16, 27, 53, 0.08), 0 4px 6px -4px rgba(16, 27, 53, 0.04)',
      },
    },
  },
  plugins: [],
}

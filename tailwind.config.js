/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./client/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Shared motion tokens so every transition feels like part of one system
      transitionTimingFunction: {
        DEFAULT: 'cubic-bezier(0.22, 1, 0.36, 1)',
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      transitionDuration: {
        DEFAULT: '300ms',
        fast: '200ms',
        base: '300ms',
        slow: '500ms',
        long: '700ms',
      },
      keyframes: {
        'fade-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 400ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-up': 'fade-up 500ms cubic-bezier(0.22, 1, 0.36, 1) both',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Bricolage Grotesque"', 'Inter', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


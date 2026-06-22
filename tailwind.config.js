/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#d4af37',
        'primary-light': '#f4d77f',
        secondary: '#1a1a2e',
        accent: '#d4af37',
        carbon: '#1a1a2e',
        beth: {
          ink: '#0f0f0f',
          night: '#1a1a2e',
          gold: '#d4af37',
          goldSoft: '#f4d77f',
          ivory: '#f5f5f5',
          wine: '#d4af37',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Open Sans"', 'sans-serif'],
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      animation: {
        fadeInUp: 'fadeInUp 1.2s ease-out',
        float: 'float 6s ease-in-out infinite',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(212, 175, 55, 0.18)',
      },
    },
  },
  plugins: [],
}

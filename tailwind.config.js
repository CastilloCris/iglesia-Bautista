/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary:        '#7C3D12',   // Marrón cálido — títulos, botones principales
        'primary-light':'#9A4F1A',
        secondary:      '#FFFDF7',   // Blanco marfil — fondo general
        accent:         '#B8860B',   // Dorado oscuro — bordes de cards, líneas decorativas
        'accent-light': '#D4A017',   // Dorado claro — hover de bordes
        surface:        '#FFFFFF',   // Blanco puro — fondo de cards
        muted:          '#6B5B45',   // Texto secundario
        carbon:         '#2D2D2D',   // Texto cuerpo
        // Legacy beth.* tokens kept for backwards compat
        beth: {
          ink:     '#0f0f0f',
          night:   '#FFFDF7',
          gold:    '#B8860B',
          goldSoft:'#D4A017',
          ivory:   '#f5f5f5',
          wine:    '#7C3D12',
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

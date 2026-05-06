import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        '2xl': '1280px',
      },
    },
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0B3C5D',
          50:  '#E6EEF4',
          100: '#C4D6E3',
          200: '#9DBAD0',
          300: '#759EBC',
          400: '#4E83A8',
          500: '#286895',
          600: '#1D70B8',
          700: '#0B3C5D',
          800: '#082E47',
          900: '#051F31',
        },
        accent: '#1D70B8',
        ink: '#1A1A1A',
        muted: {
          DEFAULT: '#6B7280',
          foreground: '#6B7280',
        },
        background: '#FFFFFF',
        foreground: '#1A1A1A',
        border: '#E5E7EB',
        ring: '#1D70B8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '24px',
        md: '20px',
        sm: '16px',
      },
      boxShadow: {
        soft: '0 8px 24px rgba(11, 60, 93, 0.08)',
        card: '0 12px 36px rgba(11, 60, 93, 0.10)',
        glow: '0 0 0 1px rgba(29, 112, 184, 0.15), 0 24px 48px rgba(11, 60, 93, 0.12)',
      },
      backgroundImage: {
        'hero-gradient':
          'radial-gradient(circle at 20% 20%, rgba(29,112,184,0.18), transparent 50%), radial-gradient(circle at 80% 0%, rgba(11,60,93,0.16), transparent 60%)',
        'glass':
          'linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.35))',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;

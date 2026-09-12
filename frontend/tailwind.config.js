/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
        serif: ['Besley', 'IBM Plex Serif', 'serif'],
        mono: ['Space Mono', 'JetBrains Mono', 'monospace'],
        league: ['"League Gothic"', 'sans-serif'],
        besley: ['Besley', 'serif'],
      },
      colors: {
        redrob: {
          canvas: '#061B2E',
          surface: '#08243A',
          card: '#0B2D46',
          cardHover: '#103A59',
          blue: '#2b52ff',
          blueHover: '#1d3fe8',
          blueLight: '#e5efff',
          violet: '#7c24ff',
          purple: '#9650ff',
          aqua: '#00e3d8',
          lime: '#53e097',
          amber: '#ffb300',
          coral: '#ff4050',
          text: '#f8fafc',
          muted: '#93a2c1',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        paper: {
          900: '#001D39',
          800: '#0A4174',
          700: '#49769F',
          600: '#4E8EA2',
          500: '#6EA2B3',
          400: '#7BBDE8',
          300: '#BDD8E9',
        },
        cyber: {
          900: '#050814',
          850: '#090d1f',
          800: '#0b1026',
          700: '#141d3d',
          600: '#233971',
          border: 'rgba(255, 255, 255, 0.08)',
          accent: '#2b52ff',
          danger: '#ff4050',
          warning: '#ffb300',
          success: '#53e097'
        }
      },
      boxShadow: {
        'redrob-card': '0 0.78px 0.54px -0.21px rgba(0,0,0,0.03), 0 1.91px 1.34px -0.42px rgba(0,0,0,0.03), 0 6.35px 4.44px -0.85px rgba(0,0,0,0.03), 0 20.24px 14.17px -1.28px rgba(0,0,0,0.05), 0 40px 28px -1.5px rgba(0,0,0,0.05)',
        'redrob-glow': '0 0 40px -10px rgba(43, 82, 255, 0.35)',
        'redrob-violet-glow': '0 0 40px -10px rgba(124, 36, 255, 0.35)',
        'redrob-aqua-glow': '0 0 30px -10px rgba(0, 227, 216, 0.35)',
      },
      animation: {
        'marquee': 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 35s linear infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 8s ease-in-out 4s infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.03)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}

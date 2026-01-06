import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#FF003D',
        background: '#FAFAF7',
        surface: '#FFFFFF',
        text: '#1F1B16',
        'muted-border': '#E4DFD7',
        'subtle-highlight': '#F6F1E6',
        'text-muted': '#85776B',
        'card-border': '#EDE6DA',
        'card-shadow': '#E8E1D6',
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'serif'],
        body: ['var(--font-body)', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'underline-expand': 'underlineExpand 0.8s ease-out 0.3s forwards',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'floatDelayed 8s ease-in-out infinite',
        'float-slow': 'floatSlow 10s ease-in-out infinite',
        'spin-slow': 'spinSlow 20s linear infinite',
        'spin-reverse': 'spinReverse 15s linear infinite',
        'shine': 'shine 2s ease-in-out infinite',
        'bounce-slow': 'bounceSlow 3s ease-in-out infinite',
        'line-sweep': 'lineSweep 4s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        underlineExpand: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config


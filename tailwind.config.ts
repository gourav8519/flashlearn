import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        flicker: {
          '0%, 100%': { transform: 'scaleY(1) scaleX(1) translateX(0)' },
          '25%':      { transform: 'scaleY(1.05) scaleX(0.97) translateX(-1px)' },
          '50%':      { transform: 'scaleY(0.97) scaleX(1.03) translateX(0)' },
          '75%':      { transform: 'scaleY(1.03) scaleX(0.98) translateX(1px)' },
        },
      },
      animation: {
        flicker: 'flicker 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070E1C',
          900: '#0B1B33',
          800: '#122A4D',
          700: '#1B3A66',
          400: '#7E92B0',
          300: '#9FB0C8',
          200: '#C4CEDE',
          100: '#E4E9F1',
        },
        ember: {
          400: '#FFA25C',
          500: '#FF8A3D',
          600: '#F5731F',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,14,28,0.04), 0 8px 24px -8px rgba(7,14,28,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;

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
        // A second, deliberately distinct accent used only for the Call
        // Center / advanced-tier content — signals "this is the upgraded
        // layer" rather than reusing ember everywhere on the site.
        signal: {
          300: '#7DEAD6',
          400: '#4CD9BE',
          500: '#22C1A3',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,14,28,0.04), 0 8px 24px -8px rgba(7,14,28,0.12)',
      },
    },
  },
  plugins: [],
};

export default config;

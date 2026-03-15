import type { Config } from 'tailwindcss';

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // enable class‑based dark mode
  theme: {
    extend: {
      colors: {
        // dark palette
        darkBg: '#0d1117',
        darkSurface: '#161b22',
        darkBorder: '#30363d',
        darkText: '#e6edf3',
        darkAccent: '#58a6ff',
        darkCodeBg: '#1f2428',
        // light palette (Tailwind defaults are fine, but we expose a few custom ones)
        lightAccent: '#0969da',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;
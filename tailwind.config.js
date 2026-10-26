/** @type {import('tailwindcss').Config} */

// Reads a "R G B" CSS custom property (defined in src/index.css for both
// :root/dark and .light) and turns it into a color Tailwind can also apply
// opacity modifiers to (e.g. bg-base-850/50, border-line/60). Without this,
// opacity-suffixed utilities get baked in at build time from a static hex
// and ignore the .light theme override — which was the root cause of the
// light-mode backgrounds/borders staying dark.
function themeColor(variable) {
  return ({ opacityValue }) =>
    opacityValue === undefined
      ? `rgb(var(${variable}))`
      : `rgb(var(${variable}) / ${opacityValue})`;
}

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Base surfaces — theme-aware (see --bg-* vars in index.css)
        base: {
          950: themeColor('--bg-base'),
          900: themeColor('--bg-surface'),
          850: themeColor('--bg-surface-2'),
          800: themeColor('--bg-surface-3'),
          750: themeColor('--bg-hover'),
          700: themeColor('--bg-hover'),
          hover: themeColor('--bg-hover'),
        },
        // Borders / dividers — theme-aware
        line: {
          DEFAULT: themeColor('--border-default'),
          soft: themeColor('--border-soft'),
          strong: themeColor('--border-strong'),
        },
        // Text — theme-aware
        ink: {
          primary: themeColor('--text-primary'),
          secondary: themeColor('--text-secondary'),
          muted: themeColor('--text-muted'),
          faint: themeColor('--text-faint'),
        },
        // Brand accent — controlled teal
        accent: {
          50: '#effdfb',
          100: '#c8fdf5',
          200: '#91f9ea',
          300: '#5ef0dc',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Semantic
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem' }],
      },
      borderRadius: {
        'xl': '0.875rem',
        '2xl': '1.125rem',
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 0 rgba(0,0,0,0.2)',
        'card': '0 4px 24px -8px rgba(0,0,0,0.5)',
        'glow': '0 0 24px -4px rgba(45,212,191,0.25)',
        'float': '0 24px 64px -16px rgba(0,0,0,0.6)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'count': 'count 1.2s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'draw': 'draw 1.5s ease-out forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        count: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        draw: {
          '0%': { strokeDashoffset: '400' },
          '100%': { strokeDashoffset: '0' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
};

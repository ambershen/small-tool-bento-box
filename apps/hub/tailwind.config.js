/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#F2EDE7',
        foreground: '#0A0A0C',
        primary: '#0A0A0C',
        secondary: '#82667F',
        accent: '#D14A61',
        muted: '#2C3E5C',
        // Brand palette
        brand: {
          black: '#0A0A0C',
          white: '#F2EDE7',
          purple: '#82667F',
          navy: '#2C3E5C',
          red: '#D14A61',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Times New Roman', 'Times', 'serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'brutal': '3px 3px 0 0 #0A0A0C',
        'brutal-lg': '6px 6px 0 0 #0A0A0C',
        'brutal-hover': '1px 1px 0 0 #0A0A0C',
      },
      borderWidth: {
        '1': '1px',
        '2': '2px',
        '3': '3px',
      },
      letterSpacing: {
        'tightest': '-0.05em',
      }
    },
  },
  plugins: [],
}

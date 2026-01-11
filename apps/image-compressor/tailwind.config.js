/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#0A0A0C",
          white: "#F2EDE7",
          purple: "#82667F",
          navy: "#2C3E5C",
          coral: "#D14A61",
        },
      },
    },
  },
  plugins: [],
}

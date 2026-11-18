/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"], thmanyah: ['"Thmanyah Sans"', "-apple-system", "system-ui", "sans-serif"] },
      colors: {
        "background": {
          "DEFAULT": "rgb(var(--background) / <alpha-value>)",
          "card": "rgb(var(--background-card) / <alpha-value>)",
          "darker": "rgb(var(--background-darker) / <alpha-value>)",
        },
        "primary": {
          "DEFAULT": "rgb(var(--primary) / <alpha-value>)",
          "darker": "rgb(var(--primary-darker) / <alpha-value>)",
        },
        "secondary": {
          "DEFAULT": "rgb(var(--secondary) / <alpha-value>)",
          "darker": "rgb(var(--secondary-darker) / <alpha-value>)",
          "lighter": "rgb(var(--secondary-lighter) / <alpha-value>)",
          "input-gray": "rgb(var(--secondary-input-gray) / <alpha-value>)",
          "input-blue": "rgb(var(--secondary-input-blue) / <alpha-value>)",
        },
        "action": {
          "DEFAULT": "rgb(var(--action) / <alpha-value>)",
          "darker": "rgb(var(--action-darker) / <alpha-value>)",
        },
        "elementary": "rgb(var(--elementary) / <alpha-value>)",
        "danger": "rgb(var(--danger) / <alpha-value>)",
        "avatar-bg": "rgb(var(--avatar-bg) / <alpha-value>)",
        "card": "rgb(var(--background-card) / <alpha-value>)",
        "text": {
          "title": "rgb(var(--text-title) / <alpha-value>)",
          "regular": "rgb(var(--text-regular) / <alpha-value>)",
          "primary": "rgb(var(--text-primary) / <alpha-value>)",
          "on-primary": "rgb(var(--text-on-primary) / <alpha-value>)",
          "on-action": "rgb(var(--text-on-action) / <alpha-value>)",
          "tertiary": "rgb(var(--text-tertiary) / <alpha-value>)",
        },
        hj: {
          bg: "#1e1f2c",
          card: "#272839",
          card2: "#2e2f43",
          line: "#3a3b52",
          top: "#2f64b3",
          blue: "#3b7ddd",
          sky: "#7fb2ff",
          green: "#4cc38a",
          text: "#e8e8f0",
          muted: "#9c9db3",
        },
        spl: {
          ink: "#183d41",      // top utility bar / footer
          deep: "#1f4651",     // headings, selected segments
          teal: "#2e6475",     // primary brand
          sky: "#00bfdc",      // action buttons
          skysoft: "#e5f8fb",
          price: "#2f8fb3",
          line: "#d9e3e6",
          bg: "#f4f7f8",
        },
      },
      boxShadow: { card: "0 2px 10px rgba(22,50,58,0.08)" },
    },
  },
  plugins: [],
};

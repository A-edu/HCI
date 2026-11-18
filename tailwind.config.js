/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans Arabic"', "system-ui", "sans-serif"] },
      colors: {
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

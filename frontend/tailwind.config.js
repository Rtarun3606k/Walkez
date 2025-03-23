/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        "coustome-screen": "368px",
        xs: { max: "600px" },
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      width: {
        "60vw": "60vw",
        "40vw": "40vw",
      },
    },
  },
  plugins: [],
};

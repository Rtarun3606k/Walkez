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
        "50vw": "50vw",
      },
      fontSize: {
        'xxs': '0.5rem', // Half of text-xs (0.75rem)
        'xxxs': '0.375rem', // Half of text-xxs
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screens: {
      "xs": "480px",
      "sm": "768px",
      "md": "976px",
      "lg": "1440px",
      "xl": "1920px"
    },
    extend: {
      fontFamily: {
        rubik: ["Rubik"]
      },
      colors: {
        veryDarkGray: "hsl(0, 0%, 17%)",
        darkGray: "hsl(0, 0%, 59%)",
        gray: "hsl(0, 0%, 30%)",
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js}"],
  theme: {
    screens: {
      "sm": "768px",
      "md": "976px",
      "lg": "1440px",
      "xl": "1920px"
    },
    extend: {
      colors: {
        darkBlue: "hsl(209, 23%, 22%)",
        veryDarkBlue: "hsl(207, 26%, 17%)",
        darkGray: "hsl(0, 0%, 52%)",
        veryLightGray: "hsl(0, 0%, 98%)"
      },
      fontFamily: {
        barlow: ["Barlow Condensed"]
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screen: {
      sm: "768px",
      md: "976px",
      lg: "1440px",
      xl: "1920px"
    },
    extend: {
      colors: {
        veryDarkBlue: "#141519",
        lessDarkBlue: "#222933",
        grayishBlue: "#262f38",
        newGray: "#7c8898",
        darkerThanLessBlue: "#171e28",
        brightOrange: "#fc7613",
        lightGray: "hsl(0, 0%, 64%)"
      }
    },
  },
  plugins: [],
}

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
        col1: "#e28525",
        col2: "#016972",
        col3: "#00403f",
        veryLightGray: "hsl(0, 0%, 98%)"
      },
      fontFamily: {
        titleFont: ["Barlow Condensed"]
      },
      spacing: {
        "128": "36rem",
        "13": "3.25rem"
      },
    },
  },
  plugins: [],
}

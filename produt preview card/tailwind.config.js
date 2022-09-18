/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screen: {
      sm: "768px",
      md: "976px",
      lg: "1440px",
      xl: "1920px",
      lg2: "1920px"
    },
    extend: {
      colors: {
        lightCream: "f3eae3",
        lightGray: "#75767b",
        moneyGreen: "#398369",
      },
      fontFamily: {
        perfume: ["Abril Fatface"] 
      }
    },
  },
  plugins: [],
}

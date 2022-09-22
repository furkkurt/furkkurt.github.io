/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {  
    screens: {
      "sm": "768px",
      "md": "976px",
      "lg": "1440px",
      "xl": "1920px"
    },
    extend: {
      colors: {
        softRed: "hsl(14, 88%, 65%)",
        veryDarkBlue: "hsl(238, 29%, 16%)",
        lightGrayishBlue: "hsl(240, 5%, 91%)",
        softViolet: "hsl(273, 75%, 66%)",
        softBlue: "hsl(240, 73%, 65%)",
        white: "#ffffff",
        textColor: "hsl(228, 45%, 44%);"
      },
      fontFamily: {
        kumbh: ["Kumbh Sans"]
      },
      spacing: {
        "160": "40rem",
        "320": "80rem",
      },
      backgroundImage: {
        "desktop": "url('../images/bg-pattern-desktop.svg')", 
        "mobile": "url('../images/bg-pattern-mobile.svg')", 
      }
    },
  },
  plugins: [],
}

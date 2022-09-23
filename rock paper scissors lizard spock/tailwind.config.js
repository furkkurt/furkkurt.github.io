/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./*.js"],
  theme: {
    screens: {
      "sm": "768px",
      "md": "976px",
      "lg": "1440",
      "xl": "1920"
    },
    extend: {
      colors: {
        scissorsGradientFrom: "hsl(39, 89%, 49%)", 
        scissorsGradientTo: "hsl(40, 84%, 53%)",
        paperGradientFrom: "hsl(230, 89%, 62%)",
        paperGradientTo: "hsl(230, 89%, 65%)",
        rockGradientFrom: "hsl(349, 71%, 52%)",
        rockGradientTo: "hsl(349, 70%, 56%)",
        lizardGradientFrom: "hsl(261, 73%, 60%)", 
        lizardGradientTo: "hsl(261, 72%, 63%)",
        spockGradientFrom: "hsl(189, 59%, 53%)",
        spockGradientTo: "hsl(189, 58%, 57%)",
        darkText: "hsl(229, 25%, 31%)",
        scoreText: "hsl(229, 64%, 46%)",
        headerOutline: "hsl(217, 16%, 45%)",
        radialGradientFrom: "hsl(214, 47%, 23%)", 
        radialGradientTo: "hsl(237, 49%, 15%)"
      },
      fontFamily: {
        barlow: ["Barlow Condensed"]
      },
      spacing: {
        "100": "25rem",
        "120": "30rem",
        "128": "32rem",
        "160": "40rem"
      }
    },
  },
  plugins: [],
}

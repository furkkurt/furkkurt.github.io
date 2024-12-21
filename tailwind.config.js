/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      backgroundImage: {
        'hero': "url('../assets/bg.png')",
        'about': "url('../assets/bg2.png')"
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}", "!./node_modules"],
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


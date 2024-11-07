/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html, js}", "./components/*.js"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px"
    },
    extend: {
      backgroundImage: {
        'tp1': "url('/assets/bg.jpg')",
        'newspaper': "url('/assets/newspaper.png')",
      },
      colors: {
        brightRed: " #f6866a",
        brightRedLight: " #fdece7",
        darkBlue: "#242d52",
        tpRed: "#e74f4f",
        tpBlue: "#74bdb7",
        tpGrey: "#332f2f",
        tpGreen: "#47a54e",
        tpPink: "	#f9e9e9",
        smokeyWhite: "#f5f5f5",
        honeyGold: " #FDF1DF",
        logoBlue: "#00ADEF",
        cozyYellow: "#ffd97d",
        cozyRed: "#910c1e",
        cozyWhite: "#fffff0",
        cozyGreen: "#1f400a",
        cozyGray: "#d4d4d4",
        jewWhite: "#efebe1",
        jewYellow: "#cab273",
        jewPurple: "#551756",
        p1Blue: "#607274",
        p1Yellow: "#FAEED1",
        p1Yellow2: "#DED0B6",
        p1Gray: "#B2A59B",

      },
      fontFamily: {
        custom1: ["Rowdies"],
        custom2: ["IBM Plex Mono"],
        custom3: ["Space Grotesk"]
      },
      rotate: {
        270: "-90deg"
      },
      spacing: {
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
        '192': '48rem',
        '256': '64rem',
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 12s linear infinite',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
}


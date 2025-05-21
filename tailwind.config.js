/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
      extend: {
        colors:{
          tablerow:'var(--tablerow)',
          textrow:'var(--textrow)'
        }
      },
    },
    plugins: [require("tailwindcss-animate")],
  }
  
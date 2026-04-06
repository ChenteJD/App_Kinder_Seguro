/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        kinder: {
          girasoles: "#FFD93D",
          petalos: "#FF6B9D",
          estrellas: "#6BCB77",
          mar: "#2196F3",
          bg: "#F9FAFB"
        }
      }
    },
  },
  plugins: [],
}

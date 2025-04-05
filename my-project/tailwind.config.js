/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        rgbBorder: "rgbBorder 6s infinite linear",
      },
      keyframes: {
        rgbBorder: {
          "0%": { borderImageSource: "linear-gradient(90deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffee, #4c00ff, #ff00ff, #ff0000)" },
          "50%": { borderImageSource: "linear-gradient(90deg, #ff7300, #ffeb00, #47ff00, #00ffee, #4c00ff, #ff00ff, #ff0000, #ff7300)" },
          "100%": { borderImageSource: "linear-gradient(90deg, #ff0000, #ff7300, #ffeb00, #47ff00, #00ffee, #4c00ff, #ff00ff, #ff0000)" },
        },
      },
    },
  },
  plugins: [],
}

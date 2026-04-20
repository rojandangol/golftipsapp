// Cite: NativeWind Setup https://www.nativewind.dev/getting-started/installation#2-setup-tailwind-css

/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#00695B',
          200: '#3E8F72',
        },
        secondary: {
          100: '#F0E5C3',
          200: '#C5BD74',
          300: '#c7c080',
        },
        accent: '#413728',
        white: '#FFFEF1'



      }
    },
  },
  plugins: [],
}
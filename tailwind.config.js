/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Set 'Inter' as the default sans font
        custom: ['YourCustomFont', 'sans-serif'], // Define a custom font class
      },
    },
  },
  plugins: [],
}
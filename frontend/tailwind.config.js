/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: '#0F172A',      // deep slate background
        surface: '#1A2333',  // card surface
        gold: '#D4A24C',     // accent — money/value
        mist: '#94A3B8',     // muted text
      },
    },
  },
  plugins: [],
}


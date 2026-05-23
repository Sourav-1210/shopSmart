/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        flipkart: {
          blue: '#2874F0',
          yellow: '#FFE11B',
          orange: '#FB641B',
          green: '#388E3C',
          lightblue: '#F0F5FF',
          gray: '#F1F3F6',
          textgray: '#878787',
          darkgray: '#212121',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./splash.html", // jos käytät splash.html:ää erikseen
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        loading: 'loadingBar 1s linear infinite',
      },
      keyframes: {
        loadingBar: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(130%)' },
        },
      },
    },
  },
  plugins: [],
}
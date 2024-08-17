/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue, js, ts, jsx, tsx}'],
  theme: {
    extend: {
      colors: {
        lightw: 'rgb(229, 231, 235)',
      },
    },
  },
  plugins: [],
};

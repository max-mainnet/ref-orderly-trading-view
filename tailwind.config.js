/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        boxBorder: '#1D2932',
        primary: '#7E8A93',
        sellRed: '#F96767',
        buyGreen: '#90E3B9',
      },
    },
  },
  plugins: [],
  content: ['./src/**/*.{js,jsx,ts,tsx,html}', './public/index.html'],
};

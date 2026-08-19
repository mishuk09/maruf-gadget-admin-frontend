module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['Nunito', 'sans-serif'],
        'source-sans-3': ['"Source Sans Pro"', 'sans-serif'],
        verdina: ['Verdina', 'sans-serif'],
        lato: ['Lato', 'sans-serif'],
        sans: ['Fira Sans', 'Inter', 'sans-serif'],
        'noto-sans-bengali': ['Noto Sans Bengali', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
        },
      },
    },
  },
  plugins: [],
};

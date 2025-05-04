/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f85a00',
        secondary: '#041a24',
        'text-primary': '#041a24',
        'text-secondary': '#8b96a0',
        'border-color': '#e5e7eb',
        'hover-bg': 'rgba(255, 255, 255, 0.05)',
      },
      backgroundColor: {
        'header-bg': '#041a24',
        'dropdown-hover': 'rgba(248, 90, 0, 0.05)',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
    },
  },
  plugins: [],
}
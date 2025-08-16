export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
   theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#00AEEF", // Azul brillante Runawulf
          dark: "#008FCC",
          light: "#33CFFF",
        },
        night: {
          DEFAULT: "#0A1F44", // Azul noche lobo
          light: "#132C5B",
        },
        moon: {
          DEFAULT: "#B0BEC5", // Gris lunar
          light: "#CFD8DC",
        },
        alert: "#FF6B35",     // Naranja acento
        base: "#F5F7FA",      // Fondo claro
      },
    },
  },
  plugins: [],
}

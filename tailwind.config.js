/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: {
            DEFAULT: '#1E3A27', // Deep Mehendi Green
            dark: '#143525',    // Rich Dark Green
            light: '#2d5438',   // Medium Green
          },
          gold: {
            DEFAULT: '#C5A880', // Antique Gold
            champagne: '#E6D5B8', // Champagne Gold
            dark: '#a88a5f',
          },
          ivory: '#FAF9F6',     // Ivory White
          beige: '#F3EFE0',     // Soft Beige
          charcoal: '#2A2A2A',  // Rich Charcoal
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'luxury-texture': "url('/assets/patterns/luxury-texture.png')",
      }
    },
  },
  plugins: [],
}

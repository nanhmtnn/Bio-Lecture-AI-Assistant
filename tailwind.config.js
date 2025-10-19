// tailwind.config.js

module.exports = {
  // ... other configurations
  darkMode: 'class', // <--- MUST be 'class'
  theme: {
    extend: {
      // ... your theme extensions
    },
  },
  plugins: [
    // Ensure the Typography plugin is here
    require('@tailwindcss/typography'), 
  ],
}
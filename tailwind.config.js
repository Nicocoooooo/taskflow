/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#8B5CF6',        // Violet principal
        'primary-light': '#A78BFA', // Violet clair
        success: '#10B981',        // Vert menthe
        warning: '#FB923C',        // Orange/Saumon
        error: '#EF4444',          // Rouge
        'text-primary': '#1F2937', // Texte principal
        'text-secondary': '#6B7280', // Texte secondaire
        'text-tertiary': '#9CA3AF', // Texte tertiaire
        'bg-light': '#F8FAFC',     // Fond général
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
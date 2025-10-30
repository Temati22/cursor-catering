/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Hi-Catering Color Palette
        'text-yelow':'#E6B800',
        'hi-white': '#FFFFFF', 
        'hi-graphite': '#1E1F26',
        'hi-ash': '#F5F5F5',
        'hi-platinum': '#BFA76F',
        'hi-deep': '#1A1A1A',
        'hi-silver': '#D8D8D8',
        'hi-red': '#C64848',
        'hi-green': '#5AA469',
        'hi-yellow': '#E6B800', // Custom yellow color
        'hi-luxe': '#2B2B2B', // Dark color for buttons
        'hi-soft': '#F5F5F5', // Alias for ash
      },
      backgroundImage: {
        'hi-luxe': 'linear-gradient(90deg, #2B2B2B 0%, #BFA76F 100%)',
        'hi-soft': 'linear-gradient(180deg, #FFFFFF 0%, #F5F5F5 100%)',
      },
      fontFamily: {
        'serif': ['Times New Roman', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'hi': '0 4px 25px rgba(0, 0, 0, 0.08)',
        'hi-hover': '0 8px 35px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}

// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',  // For pages directory
    './components/**/*.{js,ts,jsx,tsx}',  // For components directory
    './src/app/**/*.{js,ts,jsx,tsx}',  // If you're using the app directory (Next.js 13+)
    './src/pages/**/*.{js,ts,jsx,tsx}',  // For pages directory
    './src/components/**/*.{js,ts,jsx,tsx}',  // For components directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

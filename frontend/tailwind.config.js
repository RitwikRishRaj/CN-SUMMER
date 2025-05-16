import('tailwindcss').Config
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        card: '#f9fafb', // Light gray background for cards
      },
    },
  },
  plugins: [],
};

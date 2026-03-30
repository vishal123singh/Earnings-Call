/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        dropdown: "0 4px 8px rgba(0, 0, 0, 0.05)", // Soft shadow
        focus: "0 0 0 2px rgba(59, 130, 246, 0.5)", // Focus ring
      },
    },
  },
  plugins: [],
};

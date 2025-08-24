/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    "border-b-2",
    "hover:border-red-500",
    "bg-gray-900",
    "text-yellow-400",
    "hover:bg-gray-800",
    "border-white"
    // ...kullandığın özel class'lar
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
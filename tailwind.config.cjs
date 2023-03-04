/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e6d56",
        ["primary-tint"]: "#eef4f3",
      },
    },
  },
};

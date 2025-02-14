/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        "background-lighter": "var(--background-lighter)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
        card: "var(--card)",
        "card-hover": "var(--card-hover)",
      },
    },
  },
  plugins: [],
};

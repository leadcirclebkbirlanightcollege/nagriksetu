/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // NagrikSetu government palette
        navy: {
          DEFAULT: "#0B3C6D",
          light: "#12518F",
          dark: "#082B4E",
        },
        saffron: {
          DEFAULT: "#FF9933",
          dark: "#E8842B",
        },
        india: {
          green: "#138808",
          greenDark: "#0F6B06",
        },
        ink: "#1F2933",
        muted: "#5B6672",
        line: "#D8DEE6",
        surface: "#F3F5F8",
        surfaceAlt: "#E9EEF4",
      },
      fontFamily: {
        sans: [
          "'Segoe UI'",
          "system-ui",
          "-apple-system",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,60,109,.06), 0 2px 8px rgba(11,60,109,.05)",
      },
      borderRadius: {
        gov: "6px",
      },
      maxWidth: {
        gov: "1200px",
      },
    },
  },
  plugins: [],
}

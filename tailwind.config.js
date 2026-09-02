/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // NagrikSetu government civic palette
        navy: {
          DEFAULT: "#0B3C6D",
          light: "#12518F",
          dark: "#082B4E",
          tint: "#EFF6FF",
        },
        saffron: {
          DEFAULT: "#E65100",
          dark: "#C2410C",
          amber: "#D97706",
          tint: "#FFF7ED",
        },
        govGreen: {
          DEFAULT: "#138808",
          dark: "#0F6B06",
          emerald: "#059669",
          tint: "#F0FDF4",
        },
        india: {
          green: "#138808",
          greenDark: "#0F6B06",
        },
        govRed: {
          DEFAULT: "#DC2626",
          dark: "#991B1B",
          tint: "#FEF2F2",
          border: "#FECACA",
        },
        ink: {
          DEFAULT: "#1E293B",
          dark: "#0F172A",
          muted: "#475569",
          light: "#64748B",
        },
        muted: "#475569",
        line: "#CBD5E1",
        lineSubtle: "#E2E8F0",
        surface: "#F8FAFC",
        surfaceAlt: "#F1F5F9",
      },
      fontFamily: {
        sans: [
          "'Segoe UI'",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Roboto",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 1px 3px rgba(8,43,78,0.06), 0 1px 2px rgba(8,43,78,0.04)",
        cardHover: "0 4px 12px rgba(8,43,78,0.08), 0 2px 4px rgba(8,43,78,0.04)",
        elevated: "0 10px 25px -5px rgba(8,43,78,0.1), 0 8px 10px -6px rgba(8,43,78,0.1)",
      },
      borderRadius: {
        gov: "4px",
        govLg: "6px",
      },
      maxWidth: {
        gov: "1240px",
      },
    },
  },
  plugins: [],
}

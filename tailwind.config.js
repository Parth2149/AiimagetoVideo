/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: "#FBF9F5",
          subtle: "#F5F2EB",
          card: "#FFFFFF",
        },
        ink: {
          DEFAULT: "#111418",
          secondary: "#474D57",
          muted: "#767E8C",
          faint: "#A5ACB8",
        },
        border: {
          subtle: "#EAE6DE",
          DEFAULT: "#DFD9CD",
          strong: "#C8C0B2",
        },
        accent: {
          blue: "#2563EB",
          orchid: "#D946EF",
          peach: "#FB923C",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Instrument Sans", "Inter", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        glossy: "0 1px 2px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
        card: "0 2px 8px -2px rgba(27, 24, 20, 0.05), 0 12px 32px -8px rgba(27, 24, 20, 0.08)",
        floating: "0 20px 48px -12px rgba(18, 20, 24, 0.16), 0 1px 2px rgba(0, 0, 0, 0.04)",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        shimmer: "shimmer 2.5s infinite linear",
      },
    },
  },
  plugins: [],
};


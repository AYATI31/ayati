import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ayati: {
          ink: "#173034",
          muted: "#5F7074",
          teal: "#0E6B68",
          blue: "#2D6CDF",
          coral: "#D66A4A",
          mint: "#DFF3EE",
          warm: "#FBFAF7",
          paper: "#F7F9F8",
          line: "#D9E2E0"
        }
      },
      boxShadow: {
        calm: "0 18px 48px rgba(23, 48, 52, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

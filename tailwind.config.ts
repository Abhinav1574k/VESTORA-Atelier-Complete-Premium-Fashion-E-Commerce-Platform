import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        vestora: {
          ivory: "#FBF9F6",
          bone: "#F4F0EA",
          cream: "#EFECE6",
          sand: "#E3DDD2",
          taupe: "#C7BEB0",
          charcoal: "#1F1F1E",
          jet: "#121212",
          gold: "#C5A880",
          goldLight: "#DFCFB8",
          bronze: "#967B56",
          terracotta: "#B45339",
          slate: "#4A4A48",
          muted: "#7A7875",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: ".2em",
        extrawide: ".25em",
        luxury: ".3em",
      },
      boxShadow: {
        soft: "0 4px 20px -2px rgba(18, 18, 18, 0.05)",
        card: "0 8px 30px rgba(0, 0, 0, 0.06)",
        float: "0 20px 40px -15px rgba(0, 0, 0, 0.12)",
      },
    },
  },
  plugins: [],
};
export default config;

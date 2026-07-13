import type { Config } from "tailwindcss";
import { businessConfig } from "./src/lib/business-config";

const { design: d } = businessConfig;

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: d.primaryColor,
        "primary-dark": d.primaryDarkColor,
        secondary: d.accentColor,
        background: d.backgroundColor,
        card: d.cardColor,
        foreground: d.textColor,
        muted: d.mutedTextColor,
        border: d.borderColor,
        "primary-soft": d.primarySoftColor,
        "secondary-soft": d.secondarySoftColor,
        "surface-rose": d.surfaceRoseColor,
        accent: d.accentColor,
        surface: d.surfaceRoseColor,
      },
      fontFamily: {
        arabic: ['"Noto Kufi Arabic"', "Tahoma", "sans-serif"],
        latin: ["ui-sans-serif", "system-ui", "sans-serif"],
      },
      maxWidth: {
        container: "1280px",
      },
      boxShadow: {
        soft: "0 8px 30px rgba(19, 78, 58, 0.08)",
        card: "0 4px 20px rgba(19, 78, 58, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;

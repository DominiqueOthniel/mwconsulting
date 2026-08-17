import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "var(--ink)",
        paper: "var(--paper)",
        forest: "var(--forest)",
        leaf: "var(--leaf)",
        gold: "var(--gold)",
        clay: "var(--clay)",
        mist: "var(--mist)",
        rule: "var(--rule)",
        sage: "var(--sage)",
      },
      fontFamily: {
        sans: [
          "Segoe UI",
          "system-ui",
          "sans-serif",
        ],
        serif: [
          "Palatino Linotype",
          "Palatino",
          "Georgia",
          "serif",
        ],
      },
    },
  },
  plugins: [],
};

export default config;

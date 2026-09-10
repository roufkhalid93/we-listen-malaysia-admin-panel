import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1B2033",
        cream: "#FBF8F3",
        blue: {
          50: "#EEF3FB",
          100: "#D7E3F5",
          200: "#AFC7EB",
          300: "#87ABE1",
          400: "#5A87CE",
          500: "#2F5FAE",
          600: "#1F447F", // primary blue
          700: "#183660",
          800: "#122843",
          900: "#0C1A2C",
        },
        pink: {
          50: "#FDEEF3",
          100: "#FBD6E3",
          200: "#F6AEC8",
          300: "#F186AC",
          400: "#EC5F90",
          500: "#E23E77", // primary pink
          600: "#BC2D5F",
          700: "#93234B",
          800: "#6B1936",
          900: "#440F22",
        },
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle at 1px 1px, rgba(27,32,51,0.06) 1px, transparent 0)",
      },
    },
  },
  plugins: [],
};
export default config;

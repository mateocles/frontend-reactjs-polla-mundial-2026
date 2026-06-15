/** @type {import('tailwindcss').Config} */
// Design System: "Pitch Kinetic Dark"
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0b1326",
          dim: "#0b1326",
          bright: "#31394e",
          "container-lowest": "#060d20",
          "container-low": "#131b2e",
          container: "#171f33",
          "container-high": "#222a3e",
          "container-highest": "#2d3449",
          variant: "#2d3449",
        },
        background: "#0b1326",
        "on-background": "#dbe2fd",
        "on-surface": "#dbe2fd",
        "on-surface-variant": "#b9cacb",
        outline: "#849495",
        "outline-variant": "#3a494b",
        primary: { DEFAULT: "#00f2ff", container: "#00f2ff" },
        "on-primary": "#00363a",
        "on-primary-container": "#006a71",
        secondary: { DEFAULT: "#d1bcff", container: "#7000ff" },
        "on-secondary": "#3c0090",
        tertiary: "#ffb4a2",
        "on-tertiary": "#621100",
        error: { DEFAULT: "#ffb4ab", container: "#93000a" },
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "0.25rem",
        DEFAULT: "0.5rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "0.75rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};

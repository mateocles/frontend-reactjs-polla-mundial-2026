/** @type {import('tailwindcss').Config} */
// Design System: "Pitch Kinetic" — tema dual (claro/oscuro) vía variables CSS.
// El cambio de tema se hace alternando la clase .dark / .light en <html>;
// los colores aquí leen las variables definidas en src/index.css.
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          "container-lowest": "var(--surface-container-lowest)",
          "container-low": "var(--surface-container-low)",
          container: "var(--surface-container)",
          "container-high": "var(--surface-container-high)",
          "container-highest": "var(--surface-container-highest)",
          variant: "var(--surface-variant)",
        },
        background: "var(--background)",
        "on-background": "var(--on-background)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        outline: "var(--outline)",
        "outline-variant": "var(--outline-variant)",
        primary: { DEFAULT: "var(--primary)", container: "var(--primary-container)" },
        "on-primary": "var(--on-primary)",
        "on-primary-container": "var(--on-primary-container)",
        secondary: { DEFAULT: "var(--secondary)", container: "var(--secondary-container)" },
        "on-secondary": "var(--on-secondary)",
        tertiary: "var(--tertiary)",
        "on-tertiary": "var(--on-tertiary)",
        error: { DEFAULT: "var(--error)", container: "var(--error-container)" },
        "on-error": "var(--on-error)",
        "on-error-container": "var(--on-error-container)",
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

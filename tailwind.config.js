/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    // Replace the default palette entirely. Only the tokens below exist.
    colors: {
      transparent: "transparent",
      current: "currentColor",
      paper: "#F4EDE0",
      "paper-2": "#EBE2D2",
      ink: "#1F1B16",
      "ink-2": "#5C5247",
      rule: "#C9BEA8",
      accent: "#9A2A1F",
      "accent-soft": "#C8A26B",
    },
    fontFamily: {
      serif: [
        '"Fraunces"',
        "ui-serif",
        "Georgia",
        "Cambria",
        '"Times New Roman"',
        "serif",
      ],
      sans: [
        '"Inter Tight"',
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "sans-serif",
      ],
      mono: [
        '"JetBrains Mono"',
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "monospace",
      ],
    },
    extend: {
      borderRadius: {
        none: "0",
        xs: "2px",
        sm: "3px",
        DEFAULT: "4px",
      },
      letterSpacing: {
        wider: "0.08em",
        widest: "0.18em",
      },
      fontSize: {
        // Smaller, editorial scale.
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      transitionTimingFunction: {
        ios: "cubic-bezier(0.32, 0.72, 0, 1)",
      },
    },
  },
  plugins: [],
  corePlugins: {
    boxShadow: false, // No drop shadows allowed in this app.
  },
};

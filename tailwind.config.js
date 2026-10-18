/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Base surfaces
        surface: "#f6fbf1",
        "surface-dim": "#d7dcd2",
        "surface-bright": "#f6fbf1",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f1f5eb",
        "surface-container": "#ebefe6",
        "surface-container-high": "#e5eae0",
        "surface-container-highest": "#dfe4da",
        "surface-variant": "#dfe4da",
        "surface-tint": "#326850",

        // Text & ink
        "on-surface": "#181d17",
        "on-surface-variant": "#404943",
        "inverse-surface": "#2d322b",
        "inverse-on-surface": "#eef2e8",
        outline: "#707973",
        "outline-variant": "#c0c9c1",

        // Primary brand (Deep forest green)
        primary: "#05432d",
        "on-primary": "#ffffff",
        "primary-container": "#245b43",
        "on-primary-container": "#98d1b2",
        "inverse-primary": "#9ad3b4",
        "primary-fixed": "#b5efd0",
        "primary-fixed-dim": "#9ad3b4",
        "on-primary-fixed": "#002114",
        "on-primary-fixed-variant": "#175039",

        // Secondary (Muted sage & neutral gray-green)
        secondary: "#59605a",
        "on-secondary": "#ffffff",
        "secondary-container": "#dde4dc",
        "on-secondary-container": "#5f6660",
        "secondary-fixed": "#dde4dc",
        "secondary-fixed-dim": "#c1c8c1",
        "on-secondary-fixed": "#161d18",
        "on-secondary-fixed-variant": "#414843",

        // Tertiary (Warm amber / civic urgency)
        tertiary: "#5b2f00",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#7c4300",
        "on-tertiary-container": "#ffb575",
        "tertiary-fixed": "#ffdcc2",
        "tertiary-fixed-dim": "#ffb77a",
        "on-tertiary-fixed": "#2e1500",
        "on-tertiary-fixed-variant": "#6d3a00",

        // Feedback & Milestones
        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",
        amplified: "#2F855A",
        pending: "#D9822B",
        restricted: "#C84C40",

        // Editorial tokens
        canvas: "#F8F8F3",
        "primary-ink": "#245B43",
        "containment-border": "#E2E7E0",
      },
      borderRadius: {
        sm: "0.25rem", // 4px
        DEFAULT: "0.5rem", // 8px
        md: "0.75rem", // 12px
        lg: "1rem", // 16px
        xl: "1.5rem", // 24px
        full: "9999px",
      },
      spacing: {
        "space-xs": "0.25rem", // 4px
        "space-sm": "0.5rem", // 8px
        "space-md": "1rem", // 16px
        "space-lg": "1.5rem", // 24px
        "space-xl": "2rem", // 32px
        gutter: "1rem",
        "gutter-sm": "0.75rem",
        "gutter-lg": "1.5rem",
        margin: "1.25rem", // 20px
        "margin-mobile": "1rem", // 16px
        "margin-desktop": "2.5rem",
      },
      fontFamily: {
        newsreader: ["Newsreader", "serif"],
        jakarta: ["PlusJakartaSans", "sans-serif"],
      },
    },
  },
  plugins: [],
};

import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1200px",
        "2xl": "1320px",
      },
    },
    extend: {
      colors: {
        ink: {
          50: "#f4f6f7",
          100: "#e4e9ec",
          200: "#c7d1d7",
          300: "#a1b0b9",
          400: "#748796",
          500: "#586c7c",
          600: "#475768",
          700: "#3b4856",
          800: "#293440",
          900: "#141a20",
          950: "#0a0d10",
        },
        brand: {
          50: "#eef6f5",
          100: "#d6e9e6",
          200: "#aed3cd",
          300: "#7fb8af",
          400: "#4c968b",
          500: "#2f7b70",
          600: "#22645b",
          700: "#1c514a",
          800: "#17403b",
          900: "#0f2b28",
        },
        sand: {
          50: "#faf8f4",
          100: "#f3ede1",
          200: "#e6d9c2",
          300: "#d8c4a0",
          600: "#8a6d3f",
          700: "#6e5630",
        },
        clay: {
          50: "#fbf3ee",
          100: "#f4ded0",
          200: "#e6b699",
          300: "#d38f68",
          400: "#bd6f45",
          500: "#a3572f",
          600: "#854524",
          700: "#67361e",
        },
        plum: {
          50: "#f6f1f4",
          100: "#e6d6e0",
          200: "#c9a8bd",
          300: "#a97998",
          400: "#8a5678",
          500: "#6f3f60",
          600: "#59324d",
          700: "#45273c",
        },
        moss: {
          50: "#f2f5ef",
          100: "#dee6d5",
          200: "#b9c8a7",
          300: "#93a97a",
          400: "#728a58",
          500: "#5a7043",
          600: "#485a35",
          700: "#39472a",
        },
        signal: {
          amber: "#b9791b",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.5rem, 4.5vw, 4.25rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.1rem, 3.4vw, 3.25rem)", { lineHeight: "1.08", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.7rem, 2.4vw, 2.375rem)", { lineHeight: "1.15", letterSpacing: "-0.01em" }],
      },
      maxWidth: {
        prose: "68ch",
      },
      boxShadow: {
        card: "0 1px 2px rgba(10,13,16,0.04), 0 8px 24px -12px rgba(10,13,16,0.12)",
        "card-hover": "0 4px 8px rgba(10,13,16,0.06), 0 16px 32px -12px rgba(10,13,16,0.16)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      transitionTimingFunction: {
        out: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-slide": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "ken-burns": {
          "0%": { transform: "scale(1)" },
          "100%": { transform: "scale(1.06)" },
        },
        "reveal-up": {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "count-blur-in": {
          "0%": { opacity: "0", filter: "blur(4px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        "hero-progress": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        "chat-pop": {
          "0%": { opacity: "0", transform: "translateY(12px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "msg-in": {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in-slide": "fade-in-slide 0.8s ease both",
        "ken-burns": "ken-burns 9s cubic-bezier(0.16,1,0.3,1) both",
        "reveal-up": "reveal-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "hero-progress": "hero-progress linear forwards",
        "chat-pop": "chat-pop 220ms cubic-bezier(0.16,1,0.3,1) both",
        "msg-in": "msg-in 200ms ease-out both",
      },
      transitionDuration: {
        350: "350ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};

export default config;

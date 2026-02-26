import type { Config } from "tailwindcss";
import taildind_safelist from "./tailwind_safelist";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: taildind_safelist,
  theme: {
    screens: {
      xxs: "360px",
      xs:  "480px",
      sm:  "640px",
      md:  "768px",
      lg:  "1024px",
      xl:  "1280px",
      "2xl": "1536px",
      "screen-width-900": "900px",
    },
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        /* ── Shadcn / Radix semantic tokens ──────────────────── */
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT:               "hsl(var(--sidebar-background))",
          foreground:            "hsl(var(--sidebar-foreground))",
          primary:               "hsl(var(--sidebar-primary))",
          "primary-foreground":  "hsl(var(--sidebar-primary-foreground))",
          accent:                "hsl(var(--sidebar-accent))",
          "accent-foreground":   "hsl(var(--sidebar-accent-foreground))",
          border:                "hsl(var(--sidebar-border))",
          ring:                  "hsl(var(--sidebar-ring))",
        },

        /* ── MAXXPAINN Design Tokens ─────────────────────────────
           Background scale — deep purple-tinted darks, each step
           visually distinct so layering is obvious on screen.

           bg0  #110818  page canvas           (darkest)
           bg1  #1a0f22  card / section base
           bg2  #22142e  elevated card / modal
           bg3  #2c1a3e  nav / tooltip surface
           bg4  #38224f  highest surface / popover  (lightest)
        ─────────────────────────────────────────────────────── */
        "maxx-bg0":      "#110818",
        "maxx-bg1":      "#1a0f22",
        "maxx-bg2":      "#22142e",
        "maxx-bg3":      "#2c1a3e",
        "maxx-bg4":      "#38224f",

        /* Pink (cerise) — CTAs, energy, pain */
        "maxx-pink":     "#ff2d78",
        "maxx-pinkDk":   "#c0003c",
        "maxx-pinkLt":   "#ff85ab",

        /* Violet — structure, labels, borders */
        "maxx-violet":   "#8b5cf6",
        "maxx-violetDk": "#5b21b6",
        "maxx-violetLt": "#c4b5fd",

        /* Text scale */
        "maxx-white":    "#fdf4ff",   /* near-white, purple-tinted   */
        "maxx-bright":   "#e2d9f3",   /* primary body copy           */
        "maxx-mid":      "#b89fd4",   /* secondary text              */
        "maxx-sub":      "#9d7fba",   /* muted / metadata            */
        "maxx-dim":      "#3d2b5c",   /* very dim — borders, ghosts  */
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      backgroundImage: {
        /* violet → pink diagonal — text clips, bar fills */
        "grad-accent": "linear-gradient(135deg, #8b5cf6 0%, #ff2d78 100%)",
        /* violetDk → purple → pink — filled buttons */
        "grad-btn":    "linear-gradient(135deg, #5b21b6 0%, #9333ea 45%, #ff2d78 100%)",
        /* subtle noise overlay */
        "noise-pattern": "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E\")",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(22px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "acc-open": {
          "0%":   { opacity: "0", transform: "translateY(-6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "neon-pulse": {
          "0%, 100%": { boxShadow: "0 0 2px rgba(139,92,246,0.6), 0 0 8px rgba(139,92,246,0.6)" },
          "50%":      { boxShadow: "0 0 5px rgba(139,92,246,0.6), 0 0 15px rgba(139,92,246,0.6)" },
        },
        "scroll-left": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",
        "fade-up":        "fade-up 0.65s ease both",
        "acc-open":       "acc-open 0.3s ease both",
        "pulse-slow":     "pulse 2s ease-in-out infinite",
        "neon-pulse":     "neon-pulse 2s ease-in-out infinite alternate",
        "scroll-left":    "scroll-left 30s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

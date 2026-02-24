import type { Config } from "tailwindcss";
import tailwindSafelist from "./tailwind_safelist";
import tailwindAnim from "tailwindcss-animate"

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  safelist: tailwindSafelist,
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
      /* ────────────────────────────────────────────────────────────
         COLORS
         Radix UI CSS-var tokens kept intact.
         MAXXPAINN brand palette added under `pain.*` namespace.
      ──────────────────────────────────────────────────────────── */
      colors: {
        /* Radix / shadcn tokens */
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

        /* ── MAXXPAINN brand palette ── */
        pain: {
          /* Page backgrounds — deep near-black purples */
          bg:      "#0d080c",   // base bg
          bg1:     "#120a10",   // section alt 1
          bg2:     "#0f0810",   // section alt 2

          /* Cerise / Pink — energy, CTAs, hero moments */
          pink:    "#ff2d78",
          "pink-dk": "#c0003c",
          "pink-lt": "#ff85ab",

          /* Violet — structure, nav, labels */
          violet:    "#8b5cf6",
          "violet-dk": "#5b21b6",
          "violet-lt": "#c4b5fd",

          /* Text scale */
          white:   "#fdf4ff",
          bright:  "#e2d9f3",
          mid:     "#b89fd4",
          sub:     "#9d7fba",
          dim:     "#3d2b5c",

          /* Borders (semi-transparent) — use with bg-[…] or border-[…] */
          border:       "rgba(139,92,246,0.15)",
          "border-hov": "rgba(255,45,120,0.5)",
          "border-warm":"rgba(139,92,246,0.25)",

          /* Card surfaces */
          card:        "rgba(139,92,246,0.05)",
          "card-hov":  "rgba(255,45,120,0.07)",
        },
      },

      /* ────────────────────────────────────────────────────────────
         FONTS
      ──────────────────────────────────────────────────────────── */
      fontFamily: {
        sans:    ["DM Sans", "sans-serif"],
        mono:    ["JetBrains Mono", "monospace"],
        display: ["DM Sans", "sans-serif"],
      },

      /* ────────────────────────────────────────────────────────────
         BORDER RADIUS  (Radix tokens kept)
      ──────────────────────────────────────────────────────────── */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        /* Brand radii */
        "maxx-card": "4px",
        "maxx-btn":  "2px",
      },

      /* ────────────────────────────────────────────────────────────
         BACKGROUND GRADIENTS
         Exposed as utilities via backgroundImage so they're
         available as  bg-maxx-accent, bg-maxx-btn, etc.
      ──────────────────────────────────────────────────────────── */
      backgroundImage: {
        "maxx-accent":  "linear-gradient(135deg, #8b5cf6 0%, #ff2d78 100%)",
        "maxx-btn":     "linear-gradient(135deg, #5b21b6 0%, #9333ea 45%, #ff2d78 100%)",
        "maxx-radial-pink":   "radial-gradient(circle, rgba(255,45,120,0.08) 0%, transparent 65%)",
        "maxx-radial-violet": "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
        "maxx-gridline":      "linear-gradient(to bottom, transparent, rgba(139,92,246,0.06), transparent)",
        /* Gradient text helpers */
        "maxx-text-grad": "linear-gradient(135deg, #ff0040, #8b5cf6, #06b6d4, #10b981, #f59e0b)",
      },

      /* ────────────────────────────────────────────────────────────
         BOX SHADOWS
      ──────────────────────────────────────────────────────────── */
      boxShadow: {
        "maxx-card":    "0 8px 32px rgba(255,45,120,0.08)",
        "maxx-card-lg": "0 8px 40px rgba(139,92,246,0.10)",
        "maxx-neon":    "0 0 8px rgba(139,92,246,0.6), 0 0 16px rgba(139,92,246,0.4)",
      },

      /* ────────────────────────────────────────────────────────────
         KEYFRAMES & ANIMATIONS
         Radix accordion kept + all MAXXPAINN animations added.
      ──────────────────────────────────────────────────────────── */
      keyframes: {
        /* Radix / shadcn */
        "accordion-down": {
          from: { height: "0" },
          to:   { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to:   { height: "0" },
        },

        /* MAXXPAINN */
        "maxx-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.3" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(22px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "acc-open": {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "neon-pulse": {
          "0%, 100%": {
            boxShadow:
              "0 0 2px rgba(139,92,246,0.6), 0 0 4px rgba(139,92,246,0.6), 0 0 8px rgba(139,92,246,0.6)",
          },
          "50%": {
            boxShadow:
              "0 0 5px rgba(139,92,246,0.6), 0 0 10px rgba(139,92,246,0.6), 0 0 15px rgba(139,92,246,0.6)",
          },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%":       { transform: "translateY(-10px) rotate(1deg)" },
          "66%":       { transform: "translateY(-5px) rotate(-1deg)" },
        },
        glitch: {
          "0%":   { transform: "translateX(0)",        filter: "hue-rotate(0deg)"   },
          "10%":  { transform: "translateX(-2px) skewX(1deg)",  filter: "hue-rotate(90deg)"  },
          "20%":  { transform: "translateX(2px) skewX(-1deg)",  filter: "hue-rotate(180deg)" },
          "30%":  { transform: "translateX(-2px) skewX(1deg)",  filter: "hue-rotate(270deg)" },
          "40%":  { transform: "translateX(2px) skewX(-1deg)",  filter: "hue-rotate(360deg)" },
          "50%":  { transform: "translateX(-1px) skewX(0.5deg)",filter: "hue-rotate(45deg)"  },
          "60%":  { transform: "translateX(1px) skewX(-0.5deg)",filter: "hue-rotate(135deg)" },
          "70%":  { transform: "translateX(-1px) skewX(0.5deg)",filter: "hue-rotate(225deg)" },
          "80%":  { transform: "translateX(1px) skewX(-0.5deg)",filter: "hue-rotate(315deg)" },
          "90%":  { transform: "translateX(-0.5px)",              filter: "hue-rotate(180deg)" },
          "100%": { transform: "translateX(0)",                   filter: "hue-rotate(0deg)"  },
        },
        "blood-drip": {
          "0%":   { transform: "translateY(-10px)", opacity: "0" },
          "20%":  { opacity: "1" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
        "rage-shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%":       { transform: "translateX(-1px) rotate(-0.5deg)" },
          "75%":       { transform: "translateX(1px) rotate(0.5deg)" },
        },
        shine: {
          "0%":   { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "25%":       { backgroundPosition: "100% 50%" },
          "50%":       { backgroundPosition: "100% 100%" },
          "75%":       { backgroundPosition: "0% 100%" },
        },
        "scroll-left": {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        "ping-slow": {
          "0%":   { transform: "scale(1)", opacity: "0.75" },
          "100%": { transform: "scale(1.5)", opacity: "0" },
        },
      },

      animation: {
        /* Radix */
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up":   "accordion-up 0.2s ease-out",

        /* MAXXPAINN */
        "maxx-pulse":    "maxx-pulse 2s ease-in-out infinite",
        "fade-up":       "fade-up 0.65s ease both",
        "fade-up-1":     "fade-up 0.65s ease 0.12s both",
        "fade-up-2":     "fade-up 0.65s ease 0.24s both",
        "fade-up-3":     "fade-up 0.65s ease 0.36s both",
        "acc-open":      "acc-open 0.3s ease both",
        "neon-pulse":    "neon-pulse 2s ease-in-out infinite alternate",
        "float":         "float 4s ease-in-out infinite",
        "glitch":        "glitch 0.5s ease-in-out",
        "rage-shake":    "rage-shake 0.1s ease-in-out infinite",
        "shine":         "shine 3s ease-in-out infinite",
        "gradient-shift":"gradient-shift 4s ease infinite",
        "scroll-left":   "scroll-left 30s linear infinite",
        "fade-in-up":    "fade-in-up 0.6s ease-out forwards",
        "ping-slow":     "ping-slow 2s cubic-bezier(0,0,0.2,1) infinite",
        "blood-drip":    "blood-drip 3s ease-in infinite",
      },

      /* ────────────────────────────────────────────────────────────
         TYPOGRAPHY SIZES  (clamp-based fluid sizes for headings)
      ──────────────────────────────────────────────────────────── */
      fontSize: {
        "maxx-hero":    ["clamp(3rem,11vw,9rem)",   { lineHeight: "0.94", letterSpacing: "-0.025em" }],
        "maxx-h2":      ["clamp(2.6rem,6.5vw,5rem)",{ lineHeight: "0.94" }],
        "maxx-h3":      ["clamp(1.5rem,3.5vw,2.4rem)", { lineHeight: "1.1" }],
        "maxx-eyebrow": ["0.7rem",  { letterSpacing: "0.14em" }],
        "maxx-mono-xs": ["0.68rem", { letterSpacing: "0.1em" }],
        "maxx-mono-sm": ["0.72rem", { letterSpacing: "0.1em" }],
      },
    },
  },
  plugins: [tailwindAnim],
} satisfies Config;

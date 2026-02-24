import type { Config } from "tailwindcss";
import taildwinSafelist from "./tailwind_safelist";
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
	safelist: taildwinSafelist,
	theme: {

		screens: {
			xxs: '360px',
			xs:  '480px',   // 👈 new breakpoint
			sm:  '640px',
			md:  '768px',
			lg:  '1024px',
			xl:  '1280px',
			'2xl': '1536px',

			// custom
			// sw = screen-width
			'screen-width-900': "900px",
		},

		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
    extend: {
      colors: {
        mp: {
          bg0: "#0d080c",
          bg1: "#120a10",
          bg2: "#0f0810",
          bg3: "#120a10",
          bg4: "#0d080c",
          pink: "#ff2d78",
          pinkDk: "#c0003c",
          pinkLt: "#ff85ab",
          violet: "#8b5cf6",      // Same as violet-500
          violetDk: "#5b21b6",    // Same as violet-800
          violetLt: "#c4b5fd",    // Same as violet-300
          white: "#fdf4ff",       // Same as fuchsia-50
          bright: "#e2d9f3",
          mid: "#b89fd4",
          sub: "#9d7fba",
          dim: "#3d2b5c",
          border: "rgba(139, 92, 246, 0.15)",
          borderHov: "rgba(255, 45, 120, 0.5)",
          borderWarm: "rgba(139, 92, 246, 0.25)",
          card: "rgba(139, 92, 246, 0.05)",
          cardHov: "rgba(255, 45, 120, 0.07)",
        },
      }, //end colors
      
      fontFamily: {
        sans: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      
      backgroundImage: {
        "grad-accent": "linear-gradient(135deg, #8b5cf6 0%, #ff2d78 100%)",
        "grad-btn": "linear-gradient(135deg, #5b21b6 0%, #9333ea 45%, #ff2d78 100%)",
      },
      
      animation: {
        pulse: "pulse 2s ease-in-out infinite",
        fadeUp: "fadeUp 0.65s ease both",
        accOpen: "accOpen 0.3s ease both",
      },
      
      keyframes: {
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(22px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        accOpen: {
          from: { opacity: "0", transform: "translateY(-6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      } //end extend 
    }
	},

	plugins: [tailwindAnim],
} satisfies Config;

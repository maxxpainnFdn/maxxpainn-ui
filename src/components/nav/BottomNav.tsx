/**
 * MAXXPAINN — Bottom Navigation Bar
 *
 * Uses btn-maxx-primary / btn-maxx-secondary from globals.css.
 * Tailwind for all layout, color, spacing.
 * One unavoidable inline style: clip-path (no Tailwind utility).
 */

import { Link } from "react-router-dom";
import Account from "./Account";
import app from "@/config/app";
import { Zap, ShoppingCart, Library, Scroll } from "lucide-react";
import Button from "../button/Button";
import { tokenConfig } from "@/config/token";

const CLIP_SM = { clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 100%, 6px 100%)" };
const CLIP_LG = { clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 100%, 8px 100%)" };

export default function BottomNav() {
  return (
    <div className="bottom-nav w-full fixed z-20 bottom-0 left-0 right-0 pb-safe">

      {/* top accent rule — violet → cerise */}
      <div className="h-px w-full bg-gradient-to-r from-violet-600/60 via-pink-500/60 to-transparent" />

      {/* bar — C.bg0 equivalent */}
      <div className="w-full bg-[#0d080c]/[.97] backdrop-blur-xl">
        <div className="w-full px-3 py-3">
          <div className="flex items-center gap-2 w-full">

            {/* ── BUY ─────────────────────────────────────── */}
            <Link to="/posts" className="flex-1">
              <Button
                variant="secondary"
                className="w-full h-12 justify-center"
                skewed
              >
                <span className='hidden sm:inline'><Scroll size={14} /></span>
                <span>Stories</span>
              </Button>
            </Link>

            {/* ── MINT ────────────────────────────────────── */}
            <Link to="/mint" className="flex-[2]">
              <Button
                variant="primary"
                skewed
                className="w-full h-12 justify-center text-[0.9rem]"
              >
                <span className='hidden sm:inline'><Zap size={15} fill="currentColor" /></span>
                <span>Claim {" "}<span>${ tokenConfig.symbol }</span></span>
              </Button>
            </Link>

            {/* ── CONNECT / Account ───────────────────────── */}
            <div className="flex-1">
              <Account btnProps={{ fullWidth: true, skewed: true }} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

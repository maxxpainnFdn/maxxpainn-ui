import { ClanData } from "@/types/ClanData";
import { Users, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageAvatar from "@/components/ImageAvatar";
import utils from "@/lib/utils";
import { memo, useState, useRef, useCallback, useEffect } from "react";
import JoinClanBtn from "@/components/joinClanBtn/JoinClanBtn";
import Button from "@/components/button/Button";
import tinycolor from "tinycolor2";

/* ── Inject once ─────────────────────────────────────────────── */
let _ccInjected = false;
function injectCardStyles() {
  if (_ccInjected || typeof document === "undefined") return;
  _ccInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    /* staggered entrance */
    @keyframes _cc-enter {
      from { opacity: 0; transform: translateY(24px) scale(0.96); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* shimmer sweep on image */
    @keyframes _cc-shimmer {
      to { transform: translateX(200%) skewX(-12deg); }
    }
    ._cc-shim {
      position: absolute; inset: 0;
      overflow: hidden; pointer-events: none; z-index: 2;
    }
    ._cc-shim::after {
      content: '';
      position: absolute; inset: -50% 0;
      transform: translateX(-100%) skewX(-12deg);
      background: linear-gradient(
        90deg,
        transparent 20%,
        rgba(255,255,255,0.04) 38%,
        rgba(255,255,255,0.13) 50%,
        rgba(255,255,255,0.04) 62%,
        transparent 80%
      );
    }
    .group:hover ._cc-shim::after {
      animation: _cc-shimmer 0.8s ease forwards;
    }

    /* stats glow on hover */
    ._cc-stats { transition: all 0.3s ease; }
    .group:hover ._cc-stats {
      border-color: rgba(139,92,246,0.2);
      background: rgba(139,92,246,0.05);
    }
  `;
  document.head.appendChild(s);
}

/* ── Types ───────────────────────────────────────────────────── */
export interface ClanCardProps {
  clan: ClanData;
  onItemClick?: ((clan: ClanData) => void) | null;
  showJoinBtn?: boolean;
  showSelectBtn?: boolean;
  index?: number; // stagger delay
}

/* ── Component ───────────────────────────────────────────────── */
const ClanCard = memo(
  ({
    clan: _clan,
    onItemClick = null,
    showJoinBtn = true,
    showSelectBtn = false,
    index = 0,
  }: ClanCardProps) => {
    const navigate = useNavigate();
    const cardRef = useRef<HTMLDivElement>(null);
    const [clan, setClan] = useState(_clan);
    const [isMember, setIsMember] = useState(_clan.isMember);

    useEffect(injectCardStyles, []);

    const accentColor1 = clan.accentColor[0];
    const accentColor2 = clan.accentColor[1];
    const clanUrl = `/clans/${clan.slug}-${clan.id}`;

    const ac1Dark = tinycolor(accentColor1).darken(20).toString();
    const ac2Dark = tinycolor(accentColor2).darken(20).toString();
    const ac1Dim = tinycolor(accentColor1).setAlpha(0.14).toRgbString();

    /* ── 3-D tilt + cursor spotlight (zero re-renders) ── */
    const onMove = useCallback((e: React.MouseEvent) => {
      const el = cardRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;

      // spotlight position
      el.style.setProperty("--_cx", `${px * 100}%`);
      el.style.setProperty("--_cy", `${py * 100}%`);

      // tilt — instant (no transition on transform during move)
      const tiltX = (py - 0.5) * -6;
      const tiltY = (px - 0.5) * 6;
      el.style.transition = "box-shadow 0.3s, border-color 0.3s";
      el.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
    }, []);

    const onLeave = useCallback(() => {
      const el = cardRef.current;
      if (!el) return;
      el.style.transition = "all 0.45s cubic-bezier(.17,.67,.35,1.2)";
      el.style.transform = "";
    }, []);

    /* ── Click ── */
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (onItemClick) {
        onItemClick(clan);
        return;
      }
      if ((e.target as HTMLElement).classList.contains("join-leave-btn")) return;
      navigate(clanUrl);
    };

    const joinBtnStyle = {
      background: `linear-gradient(135deg, ${ac1Dark}, ${ac2Dark})`,
      boxShadow: `0 4px 14px ${accentColor1}40`,
    };

    return (
      <a
        href={clanUrl}
        onClick={handleClick}
        className="block group w-[240px] relative no-underline"
        style={{
          animation: "_cc-enter 0.5s ease both",
          animationDelay: `${Math.min(index * 50, 600)}ms`,
        }}
      >
        <div
          ref={cardRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          className="
            group
            relative rounded-xl overflow-hidden will-change-transform
            bg-white/[0.02] border border-white/[0.06]
            shadow-lg shadow-black/10
            hover:border-white/[0.14]
            hover:shadow-2xl hover:shadow-purple-500/10
          "
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* ── Cursor-tracking accent spotlight ── */}
          <div
            className="absolute inset-0 z-[1] rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(
                200px circle at var(--_cx, 50%) var(--_cy, 50%),
                ${ac1Dim}, transparent
              )`,
            }}
            aria-hidden
          />

          {/* ── Top accent line ── */}
          <div
            className="absolute top-0 inset-x-0 h-[2px] z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor1}, ${accentColor2}, transparent)`,
            }}
            aria-hidden
          />

          {/* ── Image ── */}
          <div className="relative h-[200px] overflow-hidden">
            <div className="w-full h-full transition-transform duration-[600ms] ease-out group-hover:scale-[1.06]">
              <ImageAvatar
                src={utils.getServerImage(clan.image, "clans", "normal")}
                fallbackText={clan.name}
                className="w-full h-full object-cover text-6xl font-black rounded-none"
                fallbackTextClass="bg-maxx-bg/50 text-maxx-white rounded-none"
              />
            </div>

            {/* shimmer sweep */}
            <div className="_cc-shim" aria-hidden />

            {/* bottom fade for legibility */}
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/50 via-black/15 to-transparent pointer-events-none" />

            {/* accent bar */}
            <div
              className="absolute bottom-0 inset-x-0 h-[2px] opacity-60 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: `linear-gradient(90deg, transparent, ${accentColor1}, ${accentColor2}, transparent)`,
              }}
              aria-hidden
            />
          </div>

          {/* ── Content ── */}
          <div className="relative z-[2] p-4 pb-3">
            <h3 className="font-black text-lg text-white/85 tracking-tight truncate mb-0.5 group-hover:text-white transition-colors duration-300">
              {clan.name}
            </h3>
            <p className="text-sm text-white/70 truncate mb-4 font-medium">
              {clan.tagline || "Join this clan today!"}
            </p>

            {/* stats */}
            <div className="_cc-stats flex items-center justify-evenly h-10 mb-4 bg-white/[0.025] border border-white/[0.06] rounded-lg">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-violet-400" />
                <span className="text-sm font-bold text-white/75">
                  {clan.totalMembers.toLocaleString()}
                </span>
              </div>
              <div className="w-px h-5 bg-white/[0.07]" />
              <div className="flex items-center gap-1.5">
                <Gem className="w-4 h-4 text-pink-400" />
                <span className="font-mono text-sm font-bold text-white/75">
                  {clan.totalMints.toLocaleString()}
                </span>
              </div>
            </div>

            {showJoinBtn && (
              <JoinClanBtn
                clanId={clan.id}
                clanName={clan.name}
                isMember={isMember}
                onSuccess={(newClan: ClanData) => {
                  setClan(newClan);
                  setIsMember(newClan.isMember);
                }}
                size="sm"
                className="join-leave-btn w-full h-[40px] rounded-lg text-white font-semibold border-0 hover:shadow-xl transition-shadow"
                style={joinBtnStyle}
              >
                Join Clan
              </JoinClanBtn>
            )}

            {showSelectBtn && (
              <Button variant="primary" fullWidth className="text-xs">
                Select Clan
              </Button>
            )}
          </div>
        </div>
      </a>
    );
  }
);

export default ClanCard;

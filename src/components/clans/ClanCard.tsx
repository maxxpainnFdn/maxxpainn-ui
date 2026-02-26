/**
 * MAXXPAINN — ClanCard
 *
 * Design system: maxx-* tokens, eyebrow / pill / btn-p / btn-s classes.
 * No raw Tailwind color names. No hex codes in JSX.
 *
 * Note: accentColor props from the API are dynamic hex values and are
 * only used for the single decorative gradient-bar element — unavoidable
 * since they're runtime data. All structural chrome uses maxx-* tokens.
 */

import { ClanData } from "@/types/ClanData";
import { Users, Gem } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImageAvatar from "@/components/ImageAvatar";
import utils from "@/lib/utils";
import { memo, useState } from "react";
import JoinClanBtn from "@/components/joinClanBtn/JoinClanBtn";
import Button from "@/components/button/Button";

export interface ClanCardProps {
  clan: ClanData;
  onItemClick?: (clan: ClanData) => void;
  showJoinBtn?: boolean;
  showSelectBtn?: boolean;
}

const ClanCard = memo(({
  clan: _clan,
  onItemClick = null,
  showJoinBtn = true,
  showSelectBtn = false,
}: ClanCardProps) => {
  const navigate  = useNavigate();
  const [clan, setClan]       = useState(_clan);
  const [isMember, setIsMemeber] = useState(_clan.isMember);

  const accentColor1 = clan.accentColor[0];
  const accentColor2 = clan.accentColor[1];
  const clanUrl      = `/clans/${clan.slug}-${clan.id}`;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onItemClick) { onItemClick(clan); return; }
    const cl = (e.target as HTMLElement).classList;
    if (cl.contains("join-leave-btn")) return;
    navigate(clanUrl);
  };
  
  const joinSelectBtnClass = "w-full h-[40px] rounded-lg text-white bg-purple-700 hover:bg-purple-600 font-semibold hover:shadow-xl border-0"
  const joinSelectBtnStyle = {
      background: `linear-gradient(135deg, ${accentColor1}, ${accentColor2})`,
      boxShadow: `0 4px 14px ${accentColor1}40`
  }

  return (
    <a
      href={clanUrl}
      onClick={handleClick}
      className="block group w-[240px] relative no-underline"
    >
      {/* card */}
      <div className="relative bg-[rgba(255,255,255,0.03)] border rounded-lg  overflow-hidden border-maxx-violet/10 hover:border-maxx-violet/30 shadow shadow-maxx-violet/10 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">

        {/* top accent — gradient on hover */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />

        {/* image */}
        <div className="relative h-[200px] overflow-hidden rounded-none">
          <ImageAvatar
            src={utils.getServerImage(clan.image, "clans", "normal")}
            fallbackText={clan.name}
            className="w-full h-full object-cover text-6xl font-black rounded-none"
            fallbackTextClass="bg-maxx-bg/50 text-maxx-white rounded-none"
          />

          {/* dynamic accent bar from API data — only inline style in this component */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] opacity-80"
            style={{ background: `linear-gradient(90deg, transparent, ${accentColor1}, ${accentColor2}, transparent)` }}
          />

          {/* subtle dark overlay at bottom for legibility */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-maxx-bg1/80 to-transparent" />
        </div>

        {/* content */}
        <div className="p-4 pb-3">

          {/* name + tagline */}
          <h3 className="font-black text-base text-maxx-white tracking-tight truncate mb-1">
            {clan.name}
          </h3>
          <p className="text-sm text-maxx-sub truncate mb-4 leading-relaxed">
            {clan.tagline || "Join this clan today!"}
          </p>

          {/* stats row */}
          <div className="flex items-center justify-evenly h-10 mb-4 bg-maxx-bg0/60 border border-maxx-violet/15 rounded-md">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-violet-400" />
              <span className="font-mono text-sm font-bold text-maxx-bright">
                {clan.totalMembers.toLocaleString()}
              </span>
            </div>
            <div className="w-px h-5 bg-maxx-violet/15" />
            <div className="flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-pink-500" />
              <span className="font-mono text-sm font-bold text-maxx-bright">
                {clan.totalMints.toLocaleString()}
              </span>
            </div>
          </div>

          {/* join / select button */}
          {showJoinBtn && (
            <JoinClanBtn 
              clanId={clan.id}
              clanName={clan.name}
              isMember={ isMember }
              onSuccess={ (newClan) => {
                setClan(newClan)
                setIsMemeber(newClan.isMember) 
              }}
              size="sm"
              className={`join-leave-btn rounded-lg ${joinSelectBtnClass}`}
              style={joinSelectBtnStyle}
            >
              Join Clan
            </JoinClanBtn>
          )}

          {showSelectBtn && (
            <Button variant="primary" skewed fullWidth className="text-xs">
              Select Clan
            </Button>
          )}
        </div>
      </div>
    </a>
  );
});

export default ClanCard;

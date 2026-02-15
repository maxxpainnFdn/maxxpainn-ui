import { ClanData } from "@/types/ClanData";
import { Coins, Diamond, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import ImageAvatar from "../ImageAvatar";
import utils from "@/lib/utils";
import { memo, useState } from "react";
import JoinClanBtn from "../joinClanBtn/JoinClanBtn";

export interface ClanCardProps {
    clan: ClanData;
    onItemClick?: (clan: ClanData) => void,
    showJoinBtn?: boolean;
    showSelectBtn?: boolean; 
}

const ClanCard = memo(({ 
    clan: _clan, 
    onItemClick = null,
    showJoinBtn = true,
    showSelectBtn = false
}: ClanCardProps) => {

    const navigate = useNavigate()
  
    const [clan, setClan] = useState(_clan)
   
    const accentColor1 = clan.accentColor[0];
    const accentColor2 = clan.accentColor[1];

    const clanUrl = `/clans/${clan.slug}-${clan.id}`

    const [isMember, setIsMemeber] = useState(clan.isMember)

    const handleOnclick = (e: any) => {
        
        e.preventDefault();

        const cl = e.target.classList;

        if(onItemClick){
            onItemClick(clan)
            return;
        }

        if(cl.contains("join-leave-btn")){
            return false;
        }

        navigate(clanUrl)
    }

    const joinSelectBtnClass = "w-full h-[40px] rounded-xl text-white font-semibold hover:shadow-xl border-0"
    const joinSelectBtnStyle = {
        background: `linear-gradient(135deg, ${accentColor1}, ${accentColor2})`,
        boxShadow: `0 4px 14px ${accentColor1}40`
    }

    return (
        <a  href={clanUrl}  
          className="block group w-[240px] relative"
          onClick={handleOnclick}
        >
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-[120px] w-[240px] h-[240px] blur-3xl opacity-40 pointer-events-none group-hover:opacity-70 transition-opacity duration-500"
              style={{
              background: `radial-gradient(circle, ${accentColor1}, transparent 70%)`
              }}
            />
        
            <div 
                className="relative bg-gray-900/80 backdrop-blur-sm border-2 border-purple-400/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-purple-500/20 hover:transform hover:translate-y-[-4px] transition-all duration-300"
            >
                {/* Image Section */}
                <div className="relative h-[240px] overflow-hidden">
                    <div 
                        className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-6xl font-black"
                    >
                        <ImageAvatar
                            src={utils.getServerImage(clan.image, "clans", "normal")}
                            fallbackText={clan.name}
                            className="w-full h-full object-cover text-7xl font-bold rounded-none"
                            fallbackTextClass="bg-none" 
                        />
                        
                </div>
                
                {/* Bottom gradient border */}
                <div 
                    className="absolute bottom-0 left-0 right-0 h-1 opacity-90"
                    style={{
                        background: `linear-gradient(90deg, transparent, ${accentColor1}, ${accentColor2}, transparent)`
                    }}
                />
            </div>
            
            {/* Content */}
            <div className="relative p-5 pb-3">
                <h3 className="text-xl font-bold text-white mb-2 truncate">
                    {clan.name}
                </h3>
                <p className="text-sm text-gray-400 mb-4 p-0 truncate">
                    {clan.tagline || "Join this clan today!"}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-evenly text-sm mb-5 px-4 h-[40px] rounded-xl bg-black/40 backdrop-blur-sm border"
                    style={{ borderColor: `${accentColor1}40` }}
                >
                    <div className="flex items-center gap-1">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor1}30` }}>
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-sm text-white">{clan.totalMembers.toLocaleString()}</span>
                    </div>
                    <div className="w-px h-6 bg-gray-700" />
                    <div className="flex items-center justify-center gap-1">
                        <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${accentColor1}30` }}>
                            <Diamond className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-medium text-xsm text-white">{clan.totalMints}</span>
                    </div>
                </div>
                
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
                        className={`join-leave-btn ${joinSelectBtnClass}`}
                        style={joinSelectBtnStyle}
                    >
                        Join Clan
                    </JoinClanBtn>
                )}

                {showSelectBtn && (
                    <Button
                        className={joinSelectBtnClass}
                        style={joinSelectBtnStyle}
                    >
                        Select Clan
                    </Button>
                )}
            </div>
        </div>
    </a>
  );
});

export default ClanCard;

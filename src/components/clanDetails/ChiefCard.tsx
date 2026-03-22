import { IAccount } from "@/types/IAccount";
import { Card, CardContent } from "../ui/card";
import {  Crown } from "lucide-react";
import { Badge } from "../ui/badge";
import ImageAvatar from "../ImageAvatar";
import { Link } from "react-router-dom";
import utils from "@/lib/utils";

export default function ChiefCard({ accountInfo, accentColor }: { accountInfo: IAccount, accentColor: string }) {

    //console.log("accountInfo===>", accountInfo)

    return (
      <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${accentColor}, transparent 70%)`
          }}
        />
        <CardContent className="p-8 relative">
          <div className="flex items-center gap-2 mb-6 justify-center">
            <Crown className="h-5 w-5" style={{ color: accentColor }} />
            <h2 className="text-2xl font-black">Clan Chief</h2>
          </div>
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div 
                className="absolute inset-0 blur-2xl opacity-40"
                style={{ backgroundColor: accentColor }}
              />
      
            <ImageAvatar 
              className="relative h-32 w-32 mx-auto border-4 shadow-2xl" 
              style={{ borderColor: accentColor }}
              src={utils.getServerImage(accountInfo.photo, "profile/photo", "normal")}
              alt="Creator"
              seed={accountInfo.address}
            />
          </div>
          <Link to={`/profile/@${accountInfo.username}`} target="_blank">
            <h3 className="text-md sm:text-lg font-semibold mb-1 text-ellipsis">@{ accountInfo.username }</h3>
          </Link>
          <Badge 
            className="mb-2 text-xs font-semibold px-4 py-1" 
            style={{ 
                backgroundColor: `color-mix(in srgb, ${accentColor}, black 60%)`,
                color: 'rgba(255, 255, 255, 0.95)'
            }}
          >
            #{accountInfo.rank} Rank
          </Badge>
        
        </div>
      </CardContent>
    </Card>
  )
}

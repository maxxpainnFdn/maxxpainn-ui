import { Crown } from "lucide-react"
import ImageAvatar from "../ImageAvatar"
import { Card, CardContent } from "../ui/card"
import utils from "@/lib/utils"
import ApiQuery from "../apiQuery/ApiQuery"
import { useState } from "react"

export default function ClanMembers({ clanId, accentColor = "" }, { clanId: number, accentColor: string }) {

    const [members, setMembers] = useState([])

  const onQuerySuccess = (dataArr) => {
    console.log(dataArr)
    setMembers(dataArr)
  }

  return (
    <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
      <CardContent className="p-6">
        <h2 className="text-2xl font-black mb-6">Members</h2>
        <div className="space-y-3">
            <ApiQuery
              uri={`/clans/${clanId}/members`}
              errorProps={{ className: "!scale-70", titleClassName: "font-medium !text-2xl" }}
              onSuccess={onQuerySuccess}
              key={clanId}
              pagingType="simple"
            >   
                <>
                    {(members || []).map((member, index) => {
                        
                        const {mintCount, photo, username, address } = member.account;
                        
                        return (
                            <a href={`/profile/${member.account.username}`}
                                key={index}
                                className="flex items-center gap-3 p-3 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/30 hover:bg-background/60 hover:border-primary/30 transition-all duration-300 group"
                            >
                                <div className="relative">
                                    <ImageAvatar
                                        seed={address}
                                        className="h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-colors"
                                        src={utils.getServerImage(photo, "profile", "tiny")}
                                        alt=""
                                    />
            
                                    {member.role != "member" &&
                                        <div className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold"
                                            style={{ color: accentColor }}
                                        >
                                            <Crown size={18} />
                                        </div>
                                    }
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-semibold truncate text-ellipsis">@{username}</div>
                                    <div className="text-xs text-muted-foreground">{member.role}</div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold">{utils.toShortNumber(mintCount || 0)}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Mint{ mintCount == 1 ? "" : "s"}
                                    </div>
                                </div>
                            </a>
                        )
                    })}
                </>
            </ApiQuery>
          </div>
      </CardContent>
    </Card>
  )
  
}

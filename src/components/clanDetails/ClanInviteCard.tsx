import { Card, CardContent } from "../ui/card";
import { CopyBtn } from "../copyBtn/CopyBtn";
import { Share } from "lucide-react";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import { AccountData } from "@/types/AccountData";
import useAuth from "@/hooks/useAuth";

export default function ClanInviteCard({ clanSlug, clanId, accentColor }) {
  
  const auth = useAuth()
  const userAcctInfo = useAtomValue<AccountData | null>(userAccountInfoAtom)
  const [inviteUrl, setInviteUrl] = useState("")
  
  useEffect(() => {
    auth.getUserAccountInfo()
  })
  
  useEffect(() => {
    let url = `${location.origin}/r/c-${clanId}`
    if(userAcctInfo) url += `/a-${userAcctInfo.id}`
    setInviteUrl(url)
  }, [userAcctInfo])
    
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border-2 shadow-xl mb-6"
      style={{ borderColor: `${accentColor}40` }}
    >
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          background: `radial-gradient(circle at 80% 50%, ${accentColor}, transparent 70%)`
        }}
      />
      <CardContent className="p-6 relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}20` }}>
            <Share className="h-6 w-6" style={{ color: accentColor }} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Share Clan Invite</h3>
            <p className="text-sm text-muted-foreground">Invite others to join clan</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 font-mono text-sm overflow-x-auto">
            {inviteUrl}
          </div>
          <CopyBtn
            textToCopy={inviteUrl}
            size="lg"
            style={{  
              background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 10px 30px ${accentColor}40` 
            }}
            className="px-6 py-6 font-bold transition-all duration-300 hover:scale-105"
          />       
        </div>
      </CardContent>
    </Card>  
  )
}

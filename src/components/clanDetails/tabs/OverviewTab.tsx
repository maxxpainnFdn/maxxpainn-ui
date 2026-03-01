import { Card, CardContent } from "@/components/ui/card";
import ClanActivities from "../ClanActivities";
import ClanInviteCard from "../ClanInviteCard";
import ClanMembers from "../ClanMembers";
import ChiefCard from "../ChiefCard";
import ClanStats from "../ClanStats";

export default function OverviewTab({ clan }) {
  
  return (
    <>
      <ClanStats
        data={{
          totalMembers: clan.totalMembers,
          totalEarned: clan.totalEarnedUsd || 0,
          totalMints: clan.totalMints || 0,
          rewardPerMint: clan.rewardPerMintUsd || 0
        }}
      />
      
      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Leader & Members */}
        <div className="lg:col-span-1 space-y-8">

          <ChiefCard
            accountInfo={clan.creator}
            accentColor={ clan.accentColor1 }
          />
          
        </div>

        {/* Right Column - About & Activity */}
        <div className="lg:col-span-2 space-y-8">

          {/** invite card */}
          <ClanInviteCard
            clanId={clan.id}
            clanSlug={clan.slug}
            accentColor={ clan.accentColor1 }
          />

          {/* About Section */}
          <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-3xl font-black mb-6">About the Clan</h2>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {clan.description}
              </p>
            </CardContent>
          </Card>

          <ClanActivities clanId={clan.id} />
        </div>

      {/** end Grid */}
      </div>
    </>
  )
}

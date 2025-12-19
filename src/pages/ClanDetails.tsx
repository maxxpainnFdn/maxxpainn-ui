import ChiefCard from "@/components/clanDetails/ChiefCard";
import ClanInviteCard from "@/components/clanDetails/ClanInviteCard";
import ClanSocials from "@/components/clanDetails/ClanSocials";
import ClanStats from "@/components/clanDetails/ClanStats";
import ClanMembers from "@/components/clanDetails/ClanMembers";
import Footer from "@/components/Footer";
import ImageAvatar from "@/components/ImageAvatar";
import LoadingView from "@/components/loadingView/LoadingView";
import Navigation from "@/components/nav/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApi } from "@/hooks/useApi";
import utils from "@/lib/utils";
import { ClanData } from "@/types/ClanData";
import { ArrowLeft, Flame, Target, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClanActivities from "@/components/clanDetails/ClanActivities";
import JoinClanBtn from "@/components/joinClanBtn/JoinClanBtn";


export default function ClanDetails() {

  const { slugId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")
  const [clan, setClan] = useState(null)
  const [pageKey, setPageKey] = useState(0)

  useEffect(() => {
    if(!slugId) return;
    fetchClanData()
  }, [slugId])


  const fetchClanData = async () => {

    //lets get id from the slug
    let clanId =  parseInt(slugId.split("-").at(-1))

    //console.log("clanId===>", clanId)

    if(!clanId || Number.isNaN(clanId)){
      return setPageError("Not Found")
    }

    setLoading(true)

    let result = await api.get(`/clans/${clanId}`)

    setLoading(false)

    //console.log("result===>", result)

    if(result.isError()){
      return setPageError(result.getMessage())
    }

    let clanInfo: ClanData = result.getData() as ClanData;


    //console.log("clanInfo===>", clanInfo)

    clanInfo.accentColor1 = clanInfo.accentColor[0]
    clanInfo.accentColor2 = clanInfo.accentColor[1]

    //console.log("clanInfo===>", clanInfo)

    setClan(clanInfo)

  }

  const goBack = () => navigate("/clans")

  const updatePage =  async (clanData) => {

    if(clanData){
      setClan(clanData)
    } else {
      await fetchClanData()
    }

    setPageKey(Math.random() + Date.now())
  }

  return  (
    <div className="min-h-screen bg-background pt-3">
      <Navigation />
      <LoadingView
        key={pageKey}
        loading={loading}
        error={pageError}
        errorIcon={Users}
        onBack={goBack}
        onReload={fetchClanData}
        className="py-10 w-full min-h-[50vh]"
      >
        { clan != null &&
          <main className="container mx-auto px-4 py-8 mt-20 max-w-7xl">
            {/* Back Button */}
            <Button
              variant="ghost"
              onClick={() => navigate('/clans')}
              className="mb-6 hover:bg-accent transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Clans
            </Button>

            {/* Hero Header with Gradient */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-2xl mb-8">
              {/* Accent Gradient Overlay */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  background: `radial-gradient(circle at 30% 50%, ${clan.accentColor1}, transparent 70%)`
                }}
              />

              <div className="relative p-8 md:p-12">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
                  {/* Clan Logo with Glow */}
                  <div className="relative">
                    <div
                      className="absolute inset-0 blur-3xl opacity-60 animate-pulse"
                      style={{ backgroundColor: clan.accentColor1 }}
                    />
                    <div
                      className="relative overflow-hidden w-32 h-32 flex items-center justify-center text-7xl rounded-3xl bg-background/80 backdrop-blur-xl border-4 shadow-2xl"
                      style={{
                        borderColor: clan.accentColor1,
                        boxShadow: `0 0 60px ${clan.accentColor1}60`
                      }}
                    >
                      <ImageAvatar
                        src={utils.getServerImage(clan.image, "clans", "small")}
                        fallbackText={clan.name}
                        className="rounded w-full h-full"
                        fallbackTextClass="bg-none"
                      />
                    </div>
                  </div>

                  {/* Clan Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {clan.name}
                      </h1>
                      <div
                        className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 bg-background/60 backdrop-blur-sm"
                        style={{ borderColor: clan.accentColor1 }}
                      >
                        <Trophy className="h-6 w-6" style={{ color: clan.accentColor1 }} />
                        <span className="text-3xl font-black" style={{ color: clan.accentColor1 }}>
                          #{ clan.rank + 1 }
                        </span>
                      </div>
                    </div>
                    <p className="text-xl text-muted-foreground mb-6 max-w-2xl">{clan.tagline}</p>

                    {/* Socials */}
                    <ClanSocials socials={clan.socials} />

                  </div>

                  {/* Join Button */}
                  <JoinClanBtn
                    clanId={clan.id}
                    clanName={clan.name}
                    isMember={clan.isMember}
                    onSuccess={  (clanData) => updatePage(clanData) }
                    size="lg"
                    className="px-12 py-7 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105"
                    style={{
                      background: clan.isMember
                        ? 'hsl(var(--secondary))'
                        : `linear-gradient(135deg, ${clan.accentColor1}, ${clan.accentColor1}dd)`,
                      boxShadow: clan.isMember ? 'none' : `0 10px 40px ${clan.accentColor1}60`
                    }}
                    variant={clan.isMember ? "secondary" : "default"}
                    key={clan.isMember}
                  >
                    {clan.isMember ? "Leave Clan" : "Join Clan"}
                  </JoinClanBtn>
                </div>
              </div>
            </div>

            <ClanStats
              data={{
                totalMembers: clan.totalMembers,
                totalEarned: clan.totalEarned || 0,
                totalMints: clan.totalMint || 0,
                rewardPerMint: clan.rewardPerMintUSD || 0
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

                { clan &&
                  <ClanMembers
                    clanId={clan.id}
                    accentColor={clan.accentColor1}
                  />
                }
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
          </main>
        }
      </LoadingView>
      <Footer />
    </div>
  )
}

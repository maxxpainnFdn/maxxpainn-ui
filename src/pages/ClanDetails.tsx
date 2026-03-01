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
import { Activity, ArrowLeft, Book, Diamond, Flame, Group, Target, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClanActivities from "@/components/clanDetails/ClanActivities";
import JoinClanBtn from "@/components/joinClanBtn/JoinClanBtn";
import { Helmet } from "react-helmet-async";
import Tabs from "@/components/tabs/Tabs";
import OverviewTab from "@/components/clanDetails/tabs/OverviewTab";
import EarningsTab from "@/components/clanDetails/tabs/EarningsTab";


export default function ClanDetails() {

  const { slugId } = useParams();
  const navigate = useNavigate();
  const api = useApi();

  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")
  const [clan, setClan] = useState(null)
  const [pageKey, setPageKey] = useState(0)
  const [pageMeta, setPageMeta] = useState({
    title: "MaxxPainn Clans",
    description: "Create a MaxxPainn Clan, grow your community, and earn up to $1 USDC per mint."
  })

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
    
    setPageMeta({
       title: "Loading Clan - MaxxPainn",
       description: "Loading clan details on MaxxPainn..."
    })

    let result = await api.get(`/clans/${clanId}`)

    setLoading(false)

    //console.log("result===>", result)
    
    if (result?.getData() == null) {
      setPageMeta({
        title: "Clan Not Found - MaxxPainn",
        description:"This clan does not exist or may have been removed. Explore other MaxxPainn clans." 
      })
    }

    if(result.isError()){
      return setPageError(result.getMessage())
    }

    let clanInfo: ClanData = result.getData() as ClanData;
    
    setPageMeta({
      title: `${clanInfo.name} Community - MaxxPainn Clan`,
      description: `Join the ${clanInfo.name} Clan and show your allegiance to your community during token minting.`
    })
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


  return (
    <>
      <Helmet>
        <title>{pageMeta.title}</title>
        <meta name="description" content={pageMeta.description} />
        <meta property="og:title" content={pageMeta.title} />
        <meta property="og:description" content={pageMeta.description} />
      </Helmet>
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
                  <div className="flex flex-col md:flex-row items-start lg:items-center gap-8 mb-8">
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
                      <div className="flex items-center gap-4 mb-3">
                        <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                          {clan.name}
                        </h1>
                        <div
                          className="flex items-center gap-2 px-4 py-2 rounded-2xl border-2 bg-background/60 backdrop-blur-sm"
                          style={{ borderColor: clan.accentColor1 }}
                        >
                          <Trophy className="h-4 w-4 md:h-6 md:w-6" style={{ color: clan.accentColor1 }} />
                          <span className="text-xl  md:text-3xl font-bold md:font-black" style={{ color: clan.accentColor1 }}>
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
              
              <div className="my-5 mb-10">
                <Tabs
                  items={[
                    { id: "overview", label: "Overview",  icon: Target,  component: OverviewTab, args:  { clan }  },
                    { id: "earning",  label: "Earning",   icon: Diamond, component: EarningsTab, args: { clan }  },
                    { id: "stories",  label: "Stories",   icon: Book,     component: () => <div>Stories</div>   },
                    { id: "activity", label: "Activity",  icon: Activity, component: () => <div>Activities</div>  },
                    { id: "members",  label: "Members",   icon: Group,    component: () => <div>Members</div>  },
                  ]}
                />
              </div>
  
            </main>
          }
        </LoadingView>
        <Footer />
      </div>
    </>
  )
}

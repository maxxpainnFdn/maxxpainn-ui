import React, { useState, useEffect } from "react";
import {
  Crown,
  Medal,
  Activity,
  Users,
  Settings,
  Share2,
  Zap,
  Target,
  Copy,
  Check,
  Star,
  Heart,
  Eye,
  MapPin,
  LinkIcon,
  Calendar,
  Pen,
  Edit,
  User,
  AtSign,
  ChevronRight,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navigation from "@/components/nav/Navigation";
import Button from "@/components/button/Button";
import StatBlock from "@/components/profile/StatBlock";
import OverviewContent from "@/components/profile/tabs/OverviewContent";
import ClansContent from "@/components/profile/tabs/ClansContent";
import ActivityContent from "@/components/profile/tabs/ActivityContent";
import BadgesContent from "@/components/profile/tabs/BadgesContent";
import LoadingView from "@/components/loadingView/LoadingView";
import { useNavigate, useParams } from "react-router-dom";
import utils, { cn } from "@/lib/utils";
import { useApi } from "@/hooks/useApi";
import ImageAvatar from "@/components/ImageAvatar";
import { avataaars } from "@dicebear/collection";
import { useWalletCore } from "@/hooks/useWalletCore";
import ProfilePhotoUploader from "@/components/profile/ProfilePhotoUploader";
import ProfileCoverUploader from "@/components/profile/ProfileCoverUploader";
import { CopyBtn } from "@/components/copyBtn/CopyBtn";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import ProfileInfoEditor from "@/components/profile/ProfileInfoEditor";
import ClampText from "@/components/clampText/ClampText";
import ChangeUsernameDialog from "@/components/profile/ChangeUsernameDialog";
import { AccountData } from "@/types/AccountData";
import ShareDialog from "@/components/shareDialog/ShareDialog";
import FollowButton from "@/components/followButton/FollowButton";


export default function UserProfilePage() {

  const queryParams = useParams()
  const api = useApi()
  const wallet = useWalletCore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false)
  const [pageError, setPageError] = useState("")
  const [accountInfo, setAccountInfo] = useState(null)
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("")
  const [profileCoverUrl, setProfileCoverUrl] = useState("")
  const [isAccountOwner, setIsAccountOwner] = useState(false)
  const [settingsPopoverOpen, setSettingsPopoverOpen] = useState(false)
  const [pageKey, setPageKey] = useState(0)


  useEffect(()=>{
    if(accountInfo == null || !wallet.isConnected){
      setIsAccountOwner(false)
    } else {

      // @ts-expect-error suppress lint error
      let isAcctOwner = (wallet.isConnected && (wallet.address == accountInfo.address));
      setIsAccountOwner(isAcctOwner);
    }
  }, [accountInfo, wallet])

  useEffect(() => {
     initialize()
  }, [queryParams])

  useEffect(()=>{
    initialize()
  },[wallet.isConnected])

  const initialize = async () => {

    setPageError("")

    let _usernameOrAddress = null;

    if(window.location.pathname.startsWith("/profile")){

      _usernameOrAddress = (queryParams.usernameOrAddress || "").trim();

      if(_usernameOrAddress === ""){
        setPageError("Invalid username or address")
        return;
      }

      if(_usernameOrAddress.startsWith("@")) {
        _usernameOrAddress = _usernameOrAddress.replace("@","")
      }

      fetchAccountInfo(_usernameOrAddress)

      } else if(window.location.pathname == "/account") {

        if(!wallet.isConnected){
          setPageError("Connect wallet to continue")
          return;
        }

        fetchAccountInfo(null)
      }
  }

  const fetchAccountInfo = async (usernameOrAddress = null) => {
    try {

      setLoading(true)

      const query = {}

      if(usernameOrAddress != null) {
        query["username"] = usernameOrAddress;
      }

      const resultStatus = await ((usernameOrAddress == null) ?
                              api.getWithAuth("/account", query) :
                              api.get("/profile", query)
                            )

      if(resultStatus.isError()){
        setPageError(resultStatus.getMessage())
        return;
      }

      const acctInfo: AccountData | null = resultStatus.getData() as AccountData;

      //console.log("acctInfo===>", acctInfo)

      if(acctInfo == null){
        setPageError("Account not found")
        return;
      }

      setProfilePhotoUrl(utils.getServerImage(acctInfo.photo as string, "profile/photo", "normal"))
      setProfileCoverUrl(utils.getCoverPhotoUrl(acctInfo.coverPhoto as string, "profile/cover"))

      setAccountInfo(acctInfo)

    } catch(e){

      utils.logError("Profile#fetchAccountInfo:", e)
      setPageError(utils.systemError)

    } finally {
      setLoading(false)
      setPageKey(Date.now())
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
      <Navigation />

      <LoadingView
        loading={loading}
        onReload={ () => initialize() }
        error={pageError}
        className="h-screen"
      >

        {accountInfo != null && (
          <>
            {/* Enhanced Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">

              {/* Animated gradient orbs */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/50 rounded-full mix-blend-multiply filter blur-3xl opacity-16" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/50 rounded-full mix-blend-multiply filter blur-3xl opacity-16" />
                <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500/50 rounded-full mix-blend-multiply filter blur-3xl opacity-16" />
              </div>

              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />

              {/* Floating geometric shapes */}
              <div className="absolute top-20 left-20 w-4 h-4 border-2 border-purple-500/40 rotate-45 animate-spin opacity-15" style={{ animationDuration: '20s' }} />
              <div className="absolute top-40 right-32 w-6 h-6 border-2 border-pink-500/40 rounded-full animate-ping opacity-15" style={{ animationDuration: '4s' }} />
              <div className="absolute bottom-32 right-20 w-5 h-5 border-2 border-red-500/30 rotate-12 animate-spin opacity-15" style={{ animationDuration: '15s' }} />
            </div>

            <main className="relative z-10 pt-28 pb-20">
              <div className="max-w-7xl mx-auto px-4 md:px-2">

                {/* ===== PROFILE HEADER ===== */}
                <div className="relative mb-12">
                  {/* Banner with overlay effect */}
                  <div className="h-56 md:h-64 lg:h-[280px] bg-cover bg-center rounded-3xl overflow-hidden relative group"
                    style={{ backgroundImage: `url(${profileCoverUrl})` }}
                  >

                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 via-pink-600/30 to-purple-600/30 " />
                    <div className="absolute inset-0 bg-cover bg-center" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                    {isAccountOwner &&
                      <ProfileCoverUploader
                        onSuccess={(coverUrl) => setProfileCoverUrl(coverUrl)}
                        trigger={
                          <button className="bg-black/60 p-2 rounded-lg border-none absolute top-2 right-2">
                            <Edit className="w-4 h-4 text-white" />
                          </button>
                        }
                      />
                    }
                  </div>

                  {/* Profile Card */}
                  <div className="relative mx-4 md:mx-6 -mt-24 bg-gray-900/80 backdrop-blur-2xl border-2 border-purple-500/20 rounded-3xl p-6 md:p-10 shadow-[0_0_40px_rgba(168,85,247,0.15)] hover:border-purple-500/40 transition-all duration-500">

                    {/* Internal glow */}
                    <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent rounded-3xl pointer-events-none" />

                    <div className="relative flex flex-col lg:flex-row gap-4">

                      {/* Avatar Section */}
                      <div className="flex flex-col items-center md:items-start">
                        <div className="relative -mt-20 md:-mt-28 mb-6 group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-xl group-hover:opacity-70 transition-opacity duration-500" />
                          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-gray-950 border-4 border-gray-900 overflow-hidden shadow-2xl group-hover:scale-105 transition-transform duration-300">

                            <ImageAvatar
                              src={profilePhotoUrl}
                              seed={accountInfo.address}
                              avatarType={avataaars}
                              radius={0}
                              className="rounded w-full h-full object-cover bg-gray-800/60"
                              fallbackTextClass="bg-none"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>

                          {isAccountOwner &&
                            <ProfilePhotoUploader
                              currentPhotoUrl={accountInfo.photo == "" ? null : profilePhotoUrl}
                              onSuccess={(photoUrl) => setProfilePhotoUrl(photoUrl)}
                              trigger={
                                <button className="bg-black/60 p-2 rounded-lg border-none absolute top-1.5 right-1.5">
                                  <Edit className="w-4 h-4 text-white" />
                                </button>
                              }
                            />
                          }

                          {/* Verified Badge
                          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center border-4 border-gray-900 shadow-lg shadow-emerald-500/50">
                            <Check className="w-5 h-5 text-white" />
                          </div>
                          */}
                        </div>

                        {/* Rank Badge */}
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30 shadow-lg hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105">
                          <Crown className="w-4 h-4 text-purple-400 animate-pulse" />
                          <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-wider">
                            Rank #{accountInfo.rank}
                          </span>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-6">
                          <div>
                            <div className="text-xl sm:text-3xl md:text-5xl font-black mb-0 p-0">
                              <span className="text-white">
                                { accountInfo.name == "" ? "No Name" : accountInfo.name }
                              </span>
                            </div>
                            <div className="flex w-full justify-center md:justify-start items-center text-gray-400 font-medium text-sm sm:text-md mb-0">
                              <span>@{accountInfo.username}</span>
                              <span className="ms-1">
                                <CopyBtn
                                  textToCopy={accountInfo.username}
                                  className="p-1 bg-none border-0 text-gray-400"
                                  copiedClassName="p-1 bg-none border-0 text-green-400"
                                />
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center justify-center md:justify-start gap-3">

                            { !isAccountOwner && (
                              <FollowButton
                                followingAccountId={accountInfo.id}
                                initialFollowing={accountInfo.isFollower}
                                onFollowChange={(newState)=> {
                                  const fc = accountInfo.followerCount
                                  const followerCount = (newState) ? fc + 1 : fc -1
                                  setAccountInfo(prev => ({ ...prev, isFollower: newState, followerCount }))
                                }}
                              />
                            )}
                            <ShareDialog
                              url={window.origin + `/profile/${accountInfo.username}`}
                              text={`Check out this account on MAXXPAINN!`}
                              dialogTitle="Share Profile"
                              dialogDescription="Share this profile with your friends and followers."
                              trigger={
                                <button className="p-3 bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-all duration-300 border-2 border-gray-700/50 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20">
                                  <Share2 className="w-5 h-5" />
                                </button>
                              }
                            />
                            {isAccountOwner && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button
                                    className="
                                      p-3 bg-gray-800/60 hover:bg-gray-700 text-gray-400 hover:text-white
                                      rounded-xl transition-all duration-300
                                      border-2 border-gray-700/50 hover:border-purple-500/50
                                      hover:shadow-lg hover:shadow-purple-500/20
                                    "
                                  >
                                    <Settings className="w-5 h-5" />
                                  </button>
                                </PopoverTrigger>

                                <PopoverContent
                                  className="w-56 p-0 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] overflow-hidden"
                                  align="end"
                                  sideOffset={8}
                                >
                                  {/* Header */}
                                  <div className="px-4 py-3 border-b border-white/5 bg-black/20">
                                    <p className="text-sm font-bold text-white">Settings</p>
                                    <p className="text-xs text-gray-500">Manage your account</p>
                                  </div>

                                  {/* Gradient Separator */}
                                  <div className="h-px w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                                  {/* Menu Items */}
                                  <div className="p-2 space-y-1">
                                    {/* Change Username */}
                                    <ChangeUsernameDialog
                                      currentUsername={accountInfo.username}
                                      trigger={
                                        <button
                                          className="
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            text-sm text-gray-400 hover:text-white
                                            hover:bg-white/5 transition-all duration-200
                                            group
                                          "
                                        >
                                          <div className="p-1.5 rounded-md bg-gray-800 group-hover:bg-purple-500/20 transition-colors">
                                            <AtSign className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                                          </div>
                                          <span className="flex-1 text-left">Change Username</span>
                                        </button>
                                      }
                                      onSuccess={(newUsername) => {
                                        if (window.location.pathname.startsWith(`/profile/${accountInfo.username}`)) {
                                          navigate(`/profile/${newUsername}`)
                                        } else {
                                          setAccountInfo((oldData) => ({ ...oldData, username: newUsername }))
                                        }
                                      }}
                                    />

                                    {/* Profile Settings */}
                                    <ProfileInfoEditor
                                      currentData={accountInfo}
                                      onSuccess={(newData) => {
                                        setAccountInfo((oldData) => ({ ...oldData, ...newData }))
                                      }}
                                      trigger={
                                        <button
                                          className="
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            text-sm text-gray-400 hover:text-white
                                            hover:bg-white/5 transition-all duration-200
                                            group
                                          "
                                        >
                                          <div className="p-1.5 rounded-md bg-gray-800 group-hover:bg-purple-500/20 transition-colors">
                                            <User className="w-4 h-4 group-hover:text-purple-400 transition-colors" />
                                          </div>
                                          <span className="flex-1 text-left">Profile Settings</span>
                                        </button>
                                      }
                                    />
                                  </div>

                                </PopoverContent>
                              </Popover>
                            )}
                          </div>
                        </div>

                        {/* Wallet Address */}
                        <div
                          className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gray-800/60 border-2 border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 mb-6 group hover:shadow-lg hover:shadow-purple-500/20"
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-sm font-mono text-gray-300 group-hover:text-white transition-colors">
                            {utils.maskAddress(accountInfo.address, 8, 6)}
                          </span>
                          <CopyBtn
                            textToCopy={accountInfo.address}
                            className="bg-none p-0 border-none text-gray-500 group-hover:text-purple-400 transition-colors"
                            copiedClassName="bg-none p-0 border-none text-emerald-500"
                          />
                        </div>

                        {/* Bio */}
                        {accountInfo.description != "" &&
                          <div className="text-gray-300 text-lg leading-relaxed max-w-2xl mb-6">
                            <ClampText
                              text={accountInfo.description}
                              lines={2}
                            />
                          </div>
                        }

                        {/* Meta Info */}
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-400">
                          {/* Location */}
                          <span className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer max-w-full">
                            <MapPin className="w-4 h-4 shrink-0" /> {/* shrink-0 prevents icon squishing */}
                            <span className="truncate  max-w-[100px] sm:max-w-[150px]">
                              { accountInfo.location == "" ? "Unknown" : accountInfo.location }
                            </span>
                          </span>

                          {/* Link */}
                          {accountInfo.website != "" &&
                            <a href={accountInfo.website}
                              target="_blank"
                              className="flex items-center gap-2 hover:text-purple-400 transition-colors group max-w-full"
                            >
                              <LinkIcon className="w-4 h-4 group-hover:rotate-45 transition-transform shrink-0" />
                              <span className="truncate max-w-[100px] sm:max-w-[150px]">
                                {new URL(accountInfo.website).hostname}
                              </span>
                            </a>
                          }

                          {/* Date - usually doesn't need truncating, but here is the pattern just in case */}
                          <span className="flex items-center gap-2 max-w-full">
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span className="truncate">
                              Joined {utils.getRelativeDate(accountInfo.createdAt)}
                            </span>
                          </span>
                        </div>

                      </div>
                    </div>

                    {/* Stats Row
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-1 mt-10 pt-10 border-t-2 border-gray-800/50">
                        <StatBlock label="Followers" value={ utils.toShortNumber(accountInfo.followerCount) }  icon={Users} color="purple" />
                        <StatBlock label="Following" value={ utils.toShortNumber(accountInfo.followingCount) } icon={Eye} color="blue" />
                        <StatBlock label="Total Mints" value={ utils.toShortNumber(accountInfo.mintCount) } icon={Star} color="pink" highlight />
                        <StatBlock label="Amount Minted" value={ utils.toShortNumber(accountInfo.mintedAmount) } icon={Zap} color="green" />
                      </div>
                     */}
                  </div>
                </div>

                {/* ===== TABS ===== */}
                <div className="mx-4 md:mx-6 bg-gray-900/60 backdrop-blur-sm border-2 border-gray-800/50 rounded-2xl p-2 mb-8 shadow-xl">
                  <div className="flex justify-center md:justify-start flex-wrap  gap-2">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap relative  ${isActive
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/30"
                              : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                            }`}
                        >
                          {isActive && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse" />
                          )}
                          <tab.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-white" : ""}`} />
                          <span className="relative z-10">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ===== CONTENT ===== */}
                <div className="mx-4 md:mx-6 animate-fade-in">
                  {activeTab === "overview" &&
                    <OverviewContent
                      totalMints={utils.toShortNumber(accountInfo.mintCount)}
                      amountMinted={utils.toShortNumber(accountInfo.mintedAmount)}
                      totalReferral={utils.toShortNumber(accountInfo.mintedAmount)}
                      totalFollowers={utils.toShortNumber(accountInfo.followerCount)}
                    />
                  }
                  {activeTab === "clans" && <ClansContent accountId={accountInfo.id} />}
                  {activeTab === "badges" && <BadgesContent accountId={accountInfo.id} />}
                  {activeTab === "activity" && <ActivityContent accountId={accountInfo.id} />}
                </div>

              </div>
            </main>
          </>
        )}
      </LoadingView>
      <Footer />
    </div>
  );
}

// ===================== HELPERS =====================

const TABS = [
  { id: "overview", label: "Overview", icon: Target },
  { id: "clans", label: "Clans", icon: Crown },
  { id: "badges", label: "Badges", icon: Medal },
  { id: "activity", label: "Activity", icon: Activity },
];

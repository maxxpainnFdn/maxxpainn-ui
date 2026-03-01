import React, { useState, useEffect } from "react";
import {
  Crown, Medal, Activity, Users, Settings,
  Share2, Zap, Target, Star, Eye,
  MapPin, LinkIcon, Calendar, Edit,
  User, AtSign,
} from "lucide-react";
import Footer from "@/components/Footer";
import Navigation from "@/components/nav/Navigation";
import Button from "@/components/button/Button";
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

const TABS = [
  { id: "overview",  label: "Overview",  icon: Target   },
  { id: "clans",     label: "Clans",     icon: Crown    },
  { id: "badges",    label: "Badges",    icon: Medal    },
  { id: "activity",  label: "Activity",  icon: Activity },
];

export default function UserProfilePage() {
  const queryParams = useParams();
  const api         = useApi();
  const wallet      = useWalletCore();
  const navigate    = useNavigate();

  const [activeTab,            setActiveTab]            = useState("overview");
  const [loading,              setLoading]              = useState(false);
  const [pageError,            setPageError]            = useState("");
  const [accountInfo,          setAccountInfo]          = useState(null);
  const [profilePhotoUrl,      setProfilePhotoUrl]      = useState("");
  const [profileCoverUrl,      setProfileCoverUrl]      = useState("");
  const [isAccountOwner,       setIsAccountOwner]       = useState(false);
  const [pageKey,              setPageKey]              = useState(0);

  useEffect(() => {
    if (accountInfo == null || !wallet.isConnected) {
      setIsAccountOwner(false);
    } else {
      // @ts-expect-error suppress lint error
      setIsAccountOwner(wallet.isConnected && wallet.address == accountInfo.address);
    }
  }, [accountInfo, wallet]);

  useEffect(() => { initialize(); }, [queryParams]);
  useEffect(() => { initialize(); }, [wallet.isConnected]);

  const initialize = async () => {
    setPageError("");
    let _usernameOrAddress: string | null = null;

    if (window.location.pathname.startsWith("/profile")) {
      _usernameOrAddress = (queryParams.usernameOrAddress || "").trim();
      if (_usernameOrAddress === "") { setPageError("Invalid username or address"); return; }
      if (_usernameOrAddress.startsWith("@")) _usernameOrAddress = _usernameOrAddress.replace("@", "");
      fetchAccountInfo(_usernameOrAddress);
    } else if (window.location.pathname === "/account") {
      if (!wallet.isConnected) { setPageError("Connect wallet to continue"); return; }
      fetchAccountInfo(null);
    }
  };

  const fetchAccountInfo = async (usernameOrAddress: string | null = null) => {
    try {
      setLoading(true);
      const query: any = {};
      if (usernameOrAddress != null) query["username"] = usernameOrAddress;

      const resultStatus = await (usernameOrAddress == null
        ? api.getWithAuth("/account", query)
        : api.get("/profile", query));

      if (resultStatus.isError()) { setPageError(resultStatus.getMessage()); return; }

      const acctInfo: AccountData | null = resultStatus.getData() as AccountData;
      if (acctInfo == null) { setPageError("Account not found"); return; }

      setProfilePhotoUrl(utils.getServerImage(acctInfo.photo as string, "profile/photo", "normal"));
      setProfileCoverUrl(utils.getCoverPhotoUrl(acctInfo.coverPhoto as string, "profile/cover"));
      setAccountInfo(acctInfo);
    } catch (e) {
      utils.logError("Profile#fetchAccountInfo:", e);
      setPageError(utils.systemError);
    } finally {
      setLoading(false);
      setPageKey(Date.now());
    }
  };

  return (
    <div className="min-h-screen bg-maxx-bg0">
      <Navigation />

      <LoadingView
        loading={loading}
        onReload={() => initialize()}
        error={pageError}
        className="h-screen"
      >
        {accountInfo != null && (
          <>
            {/* ── Page background ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
              <div className="absolute -top-40 -right-40 w-[600px] h-[600px]"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--maxx-pink) 5%, transparent) 0%, transparent 60%)" }} />
              <div className="absolute top-[30%] -left-32 w-[500px] h-[500px]"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--maxx-violet) 5%, transparent) 0%, transparent 65%)" }} />
              <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px]"
                style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--maxx-cyan) 4%, transparent) 0%, transparent 70%)" }} />
            </div>

            <main className="relative z-10 pt-24 pb-20">
              <div className="max-w-6xl mx-auto px-4">

                {/* ══════════════════════════════════════
                    COVER + PROFILE CARD
                ══════════════════════════════════════ */}
                <div className="mb-8">

                  {/* Cover */}
                  <div
                    className="h-48 md:h-64 rounded-xl overflow-hidden relative bg-maxx-bg1 border border-maxx-violet/20"
                    style={{ backgroundImage: `url(${profileCoverUrl})`, backgroundSize: "cover", backgroundPosition: "center" }}
                  >
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-maxx-bg0 via-maxx-bg0/40 to-transparent" />
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink/60 to-transparent" />

                    {isAccountOwner && (
                      <ProfileCoverUploader
                        onSuccess={(coverUrl) => setProfileCoverUrl(coverUrl)}
                        trigger={
                          <button className="absolute top-3 right-3 p-2 rounded-md bg-maxx-bg0/70 border border-maxx-violet/25 text-maxx-sub hover:text-maxx-white hover:border-maxx-violet/50 transition-all duration-200 backdrop-blur-sm">
                            <Edit className="w-4 h-4" />
                          </button>
                        }
                      />
                    )}
                  </div>

                  {/* Profile card — overlaps cover */}
                  <div className="relative mx-0 -mt-14 bg-maxx-bg1/90 backdrop-blur-xl border border-maxx-violet/20 rounded-xl p-6 md:p-8
                                  shadow-[0_8px_40px_color-mix(in_srgb,black_60%,transparent),0_0_0_1px_color-mix(in_srgb,var(--maxx-violet)_8%,transparent)]">
                    {/* Top accent line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/25 to-transparent rounded-t-xl" />

                    <div className="flex flex-col md:flex-row gap-6">

                      {/* ── Avatar column ── */}
                      <div className="flex flex-col items-center md:items-start gap-4 shrink-0">

                        {/* Avatar */}
                        <div className="relative -mt-20 md:-mt-24 group">
                          {/* Glow ring */}
                          <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-maxx-violet via-maxx-pink to-maxx-violet opacity-40 blur-sm group-hover:opacity-60 transition-opacity duration-300" />
                          <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-xl bg-maxx-bg0 border-2 border-maxx-bg0 overflow-hidden">
                            <ImageAvatar
                              src={profilePhotoUrl}
                              seed={accountInfo.address}
                              avatarType={avataaars}
                              radius={0}
                              className="rounded w-full h-full object-cover"
                              fallbackTextClass="bg-none"
                            />
                          </div>
                          {isAccountOwner && (
                            <ProfilePhotoUploader
                              currentPhotoUrl={accountInfo.photo == "" ? null : profilePhotoUrl}
                              onSuccess={(photoUrl) => setProfilePhotoUrl(photoUrl)}
                              trigger={
                                <button className="absolute top-1.5 right-1.5 p-1.5 rounded bg-maxx-bg0/80 border border-maxx-violet/25 text-maxx-sub hover:text-maxx-white transition-all duration-200 backdrop-blur-sm">
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                              }
                            />
                          )}
                        </div>

                        {/* Rank badge */}
                        <div className="pill gap-2 border-maxx-violet/30 bg-maxx-violet/5">
                          <Crown className="w-3.5 h-3.5 text-maxx-violet animate-pain-pulse" />
                          <span className="text-maxx-violet-lt font-bold">Rank #{accountInfo.rank}</span>
                        </div>
                      </div>

                      {/* ── Info column ── */}
                      <div className="flex-1 min-w-0">

                        {/* Name + actions row */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">

                          {/* Name + username */}
                          <div>
                            <h1 className="font-sans font-black text-3xl md:text-4xl text-maxx-white tracking-tight leading-none mb-1">
                              {accountInfo.name === "" ? "No Name" : accountInfo.name}
                            </h1>
                            <div className="flex items-center gap-1 text-maxx-sub text-sm">
                              <span>@{accountInfo.username}</span>
                              <CopyBtn
                                textToCopy={accountInfo.username}
                                className="p-1 bg-none border-0 text-maxx-dim hover:text-maxx-violet"
                                copiedClassName="p-1 bg-none border-0 text-maxx-emerald"
                              />
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {!isAccountOwner && (
                              <FollowButton
                                followingAccountId={accountInfo.id}
                                initialFollowing={accountInfo.isFollower}
                                onFollowChange={(newState) => {
                                  const fc = accountInfo.followerCount;
                                  setAccountInfo(prev => ({ ...prev, isFollower: newState, followerCount: newState ? fc + 1 : fc - 1 }));
                                }}
                              />
                            )}

                            {/* Share */}
                            <ShareDialog
                              url={window.origin + `/profile/${accountInfo.username}`}
                              text="Check out this account on MAXXPAINN!"
                              dialogTitle="Share Profile"
                              dialogDescription="Share this profile with your friends and followers."
                              trigger={
                                <button className="p-2.5 rounded-md bg-maxx-bg0/60 border border-maxx-violet/20 text-maxx-sub hover:text-maxx-white hover:border-maxx-violet/50 transition-all duration-200">
                                  <Share2 className="w-4 h-4" />
                                </button>
                              }
                            />

                            {/* Settings (owner only) */}
                            {isAccountOwner && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <button className="p-2.5 rounded-md bg-maxx-bg0/60 border border-maxx-violet/20 text-maxx-sub hover:text-maxx-white hover:border-maxx-violet/50 transition-all duration-200">
                                    <Settings className="w-4 h-4" />
                                  </button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-52 p-0 bg-maxx-bg1/98 backdrop-blur-xl border border-maxx-violet/25 rounded-lg shadow-[0_16px_48px_color-mix(in_srgb,black_70%,transparent)] overflow-hidden"
                                  align="end"
                                  sideOffset={8}
                                >
                                  {/* Accent line */}
                                  <div className="h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink/60 to-transparent" />

                                  {/* Header */}
                                  <div className="px-4 py-3 border-b border-maxx-violet/12">
                                    <p className="font-mono text-[0.7rem] tracking-[0.14em] uppercase text-maxx-violet">Settings</p>
                                    <p className="text-xs text-maxx-dim mt-0.5">Manage your account</p>
                                  </div>

                                  {/* Items */}
                                  <div className="p-1.5 space-y-0.5">
                                    <ChangeUsernameDialog
                                      currentUsername={accountInfo.username}
                                      trigger={
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-maxx-mid hover:text-maxx-white hover:bg-maxx-violet/8 transition-all duration-200 group">
                                          <div className="p-1.5 rounded bg-maxx-bg0/60 border border-maxx-violet/15 group-hover:border-maxx-violet/30 group-hover:bg-maxx-violet/10 transition-colors">
                                            <AtSign className="w-3.5 h-3.5 text-maxx-sub group-hover:text-maxx-violet transition-colors" />
                                          </div>
                                          <span className="flex-1 text-left">Change Username</span>
                                        </button>
                                      }
                                      onSuccess={(newUsername) => {
                                        if (window.location.pathname.startsWith(`/profile/${accountInfo.username}`)) {
                                          navigate(`/profile/${newUsername}`);
                                        } else {
                                          setAccountInfo((old) => ({ ...old, username: newUsername }));
                                        }
                                      }}
                                    />
                                    <ProfileInfoEditor
                                      currentData={accountInfo}
                                      onSuccess={(newData) => setAccountInfo((old) => ({ ...old, ...newData }))}
                                      trigger={
                                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm text-maxx-mid hover:text-maxx-white hover:bg-maxx-violet/8 transition-all duration-200 group">
                                          <div className="p-1.5 rounded bg-maxx-bg0/60 border border-maxx-violet/15 group-hover:border-maxx-violet/30 group-hover:bg-maxx-violet/10 transition-colors">
                                            <User className="w-3.5 h-3.5 text-maxx-sub group-hover:text-maxx-violet transition-colors" />
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

                        {/* Wallet address pill */}
                        <div className="inline-flex items-center gap-2.5 px-3 py-2 rounded-md bg-maxx-bg0/60 border border-maxx-violet/15 hover:border-maxx-violet/30 transition-colors duration-200 mb-4 group">
                          <span className="w-2 h-2 rounded-full bg-maxx-emerald animate-ping-slow shrink-0" />
                          <span className="text-xs font-mono text-maxx-mid group-hover:text-maxx-bright transition-colors">
                            {utils.maskAddress(accountInfo.address, 8, 6)}
                          </span>
                          <CopyBtn
                            textToCopy={accountInfo.address}
                            className="bg-none p-0 border-none text-maxx-dim hover:text-maxx-violet transition-colors"
                            copiedClassName="bg-none p-0 border-none text-maxx-emerald"
                          />
                        </div>

                        {/* Bio */}
                        {accountInfo.description !== "" && (
                          <div className="text-maxx-mid text-sm leading-relaxed max-w-xl mb-4">
                            <ClampText text={accountInfo.description} lines={2} />
                          </div>
                        )}

                        {/* Meta */}
                        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-maxx-sub">
                          <span className="flex items-center gap-1.5 hover:text-maxx-violet transition-colors">
                            <MapPin className="w-3.5 h-3.5 shrink-0" />
                            <span className="truncate max-w-[120px]">
                              {accountInfo.location === "" ? "Unknown" : accountInfo.location}
                            </span>
                          </span>
                          {accountInfo.website !== "" && (
                            <a href={accountInfo.website} target="_blank"
                              className="flex items-center gap-1.5 hover:text-maxx-violet transition-colors group">
                              <LinkIcon className="w-3.5 h-3.5 shrink-0 group-hover:rotate-45 transition-transform" />
                              <span className="truncate max-w-[120px]">{new URL(accountInfo.website).hostname}</span>
                            </a>
                          )}
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            Joined {utils.getRelativeDate(accountInfo.createdAt)}
                          </span>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* ══════════════════════════════════════
                    TABS
                ══════════════════════════════════════ */}
                <div className="mb-6">
                  {/* Tab bar */}
                  <div className="flex items-end gap-0 border-b border-maxx-violet/15">
                    {TABS.map((tab) => {
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={cn(
                            "relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                            isActive
                              ? "text-maxx-white"
                              : "text-maxx-sub hover:text-maxx-mid"
                          )}
                        >
                          <tab.icon className={cn("w-4 h-4", isActive ? "text-maxx-pink" : "")} />
                          {tab.label}

                          {/* Active underline */}
                          {isActive && (
                            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent rounded-t-sm" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* ══════════════════════════════════════
                    TAB CONTENT
                ══════════════════════════════════════ */}
                <div className="animate-fade-up" key={activeTab}>
                  {activeTab === "overview" && (
                    <OverviewContent
                      totalMints={utils.toShortNumber(accountInfo.mintCount)}
                      amountMinted={utils.toShortNumber(accountInfo.mintedAmount)}
                      totalReferral={utils.toShortNumber(accountInfo.totalReferral)}
                      totalFollowers={utils.toShortNumber(accountInfo.followerCount)}
                    />
                  )}
                  {activeTab === "clans"    && <ClansContent    accountId={accountInfo.id} />}
                  {activeTab === "badges"   && <BadgesContent   accountId={accountInfo.id} />}
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

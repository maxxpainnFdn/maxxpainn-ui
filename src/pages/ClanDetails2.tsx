import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, TrendingUp, Trophy, ArrowLeft, Crown, Flame, Target, Twitter, Send, MessageCircle, Globe, Share2, Copy, Check } from "lucide-react";
import toast from "@/hooks/toast";

const mockMembers = [
  { id: 1, name: "CryptoKnight", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1", rank: "Leader", mints: 156 },
  { id: 2, name: "BlockBuster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2", rank: "Officer", mints: 143 },
  { id: 3, name: "TokenMaster", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3", rank: "Officer", mints: 128 },
  { id: 4, name: "ChainWarrior", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=4", rank: "Member", mints: 98 },
  { id: 5, name: "NFTHunter", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=5", rank: "Member", mints: 87 },
  { id: 6, name: "DeFiWizard", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=6", rank: "Member", mints: 76 },
  { id: 7, name: "Web3Pioneer", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=7", rank: "Member", mints: 65 },
  { id: 8, name: "SolanaKing", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=8", rank: "Member", mints: 54 },
];
 
const mockClans = [
  {
    id: 1,
    name: "Diamond Hands DAO",
    tagline: "HODL together, moon together",
    description: "We are a community of diamond-handed investors who believe in the long-term potential of crypto. Our clan focuses on strategic minting, community growth, and sharing alpha. Join us to access exclusive NFT drops, collaborative strategies, and a network of like-minded hodlers.",
    members: 2847,
    totalMints: 15234,
    totalEarnings: 1523.4,
    rewardPerMint: 0.1,
    accentColor: "hsl(280, 100%, 70%)",
    logo: "💎",
    socialLinks: {
      twitter: "https://twitter.com/diamondhands",
      telegram: "https://t.me/diamondhands",
      discord: "https://discord.gg/diamondhands",
      website: "https://diamondhands.io"
    }
  },
  {
    id: 2,
    name: "Alpha Hunters",
    tagline: "First to mint, first to profit",
    description: "Elite group of NFT enthusiasts hunting the next big drops. We pride ourselves on being early adopters and trend setters in the NFT space. Our community shares real-time intel, conducts thorough research, and coordinates on high-potential mints.",
    members: 1923,
    totalMints: 12876,
    totalEarnings: 1287.6,
    rewardPerMint: 0.1,
    accentColor: "hsl(45, 100%, 51%)",
    logo: "🏹",
    socialLinks: {
      twitter: "https://twitter.com/alphahunters",
      telegram: "https://t.me/alphahunters",
      discord: "https://discord.gg/alphahunters",
      website: "https://alphahunters.io"
    }
  },
  {
    id: 3,
    name: "Moon Chasers",
    tagline: "To the moon and beyond",
    description: "Ambitious traders and collectors aiming for astronomical gains. We combine technical analysis with community wisdom to identify projects with moon potential. Join us for daily market insights, mint calendars, and a supportive community.",
    members: 3156,
    totalMints: 18945,
    totalEarnings: 1894.5,
    rewardPerMint: 0.1,
    accentColor: "hsl(200, 100%, 50%)",
    logo: "🌙",
    socialLinks: {
      twitter: "https://twitter.com/moonchasers",
      telegram: "https://t.me/moonchasers",
      discord: "https://discord.gg/moonchasers",
      website: "https://moonchasers.io"
    }
  },
];

export default function ClanDetails2() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMember, setIsMember] = useState(false);
  const [copied, setCopied] = useState(false);

  const clan = mockClans.find(c => c.id === Number(id));

  if (!clan) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Clan Not Found</h1>
          <Button onClick={() => navigate('/clans')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Clans
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const handleJoinClan = () => {
    setIsMember(!isMember);
  };

  const handleCopyInvite = () => {
    const inviteUrl = `${window.location.origin}/clans/${clan.id}?invite=true`;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const inviteUrl = `${window.location.origin}/clans/${clan.id}?invite=true`;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
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
              background: `radial-gradient(circle at 30% 50%, ${clan.accentColor}, transparent 70%)`
            }}
          />
          
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 mb-8">
              {/* Clan Logo with Glow */}
              <div className="relative">
                <div 
                  className="absolute inset-0 blur-3xl opacity-60 animate-pulse"
                  style={{ backgroundColor: clan.accentColor }}
                />
                <div 
                  className="relative w-32 h-32 flex items-center justify-center text-7xl rounded-3xl bg-background/80 backdrop-blur-xl border-4 shadow-2xl"
                  style={{ 
                    borderColor: clan.accentColor,
                    boxShadow: `0 0 60px ${clan.accentColor}60`
                  }}
                >
                  {clan.logo}
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
                    style={{ borderColor: clan.accentColor }}
                  >
                    <Trophy className="h-6 w-6" style={{ color: clan.accentColor }} />
                    <span className="text-3xl font-black" style={{ color: clan.accentColor }}>
                      #{mockClans.findIndex(c => c.id === clan.id) + 1}
                    </span>
                  </div>
                </div>
                <p className="text-xl text-muted-foreground mb-6 max-w-2xl">{clan.tagline}</p>
                
                {/* Social Links */}
                <div className="flex flex-wrap gap-4 mb-6">
                  {clan.socialLinks?.twitter && (
                    <a 
                      href={clan.socialLinks.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-border/40 hover:border-primary/40 group"
                    >
                      <Twitter className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {clan.socialLinks?.telegram && (
                    <a 
                      href={clan.socialLinks.telegram} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-border/40 hover:border-primary/40 group"
                    >
                      <Send className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Telegram</span>
                    </a>
                  )}
                  {clan.socialLinks?.discord && (
                    <a 
                      href={clan.socialLinks.discord} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-border/40 hover:border-primary/40 group"
                    >
                      <MessageCircle className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Discord</span>
                    </a>
                  )}
                  {clan.socialLinks?.website && (
                    <a 
                      href={clan.socialLinks.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 transition-all duration-300 border border-border/40 hover:border-primary/40 group"
                    >
                      <Globe className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Website</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Join Button */}
              <Button
                size="lg"
                onClick={handleJoinClan}
                className="px-12 py-7 text-lg font-bold shadow-2xl transition-all duration-300 hover:scale-105"
                style={{
                  background: isMember 
                    ? 'hsl(var(--secondary))' 
                    : `linear-gradient(135deg, ${clan.accentColor}, ${clan.accentColor}dd)`,
                  boxShadow: isMember ? 'none' : `0 10px 40px ${clan.accentColor}60`
                }}
                variant={isMember ? "secondary" : "default"}
              >
                {isMember ? "Leave Clan" : "Join Clan"}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-purple-500/10">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Mints</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {clan.totalMints.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-blue-500/10">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Members</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {clan.members.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-green-500/10">
                  <TrendingUp className="h-6 w-6 text-green-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Earned</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {clan.totalEarnings.toFixed(1)} <span className="text-xl">SOL</span>
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border border-border/40 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-yellow-500/10">
                  <Flame className="h-6 w-6 text-yellow-400" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Per Mint</span>
              </div>
              <p className="text-4xl font-black bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                {clan.rewardPerMint} <span className="text-xl">SOL</span>
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Leader & Members */}
          <div className="lg:col-span-1 space-y-8">
            {/* Clan Leader */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${clan.accentColor}, transparent 70%)`
                }}
              />
              <CardContent className="p-8 relative">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="h-5 w-5" style={{ color: clan.accentColor }} />
                  <h2 className="text-2xl font-black">Clan Leader</h2>
                </div>
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <div 
                      className="absolute inset-0 blur-2xl opacity-40"
                      style={{ backgroundColor: clan.accentColor }}
                    />
                    <Avatar className="relative h-32 w-32 mx-auto border-4 shadow-2xl" style={{ borderColor: clan.accentColor }}>
                      <AvatarImage src={mockMembers[0].avatar} alt={mockMembers[0].name} />
                      <AvatarFallback className="text-2xl">{mockMembers[0].name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{mockMembers[0].name}</h3>
                  <Badge 
                    className="mb-2" 
                    style={{ 
                      backgroundColor: `${clan.accentColor}20`,
                      color: clan.accentColor,
                      borderColor: clan.accentColor
                    }}
                  >
                    Founder & Commander
                  </Badge>
                  <div className="mt-4 p-4 rounded-2xl bg-background/60 backdrop-blur-sm">
                    <div className="text-3xl font-black mb-1">{mockMembers[0].mints}</div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wider">Total Mints</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Members */}
            <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
              <CardContent className="p-6">
                <h2 className="text-2xl font-black mb-6">Top Members</h2>
                <div className="space-y-3">
                  {mockMembers.slice(1, 6).map((member, index) => (
                    <div 
                      key={member.id} 
                      className="flex items-center gap-3 p-3 rounded-2xl bg-background/40 backdrop-blur-sm border border-border/30 hover:bg-background/60 hover:border-primary/30 transition-all duration-300 group"
                    >
                      <div className="relative">
                        <Avatar className="h-12 w-12 border-2 border-border group-hover:border-primary/50 transition-colors">
                          <AvatarImage src={member.avatar} alt={member.name} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        <div 
                          className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-background border-2 border-border flex items-center justify-center text-xs font-bold"
                          style={{ color: clan.accentColor }}
                        >
                          {index + 2}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold truncate">{member.name}</div>
                        <div className="text-xs text-muted-foreground">{member.rank}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{member.mints}</div>
                        <div className="text-xs text-muted-foreground">mints</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - About & Activity */}
          <div className="lg:col-span-2 space-y-8">

             {/* Invite Link Card */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-card/50 border-2 shadow-xl mb-6"
              style={{ borderColor: `${clan.accentColor}40` }}
            >
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `radial-gradient(circle at 80% 50%, ${clan.accentColor}, transparent 70%)`
                }}
              />
              <CardContent className="p-6 relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-xl" style={{ backgroundColor: `${clan.accentColor}20` }}>
                    <Share2 className="h-6 w-6" style={{ color: clan.accentColor }} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Share Clan Invite</h3>
                    <p className="text-sm text-muted-foreground">Invite others to join {clan.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 p-4 rounded-xl bg-background/60 backdrop-blur-sm border border-border/40 font-mono text-sm overflow-x-auto">
                    {inviteUrl}
                  </div>
                  <Button
                    size="lg"
                    onClick={handleCopyInvite}
                    className="px-6 py-6 font-bold transition-all duration-300 hover:scale-105"
                    style={{
                      background: copied ? 'hsl(var(--primary))' : `linear-gradient(135deg, ${clan.accentColor}, ${clan.accentColor}dd)`,
                      boxShadow: `0 10px 30px ${clan.accentColor}40`
                    }}
                  >
                    {copied ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-5 w-5 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* About Section */}
            <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-black mb-6">About the Clan</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  {clan.description}
                </p>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
              <CardContent className="p-8">
                <h2 className="text-3xl font-black mb-6">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="relative p-6 rounded-2xl bg-gradient-to-r from-purple-500/10 to-transparent border-l-4 border-purple-500 backdrop-blur-sm hover:from-purple-500/20 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-purple-500/20">
                        <Trophy className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="font-bold mb-1">Event Victory!</div>
                        <div className="text-sm text-muted-foreground">Won 'Pump Royale' event and earned bonus rewards</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-transparent border-l-4 border-green-500 backdrop-blur-sm hover:from-green-500/20 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-green-500/20">
                        <TrendingUp className="h-5 w-5 text-green-400" />
                      </div>
                      <div>
                        <div className="font-bold mb-1">Treasury Growth</div>
                        <div className="text-sm text-muted-foreground">Clan treasury grew by {clan.totalEarnings.toFixed(1)} SOL this month</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-transparent border-l-4 border-blue-500 backdrop-blur-sm hover:from-blue-500/20 transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-xl bg-blue-500/20">
                        <Users className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="font-bold mb-1">New Member</div>
                        <div className="text-sm text-muted-foreground">{mockMembers[4].name} joined the clan</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

import { Castle, Coins, Medal, UserPlus } from "lucide-react";

export const activityTypes = {
  new_clan: {
    title: "Clan Created",
    text: "{username} forged a new clan ({clan_name})",
    icon: Castle,
    iconClass: "text-purple-400",
    iconBoxClass: "bg-purple-500/20",
    mainClass: "from-purple-500/10 to-transparent border-l-4 border-purple-500 hover:from-purple-500/20",
  },

  clan_new_member: {
    title: "New Clan Member",
    text: "{username} joined {clan_name} clan",
    icon: UserPlus,
    iconClass: "text-green-400",
    iconBoxClass: "bg-green-500/20",
    mainClass: "from-green-500/10 to-transparent border-l-4 border-green-500 hover:from-green-500/20",
  },

  rank_claim: {
    title: "Rank Claimed",
    text: "{username} claimed a new rank!",
    icon:  Medal,
    iconClass: "text-blue-400",
    iconBoxClass: "bg-blue-500/20",
    mainClass: "from-blue-500/10 to-transparent border-l-4 border-blue-500 hover:from-blue-500/20",
  },

  token_mint: {
    title: "Token Minted",
    text: "{username} minted new tokens",
    icon: Coins,
    iconClass: "text-yellow-400",
    iconBoxClass: "bg-yellow-500/20",
    mainClass: "from-yellow-500/10 to-transparent border-l-4 border-yellow-500 hover:from-yellow-500/20",
  },
} as const;

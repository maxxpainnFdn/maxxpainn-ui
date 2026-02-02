import { tokenConfig } from "@/config/token";
import { activityTypes } from "@/data/activityTypes";
import { useReplaceWithNode } from "@/hooks/useReplaceWithNode";
import { useWalletCore } from "@/hooks/useWalletCore";
import utils from "@/lib/utils";
import { AccountData } from "@/types/AccountData";
import { ActivityData } from "@/types/ActivityData";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function ActivityCard({ activityInfo }: { activityInfo: ActivityData }) {
  
  //console.log("activityInfo===>", activityInfo)
  
  const connectedAccountAddr = useWalletCore().address;
  const activityTypeInfo = activityTypes[activityInfo.type];

  // 1. Prepare replacements object
  const replacements: Record<string, ReactNode> = {};

  // Handle main username
  replacements["username"] = getUsernameReplacement(activityInfo.account, connectedAccountAddr);

  // Handle specific fields based on activity type
  if (activityInfo.clan) {
    replacements["clan_name"] = (
      <Link
        to={`/clan/${activityInfo.clan.slug}-${activityInfo.clan.id}`}
        className="font-medium text-purple-400 hover:underline"
      >
        {activityInfo.clan.name}
      </Link>
    );
  }

  if (activityInfo.followedAccount) {
    replacements["followed_username"] = getUsernameReplacement(activityInfo.followedAccount, connectedAccountAddr);
  }
  
  if (["token_stake"].includes(activityInfo.type)) {
    const { amount, termDays } = activityInfo.params;
    replacements["token_amount"] = utils.toShortNumber(amount)
    replacements["token_symbol"] = tokenConfig.symbol.toUpperCase()
    replacements["stake_term"] = termDays
  }

  // 2. Call the hook at the top level of the component
  // Note: Remove curly braces from keys in your replacements object if your hook expects "username" instead of "{username}"
  // Assuming your hook strips braces from text but expects raw keys in the object:
  const textNode = useReplaceWithNode(activityTypeInfo.text, replacements);

  const Icon = activityTypeInfo.icon;

  return (
    <div className={`relative p-6 rounded-2xl bg-gradient-to-r ${activityTypeInfo.mainClass} backdrop-blur-sm transition-all duration-300`}>
      <div className="flex items-start gap-4">
        <div className={`p-2 rounded-xl ${activityTypeInfo.iconBoxClass}`}>
          <Icon className={`h-5 w-5 ${activityTypeInfo.iconClass}`} />
        </div>
        <div className="w-full flex items-center justify-between flex-wrap">
          <div>
            <div className="font-bold mb-1">{activityTypeInfo.title}</div>
            <div className="text-sm text-muted-foreground">
              {/* 3. Render the node directly, NOT as <Component /> */}
              {textNode}
            </div>
          </div>
          <div className="text-sm text-gray-500 font-mono">
            {utils.getRelativeDate(activityInfo.createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper for username link generation
const getUsernameReplacement = (
  accountInfo: AccountData,
  connectedAccountAddr?: string
) => {
  const isMe = connectedAccountAddr && connectedAccountAddr === accountInfo.address;
  const displayName = isMe ? "You" : `@${accountInfo.username}`;

  return (
    <Link
      to={`/profile/${accountInfo.username}`}
      className={`font-medium hover:underline ${isMe ? "text-white" : "text-gray-300"}`}
    >
      {displayName}
    </Link>
  );
};

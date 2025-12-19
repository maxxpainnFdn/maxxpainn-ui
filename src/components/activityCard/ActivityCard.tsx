import Activity from "@/core/Activity";
import { activityTypes } from "@/data/activityTypes";
import utils from "@/lib/utils";
import { AccountData } from "@/types/AccountData";
import { ActivityData } from "@/types/ActivityDate";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function ActivityCard({ activityInfo }: { activityInfo: ActivityData }) {


  const processedData = processActivity(activityInfo)

    const Icon = processedData.icon;

    return (
        <div key={activityInfo.id}
          className={`relative p-6 rounded-2xl bg-gradient-to-r ${processedData.mainClass} backdrop-blur-sm transition-all duration-300`}
        >
          <div className="flex items-start gap-4">
              <div className={`p-2 rounded-xl ${processedData.iconBoxClass}`}>
                  <Icon className={`h-5 w-5 ${processedData.iconClass}`} />
              </div>
              <div className="w-full flex items-center justify-between flex-wrap">
                <div>
                  <div className="font-bold mb-1">{ processedData.title } </div>
                  <div className="text-sm text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: processedData.text }}
                  />
                </div>
                <div className="text-sm text-gray-500 font-mono">
                  { utils.getRelativeDate(activityInfo.createdAt) }
                </div>
              </div>
          </div>
      </div>
    )
}

const processActivity = (
  activityInfo: ActivityData,
  currentUserAccountInfo?: AccountData
) => {

  let activityTypeInfo = activityTypes[activityInfo.type]

  let text = activityTypeInfo.text;
  //console.log("text===>", text)

  let accountInfo = activityInfo.account

  let profileHrefName = (currentUserAccountInfo != null && currentUserAccountInfo.id == accountInfo.id)
                          ? "You"
                          : "@" + accountInfo.username

  let accountProfile = `<a href="/profile/${accountInfo.username}">${profileHrefName}</Link>`

  text = text.replace("{username}", accountProfile)

  if(activityInfo.clan != null){
    const clan = activityInfo.clan
     text = text.replace("{clan_name}", `<a href="/clan/${clan.slug}-${clan.id}">${ clan.name }</a>`)
  }


  return {...activityTypeInfo, text }
}

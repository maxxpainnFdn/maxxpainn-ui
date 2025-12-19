import ApiQuery from "@/components/apiQuery/ApiQuery";
import { Badge, BadgeProps } from "@/components/badge/Badge";
import EmptyContent from "@/components/emptyContent/EmptyContent";
import { Medal, Trophy  } from "lucide-react";
import { useState } from "react";

export default function BadgesContent({ accountId }) {

  const [badges, setBadges ] = useState([])
  const [totalBadges, setTotalBadges] = useState(0)

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm border-2 border-purple-500/20 rounded-3xl p-8 shadow-xl">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h:8 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
          <Medal className="w-4 h-4 md:w-6 md:h-6 text-white" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold md:font-black text-white">
          Achievements <span className="text-purple-400">({totalBadges})</span>
        </h3>
      </div>
      <ApiQuery
        uri="/badges"
        query={{ accountId }}
        onSuccess={(result, pagingInfo) => {
          //console.log("pagingInfo==>", pagingInfo)
          setBadges(result)
          setTotalBadges(pagingInfo.totalCount)
        }}
      >
        {badges.length === 0 ? (
          <EmptyContent
            title="No badge found"
            message="This account hasn’t unlocked any achievements yet"
            icon={Trophy}
          />
        ) : (
          <div className="flex flex-wrap  justify-center gap-2">
            {badges.map((badge: BadgeProps) => (
              <div className="w-[300px]" key={badge.id}>
              <Badge
                key={badge.id}
                badge={{ ...badge, }}
              />
              </div>
            ))}
          </div>
        )}
      </ApiQuery>
    </div>
  );
}

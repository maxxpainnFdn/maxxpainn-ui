
import ActivityCard from "@/components/activityCard/ActivityCard";
import ApiQuery from "@/components/apiQuery/ApiQuery";
import EmptyContent from "@/components/emptyContent/EmptyContent";
import { Activity } from "lucide-react";
import { useState } from "react";

export default function ActivityContent({ accountId }) {

  const [activities, setActivities] = useState([])

  return (
    <div className="bg-maxx-bg1 border-2 border-purple-500/5 rounded-xl p-8 shadow-xl">
      <div className="flex px-1 md:px-3 items-center gap-3 mb-8">
        <div className="w-8 h-8 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
          <Activity className="w-4 h-6 md:w-6 md:h:-6 text-white" />
        </div>
        <h3 className="text-xl md:text-2xl font-bold md:font-black text-white">Activity History</h3>
      </div>
      <ApiQuery
        uri="/account/activities"
        query={{ activityAccountId: accountId }}
        onSuccess={(result) => {
          //console.log("result===>", result)
          setActivities(result)
        }}
      >
        { activities.length === 0 ? (
          <EmptyContent
            title="No activity found"
            message="This account has no activity"
            icon={Activity}
          />
        ) : (
          <div className=" w-full flex flex-col items-center">
            <div className="space-y-3 block w-full px-1 md:px-3">
              { activities.map((data, idx) => (
                <div key={data.id}>
                  <ActivityCard
                    activityInfo={data}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </ApiQuery>
    </div>
  );
}

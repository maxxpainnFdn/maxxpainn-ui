import { useState } from "react";
import ApiQuery from "../../apiQuery/ApiQuery.tsx";
import { Card, CardContent } from "../../ui/card";
import ActivityCard from "../../activityCard/ActivityCard";

export default function ClanActivityTab({ clan }) {
    
  const clanId = clan.id;
  const [activities, setActivities] = useState([])

  const onQuerySuccess = (dataArr) => {
    //console.log("dataArr==>", dataArr)
    setActivities(dataArr)
  }

    return (
      <Card className="bg-gradient-to-br from-card via-card to-card/50 border border-border/40 shadow-xl">
        <CardContent className="p-8">
            <h2 className="text-3xl font-black mb-6">Recent Activity</h2>
            <div className="space-y-3">
                <ApiQuery
                    uri={`/clans/${clanId}/activities`}
                    errorProps={{ className: "!scale-60", titleClassName: "font-medium !text-2xl" }}
                    onSuccess={onQuerySuccess}
                    key={clanId}
                    pagingType="full"
                >
                    <>
                        { activities.map((data, index)=> (
                          <ActivityCard
                            key={index}
                            activityInfo={data}
                          />
                        ))}
                    </>
                </ApiQuery>
            </div>
        </CardContent>
      </Card>

    )
}

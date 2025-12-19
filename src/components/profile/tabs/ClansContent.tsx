import ApiQuery from "@/components/apiQuery/ApiQuery";
import ClanCard from "@/components/clans/ClanCard";
import EmptyContent from "@/components/emptyContent/EmptyContent";
import {  Castle } from "lucide-react";
import { useState } from "react";

export default function ClansContent({ accountId }) {

  const [clans, setClans] = useState([])

  return (
    <div className="">
      <ApiQuery
        uri="/account/clan-memberships"
        query={{ memberAccountId: accountId }}
        onSuccess={(result) => {
          //console.log("result===>", result)
          setClans(result)
        }}
      >
        {clans.length === 0 ? (
          <EmptyContent
            title="No clans found"
            message="Account is not a member of any clan"
            icon={Castle}
          />
        ) : (
          <div className="flex flex-wrap justify-center gap-2">
            {clans.map((clan) => (
              <ClanCard key={clan.id} clan={clan} />
            ))}
          </div>
        )}
      </ApiQuery>
    </div>
  );
}

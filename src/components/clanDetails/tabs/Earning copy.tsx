import ApiQuery from "@/components/apiQuery/ApiQuery";
import { useState } from "react";

export default function Earning({ clan }) {
  
  const clanId = clan.id;
  
  const [dataArr, setDataArr] = useState([])

  const onQuerySuccess = (resultArr) => {
    setDataArr(resultArr)
  }

  
  return (
    <ApiQuery
      uri={`/clans/${clanId}/earning`}
      errorProps={{ className: "!scale-60", titleClassName: "font-medium !text-2xl" }}
      onSuccess={onQuerySuccess}
      key={clanId}
    >
      <>
        { dataArr.map((data, index)=> (
          <></>
        ))}
      </>
    </ApiQuery>
  )
}

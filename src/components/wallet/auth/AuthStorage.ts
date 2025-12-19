import { CaipNetworkId } from '@reown/appkit'
import type { SIWXSession, SIWXStorage } from '@reown/appkit-siwx'
import http from "@/core/HttpClient";
import utils from '@/lib/utils';
import toast from '@/hooks/toast';


export class AuthStorage implements SIWXStorage {
  
   async add(session: SIWXSession): Promise<void> {
     try {

        let resultStatus = await http.post("/auth/add-session", { session })

        if(resultStatus.isError()) {
            toast.error("Failed to save wallet session")
            utils.logError(null, `AuthStorage#add:${resultStatus.getMessage()}`)
            return;
        }

     } catch(e){
        utils.logError("AuthStorage#add:", e)
     }
   }

  async set(sessions: SIWXSession[]): Promise<void> {
     try {

        let resultStatus = await http.post("/auth/replace-session", { sessions })

        if(resultStatus.isError()) {
            toast.error("Failed to save wallet session")
            utils.logError(null, `AuthStorage#add:${resultStatus.getMessage()}`)
            return;
        }

     } catch(e){
        utils.logError("AuthStorage#add:", e)
     }
  }

  async get(chainId: CaipNetworkId, accountAddress: string): Promise<SIWXSession[]> {
    try {

        let resultStatus = await http.get("/auth/sessions", { chainId, accountAddress })

        if(resultStatus.isError()){
            utils.logError(null, `AuthStorage#get:${resultStatus.getMessage()}`)
            toast.error("Session expired")
            return []
        }

        let resultData = resultStatus.getData() as SIWXSession[]

        //console.log("resultData===>", resultData)

        if(resultData == null) return []

        let filtered = resultData.filter(sess => (
            sess.data.chainId == chainId && 
            sess.data.accountAddress == accountAddress.toString()
        ))

        //console.log("filtered==>", filtered)

        return filtered
    } catch(e){
        utils.logError("AuthStorage#get:", e)
        return []
    }
  }

  async delete(chainId: string, accountAddress: string): Promise<void> {
    try {

      let resultStatus = await http.post("/auth/delete-session", { chainId, accountAddress })

        if(resultStatus.isError()){
          utils.logError(null, `AuthStorage#delete:${resultStatus.getMessage()}`)
          return;
        }

    } catch(e){
        utils.logError("AuthStorage#delete:", e)
    }
  }

  
}
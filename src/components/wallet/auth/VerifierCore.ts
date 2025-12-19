import EventBus from "@/core/EventBus";
import http from "@/core/HttpClient";
import toast from "@/hooks/toast";


export default class VerifierCore {


    static async verify(chain, session) {

        try {

            let resultStatus = await http.post("/auth/verify", { chain, session })

            //console.log("resultStatus===>", resultStatus)

            if(resultStatus.isError()){
                toast.error("Authentication Failed",{
                    description: resultStatus.getMessage()
                })

                return false;
            }

            let resultData = resultStatus.getData() || null 

            if(resultData == null) {
                return false
            }

            EventBus.emit("LOGIN_SUCCESSFUL")

            return true;
        } catch(e){
            return false;
        }
    }
}
import http from "@/core/HttpClient";
import utils from "@/lib/utils";
import toast from "@/hooks/toast";

export default class AuthCore {
    
    static async getNonce({ chainId, accountAddress }): Promise<string | undefined> {
            
        let status = await http.post("/auth/nonce", { chainId, accountAddress });
        
        if(status.isError()){

            toast.error("Authentication Error", {
                description: status.getMessage(),
                duration: 5000
            });

            throw Error(status.getMessage());
        }

        let nonce = status.getData() as string;

        return nonce
    }

    static async doLogout() {
        try {

            let status = await http.post("/auth/logout");
            
            if(status.isSuccess()){
                toast.success("Wallet disconnected")
            }

        } catch(e){
            utils.logError("AuthCore#doLogout:", e)
        }
    }


}
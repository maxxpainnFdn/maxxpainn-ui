import { useState } from "react";
import EnsureConnected from "../ensureConnected/EnsureConnected";
import { Button, ButtonProps } from "../ui/button";
import toast from "@/hooks/toast";
import { confirmToast } from "@/hooks/confirmToast";
import { useApi } from "@/hooks/useApi";
import { ClanData } from "@/types/ClanData";
import { useWalletCore } from "@/hooks/useWalletCore";

export  interface JoinClanBtnProps  extends ButtonProps {
    clanId: number;
    isMember: boolean;
    clanName: string;
    onSuccess: (data: ClanData) => void;
    props?: any
}
export default function JoinClanBtn({ clanId, clanName, isMember, onSuccess, ...props } : JoinClanBtnProps ) {

    const [loading, setLoading] = useState(false);

    const api = useApi()
    const { isConnected } = useWalletCore()

    const handleJoinClan =  async () => {

        let uri = ""

        if(!isConnected){
            toast.error("Connect wallet to continue")
            return
        }

        let successMsg = ""

        if(isMember){

            uri = `/clans/${clanId}/leave`
            let confirm = await confirmToast({ title: "Leave Clan ?", description: `You will be removed from ${clanName}`})

            if(!confirm) return;

            successMsg = `You’ve successfully left ${clanName}.`
        } else {
            uri = `/clans/${clanId}/join`
            successMsg = `Welcome aboard! You’ve joined ${clanName}.`
        }

        setLoading(true)

        let result = await api.post(uri)

        setLoading(false);

        if(result.isError()) {
            toast.error(result.getMessage())
            return;
        }

        let clanData = result.getData() as ClanData;

        onSuccess(clanData)

        toast.success(successMsg)
    }

    return (
        <Button
            {...props}
            onClick={handleJoinClan}
            loading={loading}
        >
            {isMember ? "Leave Clan" : "Join Clan"}
        </Button>
    )
}

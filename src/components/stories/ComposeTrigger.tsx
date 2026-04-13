import { Pencil } from "lucide-react";
import { useAtomValue } from "jotai";
import { userAccountInfoAtom } from "@/store";
import ImageAvatar from "../ImageAvatar";
import utils from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function ComposeTrigger() {
  
  const navigate = useNavigate();
  const userAccount = useAtomValue(userAccountInfoAtom);
    
  return (
    <button
      onClick={() => navigate("/mint")}
      className="w-full text-left group mb-4 relative overflow-hidden rounded-[18px] bg-maxx-bg2/90 border border-maxx-violet/[0.14] cursor-pointer transition-[border-color,background] duration-300 hover:border-maxx-violet/[0.36] hover:bg-maxx-bg1 px-[18px] py-[14px]"
    >
      <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-maxx-violet to-transparent" />
      <div className="flex items-center gap-3">
        <ImageAvatar
          className="h-[36px] w-[36px] mx-auto border-4 shadow-2xl round"
          src={utils.getServerImage(userAccount?.photo ?? "", "profile/photo", "tiny")}
          alt=""
          seed={userAccount?.address ?? "0x"}
          size={36}
        />
        <span className="flex-1 font-medium text-[1rem] text-maxx-violetLt/70 font-sans">Share your story & earn...</span>
        <div className="hidden sm:flex items-center gap-2">
          <div className="flex items-center gap-1.5 font-mono font-bold rounded-lg px-3 py-1.5 bg-maxx-violet/10 text-maxx-violet-lt text-[0.68rem] tracking-[0.06em] uppercase">
            <Pencil size={11} /> Post
          </div>
        </div>
      </div>
    </button>
  );
}

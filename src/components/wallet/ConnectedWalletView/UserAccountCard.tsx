import { CopyBtn } from "@/components/copyBtn/CopyBtn";
import ImageAvatar from "@/components/ImageAvatar";
import LoadingView from "@/components/loadingView/LoadingView";
import EventBus from "@/core/EventBus";
import { useUserAccount } from "@/hooks/useUserAccount";
import utils from "@/lib/utils";
import { avataaars } from "@dicebear/collection";
import { ChevronRight, User } from "lucide-react";


export interface setModalOpen {
  inputBgClass: string;
  setModalOpen: (boolean) => void;
}

export default function UserAccountCard ({
  inputBgClass,
  setModalOpen
}) {

  const { userAccountInfo, isFetchingAccount } = useUserAccount()

  const acctInfo = userAccountInfo;

  const handleClick = (e) => {

    if(e.target.classList.contains("copybtn")){
      return;
    }

    setModalOpen(false);
    EventBus.emit("navigate","/account")
  }

  return (
    <LoadingView loading={isFetchingAccount}>
      { acctInfo && (
        <div
          onClick={handleClick}
          className={`
            ${inputBgClass} rounded-xl p-4 border w-full text-left
            hover:border-purple-500/30 transition-all duration-300 group
            cursor-pointer select-none focus:outline-none
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
              <User className="w-3 h-3" />
              Account
            </p>
            <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all" />
          </div>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <ImageAvatar
                src={utils.getServerImage(acctInfo.photo as string, "profile/photo", "normal")}
                seed={acctInfo.address}
                avatarType={ avataaars }
                radius={0}
                className="w-10 h-10 rounded-lg object-cover border-2 border-purple-500/30"
                fallbackTextClass="bg-none"
              />
            </div>
            {/* User Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div>
                  <div className="flex items-center gap-x-2 text-white font-medium text-md truncate">
                    <div>@{acctInfo.username }</div>
                    {acctInfo.username && (
                      <CopyBtn
                        textToCopy={acctInfo.username}
                        className="copybtn relative z-10 p-2 bg-none  hover:bg-white/10 rounded-lg text-gray-400"
                        copiedClassName="copybtn relative z-10 p-2 bg-none text-green-600 rounded-lg"
                      />
                    )}
                  </div>
                  <div className="text-[11px] font-semibold text-gray-500">
                    { acctInfo.mintCount } Mints
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </LoadingView>
  )
}

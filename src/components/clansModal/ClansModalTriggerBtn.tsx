import { ClanData } from "@/types/ClanData";
import { ChevronRight } from "lucide-react";
import ImageAvatar from "../ImageAvatar";
import utils from "@/lib/utils";

export default function ClansModalTriggerBtn({ selectedClan }: { selectedClan: ClanData }) {

    let color1 = ""
    let color2 = ""

    if(selectedClan) {
      color1 = selectedClan.accentColor[0];
      color2 = selectedClan.accentColor[1];
    }

    return (
      <div className="relative bg-gray-800/60 border-2 border-purple-500/30 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-purple-500/60 hover:transform hover:translate-y-[-2px] hover:shadow-[0_12px_32px_rgba(168,85,247,0.25)] group overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10 flex items-center gap-5">
          { selectedClan ? (
            <>
              <div>
                <ImageAvatar
                  src={utils.getServerImage(selectedClan.image, "clans", "small")}
                  fallbackText={selectedClan.name}
                  className="w-16 h-16. flex items-center justify-center  flex-shrink-0 shadow-lg shadow-black/30 object-cover text-3xl  font-bold rounded-xl"
                  fallbackTextClass="bg-none"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xl font-bold text-white mb-1">
                  {selectedClan.name}
                </div>
                <div className="text-sm text-gray-400">
                  {selectedClan.tagline}
                </div>
                </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-3xl flex-shrink-0 shadow-lg">
                🏰
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-white mb-1">
                  Choose Your Clan
                </div>
                <div className="text-sm text-gray-400">
                  Stand with your clan. Mint with purpose
                </div>
              </div>
            </>
          )}

          <ChevronRight className="w-6 h-6 text-purple-400 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    )
}

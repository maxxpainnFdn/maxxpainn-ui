import { ClanData } from "@/types/ClanData";
import { ChevronRight, Castle } from "lucide-react";
import ImageAvatar from "../ImageAvatar";
import utils from "@/lib/utils";

export default function ClansModalTriggerBtn({ selectedClan, disabled = false }: { selectedClan: ClanData, disabled: boolean }) {
    const color1 = selectedClan?.accentColor?.[0] ?? null;
    const color2 = selectedClan?.accentColor?.[1] ?? null;

    return (
        <div className="
          relative bg-maxx-bg0/60 border border-maxx-violet/20 rounded-lg p-5 cursor-pointer
          transition-all duration-300
          hover:border-maxx-violet/50 hover:-translate-y-px
          hover:shadow-[0_12px_32px_rgba(139,92,246,0.15)]
          group overflow-hidden
        ">
          {/* top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* hover tint */}
          <div className="absolute inset-0 bg-maxx-violet/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

          {/* dynamic accent bar from selected clan */}
          {selectedClan && color1 && color2 && (
              <div
                  className="absolute bottom-0 left-0 right-0 h-[2px] opacity-70"
                  style={{ background: `linear-gradient(90deg, transparent, ${color1}, ${color2}, transparent)` }}
              />
          )}

            <div className="relative z-10 flex flex-col text-center sm:text-left sm:flex-row items-center gap-5">

              {selectedClan ? (
                <>
                  {/* avatar */}
                  <div className="shrink-0">
                    <ImageAvatar
                      src={utils.getServerImage(selectedClan.image, "clans", "small")}
                      fallbackText={selectedClan.name}
                      className="w-14 h-14 rounded-md object-cover text-2xl font-bold shadow-lg shadow-black/30 flex items-center justify-center"
                      fallbackTextClass="bg-none"
                    />
                  </div>

                  {/* info */}
                  <div className="flex-1 min-w-0">
                      <div className="font-sans font-bold text-[1.05rem] text-maxx-white truncate">
                        {selectedClan.name}
                      </div>
                      <div className="font-sans text-[0.88rem] text-maxx-mid truncate mt-0.5">
                        {selectedClan.tagline}
                      </div>
                  </div>
              </>
            ) : (
              <>
                {/* placeholder icon */}
                <div className="w-14 h-14 rounded-md bg-grad-btn flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-maxx-pink/20">
                  <Castle size={22} className="text-maxx-white" />
                </div>

                {/* placeholder text */}
                <div className="flex-1">
                  <div className="font-sans font-bold text-[1.05rem] text-maxx-white">
                    Choose Your Clan
                  </div>
                  <div className="font-sans text-[0.88rem] text-maxx-mid mt-0.5">
                    Stand with your clan. Mint with purpose.
                  </div>
                </div>
              </>
            )}

            { !disabled &&
              <ChevronRight
                size={18}
                className="text-maxx-violet shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            }
          </div>
        </div>
    );
}

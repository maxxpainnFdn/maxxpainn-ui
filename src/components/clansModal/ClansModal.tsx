// ClansModal.tsx

import { ReactNode, useEffect, useState } from "react";
import { Castle } from "lucide-react";
import ClansSearch from "../clans/ClansSearch";
import ClansModalTriggerBtn from "./ClansModalTriggerBtn";
import ApiQuery from "../apiQuery/ApiQuery.tsx";
import { ClanData } from "@/types/ClanData";
import ClanCard from "../clans/ClanCard";
import Modal from "../modal/Modal";

export interface ClansModalProps {
  children?: ReactNode | any;
  disabled?: boolean;
  defaultClan?: ClanData | null;
  onChange: (clan: ClanData) => void;
}

export default function ClansModal({
  children,
  disabled = false,
  defaultClan = null,
  onChange,
}: ClansModalProps) {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedClan, setSelectedClan] = useState(defaultClan);
  const [clans, setClans] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [queryKey, setQueryKey] = useState(0);

  useEffect(() => { setQueryKey(Date.now()); }, [sortBy, searchKeyword]);

  const handleOnClanClick = (clan) => {
    setSelectedClan(clan);
    onChange(clan);
    setDialogOpen(false);
  };

  const Title = () => (
    <div>
      <div className="eyebrow mb-1 sm:mb-1.5">
        <span className="eyebrow-dot" />
        PICK YOUR ALLEGIANCE
      </div>
      <h1 className="font-sans font-black text-lg sm:text-xl md:text-3xl uppercase tracking-tight text-maxx-white leading-none">
        Choose a Clan
      </h1>
    </div>
  );

  return (
    <>
      <div onClick={() => { if (disabled) return; setDialogOpen(true); }}>
        {children ?? <ClansModalTriggerBtn selectedClan={selectedClan} disabled={disabled} />}
      </div>

      <Modal
        open={isDialogOpen}
        onOpenChange={setDialogOpen}
        title={<Title />}
        desktopClass="w-full max-w-[1200px]"
        description="Selected clan earns sol rewards"
        desktopDialogProps={{ onOpenAutoFocus: (e) => e.preventDefault() }}
      >
        <div className="overflow-y-auto z-10 -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 px-4 sm:px-6 pt-2 bg-maxx-bg1">
          <div className="absolute inset-0 pointer-events-none bg-noise-pattern opacity-100 z-0" />
          <div className="absolute -top-10 -right-10 w-64 h-64 bg-[radial-gradient(circle,rgba(139,92,246,0.07)_0%,transparent_65%)] pointer-events-none z-0" />

          {/* Search bar */}
          <div className="relative z-10 flex mt-2 sm:mt-3 flex-col xs:flex-row justify-between items-stretch lg:items-center gap-2.5 sm:gap-3 mb-4 sm:mb-6 pb-4 sm:pb-5 border-b border-maxx-violet/15">
            <ClansSearch onChange={(v) => setSearchKeyword(v)} />
          </div>

          {/* Results */}
          <div className="relative z-10">
            <ApiQuery
              uri="/clans"
              query={{ sortBy, search: searchKeyword }}
              onSuccess={(clansArr) => setClans(clansArr)}
              loaderProps={{ className: "overflow-hidden p-1" }}
              key={queryKey}
            >
              {clans.length === 0 ? (
                <div className="text-center py-12 sm:py-20">
                  <div className="relative inline-block mb-4 sm:mb-5">
                    <Castle className="w-10 h-10 sm:w-14 sm:h-14 text-maxx-violet mx-auto opacity-35" />
                    <div className="absolute inset-0 bg-maxx-violet blur-2xl opacity-10 rounded-full" />
                  </div>
                  <h3 className="font-sans font-bold text-sm sm:text-base text-maxx-white mb-1">
                    No clans found
                  </h3>
                  <p className="font-sans text-xs sm:text-sm text-maxx-mid">
                    Try adjusting your search or join at least one clan first
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap justify-center gap-2 sm:gap-3 pb-4 sm:pb-6">
                  {clans.map((clan) => (
                    <ClanCard
                      key={clan.id}
                      clan={clan}
                      onItemClick={handleOnClanClick}
                      showJoinBtn={false}
                      showSelectBtn={true}
                    />
                  ))}
                </div>
              )}
            </ApiQuery>
          </div>
        </div>
      </Modal>
    </>
  );
}

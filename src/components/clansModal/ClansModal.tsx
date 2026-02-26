import { ReactNode, useEffect, useState } from "react"
import { Castle } from "lucide-react"
import ClansSearch from "../clans/ClansSearch";
import ClansModalTriggerBtn from "./ClansModalTriggerBtn";
import ApiQuery from "../apiQuery/ApiQuery";
import { ClanData } from "@/types/ClanData";
import ClansSorter from "../clans/ClansSorter";
import ClanCard from "../clans/ClanCard";
import Modal from "../modal/Modal";

export interface ClansModalProps {
    children?: ReactNode | any;
    onChange: (clan: ClanData) => void;
}

export default function ClansModal({ children, onChange }: ClansModalProps) {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedClan, setSelectedClan] = useState(null);
    const [clans, setClans] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [queryKey, setQueryKey] = useState(0);

    useEffect(() => {
        setQueryKey(Date.now());
    }, [sortBy, searchKeyword]);

    const handleOnClanClick = (clan) => {
        setSelectedClan(clan);
        onChange(clan);
        setDialogOpen(false);
    };

    const Title = () => (
        <div>
            <div className="eyebrow mb-1"><span className="eyebrow-dot" />PICK YOUR ALLEGIANCE</div>
            <h1 className="font-sans font-black text-[clamp(1.8rem,4vw,3rem)] uppercase tracking-tight text-maxx-white leading-none">
                Choose a{" "}
                <span className="bg-grad-accent bg-clip-text text-transparent">Clan</span>
            </h1>
        </div>
    );

    return (
        <>
            <div onClick={() => setDialogOpen(true)}>
                {children ? children : <ClansModalTriggerBtn selectedClan={selectedClan} />}
            </div>
            <Modal
                open={isDialogOpen}
                onOpenChange={setDialogOpen}
                title={<Title />}
                desktopClass="w-full max-w-[80%] top-[18%]"
                description="Prove your allegiance to your clan. The clan you select earns SOL rewards."
                desktopDialogProps={{
                    onOpenAutoFocus: (e) => e.preventDefault(),
                }}
            >
                <div className="overflow-y-auto z-10">

                    {/* Filter & Sort Bar */}
                    <div className="flex flex-col xs:flex-row justify-between items-stretch lg:items-center gap-4 mb-8">
                        <ClansSearch onChange={(v) => setSearchKeyword(v)} />
                        <ClansSorter onChange={(value) => setSortBy(value)} />
                    </div>

                    <ApiQuery
                        uri="/clans"
                        query={{ sortBy, search: searchKeyword }}
                        onSuccess={(clansArr) => setClans(clansArr)}
                        loaderProps={{ className: "overflow-hidden p-1" }}
                        key={queryKey}
                    >
                        {clans.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="relative inline-block mb-6">
                                    <Castle className="w-16 h-16 text-maxx-violet mx-auto opacity-40" />
                                    <div className="absolute inset-0 bg-maxx-violet blur-2xl opacity-10" />
                                </div>
                                <h3 className="font-sans font-bold text-[1.2rem] text-maxx-white mb-2">
                                    No clans found
                                </h3>
                                <p className="font-sans text-[0.95rem] text-maxx-mid">
                                    Try adjusting your search or join at least one clan
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-wrap justify-center gap-3">
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
            </Modal>
        </>
    );
}

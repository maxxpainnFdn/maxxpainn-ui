import { ReactNode, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from "../ui/button"
import { Castle, ChevronDown, Plus } from "lucide-react"
import ClansSearch from "../clans/ClansSearch";
import FeaturedClansSlider from "../clans/FeaturedClansSlider";
import ClansModalTriggerBtn from "./ClansModalTriggerBtn";
import ApiQuery from "../apiQuery/ApiQuery";
import { ClanData } from "@/types/ClanData";
import ClansSorter from "../clans/ClansSorter";
import ClanCard from "../clans/ClanCard";

export interface ClansModalProps {
    children?: ReactNode | any,
    onChange: (clan: ClanData) => void;
}

export default function ClansModal ({ children, onChange }: ClansModalProps) {

    const [isDialogOpen, setDialogOpen] = useState(false)
    const [selectedClan, setSelectedClan] = useState(null)
    const [clans, setClans] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [queryKey, setQueryKey] = useState(0)


    useEffect(()=>{
        setQueryKey(Date.now())
    }, [sortBy, searchKeyword])

    const handleOnClanClick = (clan) => {
        setSelectedClan(clan)
        onChange(clan)
        setDialogOpen(false)
    }

    return (
        <Dialog
            open={isDialogOpen}
            onOpenChange={setDialogOpen}
            modal={true}
        >
            <DialogTrigger className="w-full text-start">
                   { children ? children : <ClansModalTriggerBtn selectedClan={selectedClan} />}
            </DialogTrigger>
            <DialogContent className="bg-card border-borderflex flex-col overflow-x-hidden max-w-4xl max-h-[90vh]" >
                <DialogHeader>
                    <DialogTitle>
                         <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                            Clans
                        </h1>
                    </DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="overflow-y-auto  z-10">

                    <div><FeaturedClansSlider /></div>

                    {/* Filter & Sort Bar */}
                    <div className="flex flex-col xs:flex-row justify-between items-stretch lg:items-center gap-4 mb-10">
                        <ClansSearch onChange={(v) => setSearchKeyword(v)} />
                        <ClansSorter onChange={(value) => setSortBy(value)} />
                    </div>

                    <div>
                        <ApiQuery
                            uri="/clans"
                            query={{ sortBy, search: searchKeyword }}
                            onSuccess={(clansArr) => setClans(clansArr) }
                            loaderProps={{ className: "overflow-hidden p-1" }}
                            key={queryKey}
                        >
                             {clans.length === 0 ? (
                                <div className="text-center py-20">
                                    <div className="relative inline-block mb-6">
                                        <Castle className="w-20 h-20 text-purple-400 mx-auto opacity-50" />
                                        <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20"></div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">No clans found</h3>
                                    <p className="text-gray-400 text-lg">Try joining atleast one clan</p>
                                </div>
                                ) : (
                                    <div className="relative flex flex-wrap justify-center gap-3">
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
                                )
                            }
                        </ApiQuery>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

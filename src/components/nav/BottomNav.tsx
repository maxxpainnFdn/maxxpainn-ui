import { Link } from "react-router-dom";
import Account from "./Account";
import { Zap } from "lucide-react";
import app from "@/config/app";
import Button from "../button/Button";

export default function BottomNav() {
    return (
        <div className="bottom-nav w-full fixed z-20 bottom-0 left-0 right-0 bg-gray-950/90 backdrop-blur-xl border-t border-white/10 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] pb-safe">
            <div className="w-full mx-auto px-3 py-3">

                <div className="flex items-center gap-2 w-full">

                    {/* 1. Desktop Logo (Hidden on mobile)
                    <Zap className="text-purple-500 w-6 h-6 hidden screen-width-900:block mr-auto" fill="currentColor" />
                        */}
                    {/* 2. BUY BUTTON - Secondary Priority */}
                    {/* flex-1 makes it take up 1 'unit' of space */}
                    <a
                        href={app.tokenBuyUrl}
                        className="flex-1 screen-width-900:hidden"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {/* Using 'secondary' (dark) so it doesn't distract from Mint */}
                        <Button variant="secondary" size="md" flat fullWidth className="h-12">
                            <span className="tracking-wide">BUY</span>
                        </Button>
                    </a>

                    {/* 3. MINT BUTTON - MAIN PRIORITY */}
                    {/* flex-[2] makes it take up 2 'units' of space (Twice as big as Buy) */}
                    <Link to="/mint" className="flex-[2] ">
                      <Button variant="primary2" size="md" flat fullWidth
                        className="h-12 shadow-purple-500/20 hover:scale-100 active:scale-100"
                      >
                          <span className="tracking-wide">MINT</span>
                      </Button>
                    </Link>

                    {/* 4. CONNECT - Icon Only */}
                    <div className="flex-1">
                        <Account btnProps={{ fullWidth: true }} />
                    </div>
                </div>
            </div>
        </div>
    )
}

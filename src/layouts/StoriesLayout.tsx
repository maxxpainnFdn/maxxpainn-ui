/**
 * MAXXPAINN — Stories Page (v3 — Tailwind)
 * All inline styles converted to Tailwind classes.
 * Only 6 style= remain: avatar dynamic colors, SVG fill transition,
 * and 4 radial-gradient glows (no Tailwind equivalent).
 */

import { Suspense, useState } from "react";
import RightPanel from "@/components/stories/RightPanel";
import MobileSidebarDrawer from "@/components/stories/MobileSidebarDrawer";
import LeftSidebar from "@/components/stories/LeftSidebar";
import SearchModal from "@/components/stories/SearchModal";
import Navigation from "@/components/nav/Navigation";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/spinner/Spinner";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function StoriesLayout() {
  
  const [activeTab, setActiveTab]   = useState("foryou");
  const [showSearch, setShowSearch] = useState(false);
  const [showSidebar, setShowSB]    = useState(false);

  return (
    <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden pt-[0px]">
      
      {/* Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />
      <div className="fixed -top-32 -right-32 w-[600px] h-[600px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle,rgba(255,45,120,0.055) 0%,transparent 60%)" }} />
      <div className="fixed top-1/3 -left-20 w-[480px] h-[480px] pointer-events-none z-0"
        style={{ background: "radial-gradient(circle,rgba(139,92,246,0.05) 0%,transparent 65%)" }} />

      {/* Sub-header  <SubHeader onMenuClick={e => setShowSB(true)} /> */}
      
       <Navigation />
      
      {/* Body */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 mt-10 pt-12 pb-16 flex gap-5 items-start">
        
        <div className="hidden lg:block relative flex-shrink-0 w-[210px]">
          <div className="relative">
            <div className="fixed top-[100px] w-[210px]">
              <LeftSidebar />
            </div>
          </div>
        </div>
        

        <main className="flex-1 min-w-0">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>
        
        <div className="hidden lg:block flex-shrink-0 w-[268px]">
          <div className="relative">
            <div className="fixed top-[100px] w-[268px]">
              <RightPanel />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showSidebar && (<MobileSidebarDrawer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowSB(false)}
        />
      )}
      
      { showSearch  && <SearchModal posts={[]} onClose={() => setShowSearch(false)} />}
    </div>
  );
}

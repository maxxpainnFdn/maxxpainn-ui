/**
 * MAXXPAINN — Stories Page (v3 — Tailwind)
 * All inline styles converted to Tailwind classes.
 * Only 6 style= remain: avatar dynamic colors, SVG fill transition,
 * and 4 radial-gradient glows (no Tailwind equivalent).
 */

import { Suspense, useState } from "react";
import PostTypePicker from "@/components/posts/PostTypePicker";
import FeedsRightPanel from "@/components/posts/FeedsRightPanel";
import MobileSidebarDrawer from "@/components/posts/MobileSidebarDrawer";
import LeftSidebar from "@/components/posts/LeftSidebar";
import SearchModal from "@/components/posts/SearchModal";
import ComposeModal from "@/components/posts/ComposeModal";
import Navigation from "@/components/nav/Navigation";
import { Outlet } from "react-router-dom";
import Spinner from "@/components/spinner/Spinner";


/* ─────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────── */
export default function PostsLayout() {
  
  const [activeTab, setActiveTab]   = useState("foryou");
  const [showTypePicker, setShowTP] = useState(false);
  const [composeType, setCompType] = useState<"normal" | "rewarded" | null>(null);
  const [showComposeModal, setShowCM] = useState(false);
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
        
        <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 min-w-0">
          <Suspense fallback={<Spinner />}>
            <Outlet />
          </Suspense>
        </main>

        <FeedsRightPanel />
      </div>

      {/* Modals */}
      {showSidebar && (<MobileSidebarDrawer
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onClose={() => setShowSB(false)}
        />
      )}
      <PostTypePicker
        isOpen={showTypePicker}
        onSelect={t => {
          setShowTP(false);
          setCompType(t);
          setShowCM(true);
        }}
        onClose={() => setShowTP(false)}
      />
      <ComposeModal
        isOpen={showComposeModal}
        type={composeType}
        onPost={()=>{}}
        onClose={() => {
          setCompType(null);
          setShowCM(false)
        }}
      />
      { showSearch  && <SearchModal posts={[]} onClose={() => setShowSearch(false)} />}
    </div>
  );
}

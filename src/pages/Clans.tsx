import React, { useState, useEffect } from "react";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/Footer";
import { Castle } from "lucide-react";
import ClanStats from "@/components/clans/ClanStats";
import ClanCard from "@/components/clans/ClanCard";
import ApiQuery from "@/components/apiQuery/ApiQuery";
import CreateClan from "@/components/clans/CreateClan";
import ClansSorter from "@/components/clans/ClansSorter";
import ClansSearch from "@/components/clans/ClansSearch";
import { Helmet } from "react-helmet-async";
import ClanCategorySelect from "@/components/clans/ClanCategorySelect";
import ApiQueryV2 from "@/components/apiQuery/ApiQueryV2";
import { ClanData } from "@/types/ClanData";

/* ── Inject once ── */
let _pgInjected = false;
function injectPageStyles() {
  if (_pgInjected || typeof document === "undefined") return;
  _pgInjected = true;
  const s = document.createElement("style");
  s.textContent = `
    @keyframes _cl-float {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-12px); }
    }
    @keyframes _cl-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes _cl-icon-glow {
      0%, 100% { box-shadow: 0 0 20px -4px rgba(168,85,247,0.4); }
      50%      { box-shadow: 0 0 36px -4px rgba(168,85,247,0.6); }
    }
    @keyframes _cl-gradient-shift {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    ._cl-title {
      background-size: 200% auto;
      animation: _cl-gradient-shift 6s ease infinite;
    }
  `;
  document.head.appendChild(s);
}

const Clans = () => {
  
  const [searchKeyword, setSearchKeyword] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [queryKey, setQueryKey] = useState(0);

  useEffect(injectPageStyles, []);

  useEffect(() => {
    setQueryKey(Date.now());
  }, [sortBy, searchKeyword]);


  const title =
    "MaxxPainn Clans - Create your community & earn upto $1 per mint";
  const description =
    "Join a MaxxPainn Clan and show your allegiance during minting. Clans earn upto $1 for every mint when selected by members. Build your community. Earn together.";
  
  const catAndSorterClass = `
    w-full h-12 px-4 rounded-xl text-sm font-medium
     bg-white/[0.03] border border-white/[0.06] 
    text-gray-400 hover:border-white/[0.12] hover:text-gray-300
  `
  
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://maxxpainn.com/manifesto"
        />
        <meta
          property="og:image"
          content="https://maxxpainn.com/images/pages/clans.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta
          name="twitter:image"
          content="https://maxxpainn.com/images/pages/clans.jpg"
        />
      </Helmet>

      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "MaxxPainn Clans",
          description:
            "Communities that earn per mint when selected during token minting.",
        })}
      </script>

      <div className="min-h-screen bg-maxx-bg0 overflow-x-hidden">
        {/* noise */}
        <div className="fixed inset-0 pointer-events-none z-0 bg-noise-pattern opacity-100" />

        {/* ambient glows — larger, more layered */}
        <div className="fixed -top-40 -right-40 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(255,45,120,0.06)_0%,transparent_60%)] pointer-events-none z-0" />
        <div className="fixed top-[28%] -left-28 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(139,92,246,0.055)_0%,transparent_65%)] pointer-events-none z-0" />
        <div className="fixed bottom-[10%] right-[10%] w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(168,85,247,0.04)_0%,transparent_70%)] pointer-events-none z-0" />

        <Navigation />

        <main className="pt-32 pb-20">
          <div className="max-w-7xl px-4 mx-auto">
            {/* ═══ Header ═══ */}
            <div
              className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-14"
              style={{ animation: "_cl-fade-up 0.6s ease both" }}
            >
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <div
                    className="relative p-3.5 rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600"
                    style={{ animation: "_cl-icon-glow 3s ease-in-out infinite" }}
                  >
                    <Castle className="w-8 h-8 text-white" />
                  </div>
                  <h1
                    className="_cl-title text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
                  >
                    Clans
                  </h1>
                </div>
                <p className="text-gray-400 text-lg md:text-xl ml-1 max-w-lg">
                  Build your community, grow your empire & earn SOL
                </p>
              </div>
              <CreateClan />
            </div>

            {/* ═══ Stats ═══ */}
            <div style={{ animation: "_cl-fade-up 0.6s ease 0.1s both" }}>
              <ClanStats />
            </div>

            {/* ═══ Filter / Sort ═══ */}
            <div
              className="flex flex-col md:flex-row justify-between items-stretch lg:items-center gap-4 mb-10"
              style={{ animation: "_cl-fade-up 0.6s ease 0.2s both" }}
            >
              <div className="w-full md:w-[280px]">
                <ClansSearch onChange={(v) => setSearchKeyword(v)} />
              </div>
              <div className="flex gap-2">
                <div className="relative w-full xs:w-[50%] md:w-[220px]">
                  <ClanCategorySelect
                    value={""}
                    onChange={() => { }}
                    placeholderClass={"text-gray-400"}
                    className={catAndSorterClass}
                  />
                </div>
                <div className="relative w-full xs:w-[50%] md:w-[220px]">
                  <ClansSorter
                    onChange={(v) => setSortBy(v)}
                    placeholderClass={"text-gray-400"}
                    className={catAndSorterClass}
                  />
                </div>
              </div>
            </div>

            {/* ═══ Grid ═══ */}
            <ApiQueryV2
              uri="/clans"
              query={{ sortBy, search: searchKeyword }}
              key={queryKey}
            >
              {(clans: ClanData[]) => (
                <>
                  {clans.length === 0 ? (
                    /* ── Empty state ── */
                    <div className="text-center py-24">
                      <div className="relative inline-block mb-8">
                        <Castle
                          className="w-20 h-20 text-purple-400/50 mx-auto"
                          style={{ animation: "_cl-float 3s ease-in-out infinite" }}
                        />
                        <div className="absolute inset-0 bg-purple-500/15 blur-3xl rounded-full" />
                      </div>
                      <h3 className="text-2xl font-bold text-white/80 mb-3">
                        No clans found
                      </h3>
                      <p className="text-gray-500 text-lg max-w-sm mx-auto">
                        Try adjusting your search or create a new clan
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-wrap justify-center gap-3">
                      {clans.map((clan: any, i: number) => (
                        <div key={clan.id} className="flex-shrink-0 basis-[240px]">
                          <ClanCard clan={clan} index={i} />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </ApiQueryV2>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default Clans;

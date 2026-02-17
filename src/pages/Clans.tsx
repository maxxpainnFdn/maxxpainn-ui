import React, { useState, useMemo, useEffect } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Castle, Search } from 'lucide-react';
import ClanStats from '@/components/clans/ClanStats';
import ClanCard from '@/components/clans/ClanCard';
import ApiQuery from '@/components/apiQuery/ApiQuery';
import CreateClan from '@/components/clans/CreateClan';
import ClansSorter from '@/components/clans/ClansSorter';
import ClansSearch from '@/components/clans/ClansSearch';
import { Helmet } from 'react-helmet-async';

// Mock data for demonstration
const Clans = () => {
  const [clans, setClans] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [queryKey, setQueryKey] = useState(0)


  useEffect(()=>{
    setQueryKey(Date.now())
  }, [sortBy, searchKeyword])

  const onQuerySuccess = (data) => {
    setClans(data)
  }

  const title = "MaxxPainn Clans - Create your community & earn upto $1 per mint";
  const description =
    "Join a MaxxPainn Clan and show your allegiance during minting. Clans earn upto $1 for every mint when selected by members. Build your community. Earn together.";



  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
  
        {/* OpenGraph */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://maxxpainn.com/clans" />
        <meta property="og:image" content="https://maxxpainn.com/images/pages/clans.jpg" />
  
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://maxxpainn.com/images/pages/clans.jpg" />
      </Helmet>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "MaxxPainn Clans",
          "description": "Communities that earn per mint when selected during token minting."
        })}
      </script>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900/20">
        <Navigation />
  
        <main className="pt-32 pb-20">
          <div className="max-w-7xl  px-4  mx-auto">
  
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 shadow-lg">
                    <Castle className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                    Clans
                  </h1>
                </div>
                <p className="text-gray-300 text-xl ml-1">
                  Build your community, grow your empire & earn SOL
                </p>
              </div>
              <CreateClan />
            </div>
  
            {/** clan stats */}
            <ClanStats />
  
            {/* Filter & Sort Bar */}
            <div className="flex flex-col xs:flex-row justify-between items-stretch lg:items-center gap-4 mb-10">
              <ClansSearch onChange={(v) => setSearchKeyword(v)} />
              <ClansSorter onChange={(value) => setSortBy(value)} />
            </div>
  
            {/* Clans Grid */}
              <ApiQuery
                uri="/clans"
                onSuccess={onQuerySuccess}
                query={{ sortBy, search: searchKeyword }}
                key={queryKey}
              >
                {clans.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="relative inline-block mb-6">
                      <Castle className="w-20 h-20 text-purple-400 mx-auto opacity-50" />
                      <div className="absolute inset-0 bg-purple-500 blur-2xl opacity-20"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No clans found</h3>
                    <p className="text-gray-400 text-lg">Try adjusting your search or create a new clan</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap justify-center gap-2">
                    {clans.map((clan) => (
                      <div
                        key={clan.id}
                        className="flex-shrink-0 basis-[240px]" // fixed width card
                      >
                        <ClanCard clan={clan} />
                      </div>
                    ))}
                  </div>
                )}
              </ApiQuery>
  
          </div>
        </main>
  
        <Footer />
      </div>
    </>
  );
};

export default Clans;

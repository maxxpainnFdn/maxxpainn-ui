import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  TrendingDown,
  Skull,
  Flame,
  Zap,
  FileText,
  Map,
  BookOpen,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/useIsMobile';

const EnhancedHero = () => {
  const [currentStory, setCurrentStory] = useState(0);
  const [glitchText, setGlitchText] = useState('MAXXPAINN');
  const isMobile = useIsMobile();

  // Ref-based pain meter — bypasses React re-renders entirely
  const painBarRef = useRef(null);
  const painTextRef = useRef(null);
  const painLevelRef = useRef(0);
  const rafRef = useRef(null);
  const lastTickRef = useRef(0);

  const painStories = useMemo(
    () => [
      "Lost everything in Luna Terra collapse... 🌙💥",
      "Liquidated during the FTX crash... 💔⚡",
      "Rugged by another 'safe' project... 🪦💸",
      "Watching portfolio bleed red... 📉🩸",
      "Trusted Do Kwon, got rekt... 😭🔥",
      "HODL'd through -99% crash... 💀📊",
      "My position was safe until oct. 10, 25",
      "Trump tweeted & I was liquidated💀",
      "CEX paused withdrawals, life savings stuck... 🔒💀",
      "'Funds are SAFU' then chapter 11... 🧢💣",
      "Left coins on exchange, got a 404... 🌐💸",
      "Withdrawal 'processing' since last bull run... ⏳🪦",
      "Exchange maintenance, liquidation still worked... 🛠️📉",
      "Market closed, account opened at zero... 🚪💀",
      "CeFi yield, DeFi level rekt... 🧪📉",
      "KYC'd everything, still rugged by CEX... 🪪🪦",
      "CEX hot wallet hacked, my hope too... 🔥💔",
      "Not your keys, not your coins, learned late... 🔑💀",
      "Clicked 'approve all', lost all... ✅💸",
      "Unaudited farm, audited my IQ... 🌾🤡",
      "Dev pulled liquidity, my soul followed... 🧑‍💻🕳️",
      "Bought the dip, dev bought a yacht... 🚤💀",
      "Bridge exploit, funds in multichain hell... 🌉👹",
      "Stablecoin depeg speedran my balance... 🪙🏃‍♂️",
      "TVL up only, price down only... 📊📉",
      "DeFi 'partnership' then instant rug... 🤝🪦",
      "Locked my tokens, dev locked the doors... 🔐🚪",
      "DAO vote passed, hacker passed go... 🗳️💣",
      "Multi-sig wallet, single failure point... 🔏💀",
      "LP'd the top, impermanent loss permanent... 💧📉",
      "Ape'd into meme, became the meme... 🐒🤡",
      "IDO whitelist, instant exit liquidity... 📋🚪",
      "Audit badge, zero real audits... 🛡️🪦",
      "Fork of a rug, also a rug... 🍴💀",
      "DeFi 2.0, same rug 2.0... ♻️🪦",
      "50x long, 0.5% move, gone... 🎚️💥",
      "Liquidated in my sleep, dreamt green candles... 🛌📉",
      "Shorted the bottom, certified clown... ⬇️🤡",
      "Bought the top, framed the chart... 🖼️📈",
      "Scalped fees, exchange scalped me... 💈🏦",
      "Set tight stop, market hunted it... 🎯💀",
      "Closed early, watched 100x without me... 🚀😵",
      "Copy traded a clown, became one... 🪞🤡",
      "Turned 10k to 100, 'learning tax'... 📚💸",
      "Revenge traded, market won again... ⚔️📉",
      "Leveraged the dip, it kept dipping... 🕳️📉",
      "DCA'd into oblivion... 📉🕳️",
      "Sold bottom, bought higher, still coping... 🔄😵",
      "NFT flip attempt, became bagholder... 🖼️🪦",
      "Gas fee higher than my balance...⛽💀",
      "Chased green candles, caught red ones... 🟩➡️🟥",
      "Front-ran myself with panic... 🏃‍♂️💀",
      "Closed hedge, opened pain... ✂️💔",
      "Bought 'blue chip' influencer shill... 🔵🤡",
      "Elon posted, I bought, chart dumped... 🐦📉",
      "Trusted CT thread, got threadbare... 🧵💀",
      "'This is the bottom' for the 9th time... 📉📉",
      "Joined the cult, left with bags... ⛪🧳",
      "Ignored whitepaper, followed memes... 📜🤡",
      "Telegram mod said 'no sell', then vanished... 📵🪦",
      "Saved seed phrase in cloud, hacked... ☁️💀",
      "Phished by fake support, real loss... 🎣💸",
      "Sent to wrong chain, support said 'oops'... 🔗🪦",
      "Lost seed, found inner pain... 🌱💔",
      "Typed address by hand, typo'd destiny... ⌨️📉",
      "Signed random message, lost real coins... ✍️💀",
      "Bull market genius, bear market intern... 🧠🐻",
      "Up bad, then down worse... 📈➡️📉",
      "Retirement plan turned degen diary... 📓💀",
      "Bear market 'buy zone' since 2021... 📉🕰️",
      "Told friends to buy, now hiding... 🥷📵",
      "Hit 7 figures, rode it back to 3... 🔁💸",
      "Next cycle I'll be smart, copium... 💭💊",
      "Wife saw the portfolio... 💍💔",
      "Told grandma to buy at ATH... 👵🔪",
      "McDonald's application sent... 🍟🧢",
      "Checking charts at funeral... ⚰️📱",
      "Down 95%, still diamond handing... 💎🤲💀",
      "My lambo is now a bike... 🏎️🚲",
      "Tax man asking for millions I lost... 👮‍♂️🧾",
      "Zoomed out. It looks worse... 🔭📉",
      "Rent money gone in 5 mins... 🏠💸",
      "Watching the chart bleed out... 🩸📉",
      "Bought a JPEG for 10 ETH (now 0)... 🖼️📉",
      "Shorting BTC in late 2025... 🔮☠️",
      "Sold my bags right before the pump... 🚀😭",
      "Waiting for 100k since 2021... ⏳💀",
      "My AI agent traded me to zero... 🤖📉",
      "When I complained they said no crying in the casino ☠️",
      "CEX thanked me for my donation ☠️",
      "Coinbase froze right as I needed to sell... 🧊📉",
      "Binance maintenance started during my liquidation... 🛠️⚰️",
      "Kraken support replied after my wallet died... 🦑💀",
      "Metamask gas estimate lied again... ⛽🤡",
      "Phantom showed 'transaction failed'—but funds gone... 👻💸",
      "Ledger said 'not your keys' but hackers disagreed... 🔐🔥",
    ],
    []
  );

  const glitchVariants = useMemo(
    () => ['MAXXPAINN', 'M4XXPA1NN', 'MAX%PA!NN', 'MA%XPA!NN'],
    []
  );

  // rAF loop for pain meter — zero React re-renders
  useEffect(() => {
    const animate = (now) => {
      if (!lastTickRef.current) lastTickRef.current = now;
      const delta = now - lastTickRef.current;

      painLevelRef.current += delta * (0.5 / 30);
      if (painLevelRef.current > 100) painLevelRef.current = 0;

      if (painBarRef.current) {
        painBarRef.current.style.width = `${painLevelRef.current}%`;
      }
      if (painTextRef.current) {
        painTextRef.current.textContent = `${Math.round(painLevelRef.current)}%`;
      }

      lastTickRef.current = now;
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Low-frequency timers
  useEffect(() => {
    const storyTimer = setInterval(() => {
      setCurrentStory((prev) => (prev + 1) % painStories.length);
    }, 3500);

    const glitchTimer = setInterval(() => {
      setGlitchText(
        glitchVariants[Math.floor(Math.random() * glitchVariants.length)]
      );
      setTimeout(() => setGlitchText('MAXXPAINN'), 100);
    }, 3000);

    return () => {
      clearInterval(storyTimer);
      clearInterval(glitchTimer);
    };
  }, [glitchVariants, painStories]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-black to-purple-900/20"
    >
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            {/* Blurred orbs */}
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute top-20 left-10 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '7s' }}
              />
              <div
                className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '9s', animationDelay: '2s' }}
              />
              <div
                className="absolute top-1/2 left-1/3 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"
                style={{ animationDuration: '8s', animationDelay: '4s' }}
              />
            </div>

            {/* Radial gradient overlay */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-purple-900/10 via-transparent to-transparent" />

            {/* Grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />

            {/* Decorative shapes */}
            <div className="absolute top-20 left-20 w-4 h-4 border-2 border-purple-500/40 rotate-45 opacity-40" />
            <div
              className="absolute top-40 right-32 w-6 h-6 border-2 border-pink-500/40 rounded-full animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div className="absolute bottom-32 right-20 w-5 h-5 border-2 border-red-500/30 rotate-12 opacity-30" />
            <div
              className="absolute bottom-20 left-32 w-3 h-3 border-2 border-purple-400/40 animate-pulse"
              style={{ animationDuration: '3s' }}
            />
            <div
              className="absolute top-1/3 right-16 w-3 h-3 bg-pink-500/50 rounded-full animate-pulse"
              style={{ animationDelay: '1s' }}
            />
            <div
              className="absolute bottom-1/3 left-16 w-2 h-2 bg-purple-500/50 rounded-full animate-pulse"
              style={{ animationDelay: '2s' }}
            />

            {/* Light streaks */}
            <div
              className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-500/30 to-transparent animate-pulse"
              style={{ animationDuration: '4s' }}
            />
            <div
              className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-pink-500/20 to-transparent animate-pulse"
              style={{ animationDuration: '5s', animationDelay: '1s' }}
            />

            {/* Diagonal beams */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-500/5 via-transparent to-transparent" />
            <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-pink-500/5 via-transparent to-transparent" />

            {/* Scan lines */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
                style={{ top: '25%', animationDuration: '3s' }}
              />
              <div
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent animate-pulse"
                style={{
                  top: '50%',
                  animationDuration: '4s',
                  animationDelay: '1s',
                }}
              />
              <div
                className="absolute w-full h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
                style={{
                  top: '75%',
                  animationDuration: '3.5s',
                  animationDelay: '2s',
                }}
              />
            </div>
          </>
        ) : (
          <>
            {/* Mobile: cheap static gradients only */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/15 via-transparent to-pink-900/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </>
        )}
      </div>

      {/* ===== CONTENT ===== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-20 flex flex-col items-center">
        {/* --- HERO HEADER --- */}
        <div className="text-center mb-16 relative">
          {/* Badge */}
          <div className="flex justify-center items-center gap-4 text-xl md:text-2xl mb-8">
            <div className="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-purple-500/50" />
            <Skull className="w-4 h-4 text-pink-500 animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-[0.2em] bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent uppercase">
              FORGE YOUR PAIN INTO POWER
            </span>
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <div className="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-purple-500/50" />
          </div>

          {/* Glitch Title */}
          <div className="relative mb-8 p-4">
            <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl max-w-[95%] font-black tracking-tight select-none relative z-10">
              <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(168,85,247,0.4)]">
                {glitchText}
              </span>
            </h1>
          </div>

          {/* Pain Story Ticker */}
          <div className="h-14 flex items-center justify-center w-full">
            <div className="max-w-[96%] mx-1 inline-flex items-center gap-4 text-lg sm:text-xl md:text-3xl text-gray-300 font-bold bg-black/30 px-8 py-2 rounded-2xl border border-white/5">
              <TrendingDown className="w-6 h-6 text-red-500 animate-bounce" />
              <span className="bg-gradient-to-r from-gray-100 to-gray-400 bg-clip-text text-transparent animate-fade-in">
                {painStories[currentStory]}
              </span>
            </div>
          </div>
        </div>

        {/* --- MAIN GLASS CARD --- */}
        <div className="w-full max-w-5xl bg-gray-900/40 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-4 sm:p-8 md:p-14 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative overflow-hidden group">
          {/* Internal glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent blur-sm" />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />

          {/* Pain Meter — ref-driven, no state rerenders */}
          <div className="max-w-xl mx-auto mb-12 relative">
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-3 tracking-wider">
              <span className="flex items-center gap-2">
                <Skull size={14} className="text-gray-500" />
                PAIN
              </span>
              <span
                ref={painTextRef}
                className="text-lg text-purple-400 font-black tracking-tighter shadow-purple-500/20 drop-shadow-lg"
              >
                0%
              </span>
              <span className="flex items-center gap-2">
                GAIN
                <Zap size={14} className="text-yellow-400" />
              </span>
            </div>

            <div className="h-5 bg-black/60 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6)] relative p-0.5">
              <div
                ref={painBarRef}
                className="h-full rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-green-400 relative shadow-[0_0_15px_rgba(239,68,68,0.5)] will-change-[width]"
                style={{ width: '0%' }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[size:1rem_1rem] animate-[shimmer_1s_linear_infinite]" />
              </div>
            </div>
          </div>

          {/* Main Message */}
          <div className="text-center mb-14">
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300/90 leading-relaxed max-w-3xl mx-auto font-light">
              Every degen knows the pain. The rugs that stole our dreams. The
              liquidations that crushed our souls.
              <br className="hidden md:block" />
              <span className="block mt-6 text-xl sm:text-2xl  text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-md">
                For degens who've bled in the trenches. Share your story, earn liquid $MAXX SPL tokens.
              </span>
              <br />
              <span className="text-sm md:text-base text-gray-400 uppercase tracking-widest mt-4 block">
                MAXXPAINN isn't just a token - it's our battle cry.
              </span>
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-14 px-2">
            {[
              {
                title: '100% FREE MINT',
                sub: 'For Everybody',
                border: 'border-red-500/20',
                bg: 'hover:bg-red-500/5',
                text: 'text-red-400',
              },
              {
                title: 'NO BULLSHIT',
                sub: 'Pure Degen Tokenomics',
                border: 'border-purple-500/20',
                bg: 'hover:bg-purple-500/5',
                text: 'text-purple-400',
              },
              {
                title: 'REVENGE',
                sub: 'Against The System',
                border: 'border-green-500/20',
                bg: 'hover:bg-green-500/5',
                text: 'text-green-400',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className={`bg-black/20 border ${item.border} rounded-2xl p-6 text-center ${item.bg} transition-all duration-300 hover:-translate-y-1`}
              >
                <div
                  className={`text-xl font-black ${item.text} mb-2 tracking-tight`}
                >
                  {item.title}
                </div>
                <div className="text-sm text-gray-400 font-medium tracking-wide">
                  {item.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Button Group */}
          <div className="flex flex-col md:flex-row gap-5 justify-center items-center w-full">
            <Link to="/whitepaper" className="w-full md:w-auto flex-1 md:flex-none">
              <button className="w-full px-4 md:px-8 py-3 md:py-5 bg-gray-900 hover:bg-gray-800 border border-green-500/20 text-green-400/90 font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(74,222,128,0.1)] hover:border-green-500/50 flex items-center justify-center gap-3 group">
                <FileText className="w-5 h-5 group-hover:text-green-300" />
                Whitepaper
              </button>
            </Link>

            <Link
              to="/roadmap"
              className="w-full md:w-auto md:min-w-[240px] order-first md:order-none"
            >
              <button className="font-bold w-full px-4 md:px-8 py-3 md:py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-xl shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(236,72,153,0.5)] transition-all duration-300 hover:scale-[1.03] flex items-center justify-center gap-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
                <Map className="w-6 h-6" />
                Roadmap
              </button>
            </Link>

            <Link to="/manifesto" className="w-full md:w-auto flex-1 md:flex-none">
              <button className="w-full px-4 md:px-8 py-3 md:py-5 bg-gray-900 hover:bg-gray-800 border border-purple-500/20 text-purple-400/90 font-bold rounded-2xl text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(168,85,247,0.1)] hover:border-purple-500/50 flex items-center justify-center gap-3 group">
                <BookOpen className="w-5 h-5 group-hover:text-purple-300" />
                Our Manifesto
              </button>
            </Link>
          </div>
        </div>

        {/* --- STATS FOOTER --- */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 lg:gap-6 w-full max-w-6xl px-4">
          {[
            {
              value: '$2.1T+',
              label: 'Market Pain',
              color: 'text-red-500',
              glow: 'group-hover:shadow-red-900/20',
            },
            {
              value: '1M+',
              label: 'Degens United',
              color: 'text-purple-500',
              glow: 'group-hover:shadow-purple-900/20',
            },
            {
              value: '∞',
              label: 'Free Mints',
              color: 'text-pink-500',
              glow: 'group-hover:shadow-pink-900/20',
            },
            {
              value: '24/7',
              label: 'Revenge Mode',
              color: 'text-green-500',
              glow: 'group-hover:shadow-green-900/20',
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`flex flex-col items-center justify-center bg-gray-900/30 border border-white/5 rounded-2xl p-4 md:p-8 text-center hover:-translate-y-1 transition-all duration-300 group hover:bg-gray-800/50 hover:border-white/10 shadow-lg ${stat.glow}`}
            >
              <div
                className={`text-2xl sm:text-4xl font-black ${stat.color} mb-2 drop-shadow-sm`}
              >
                {stat.value}
              </div>
              <div className="text-gray-400 font-bold text-sm tracking-widest uppercase">
                {stat.label}
              </div>
              <div className="text-[11px] text-gray-600 font-mono mt-2 hidden group-hover:inline-block transition-opacity">
                {idx === 0
                  ? 'And Counting...'
                  : idx === 1
                  ? 'Growing Daily'
                  : idx === 2
                  ? 'No Limits'
                  : 'Never Stops'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;

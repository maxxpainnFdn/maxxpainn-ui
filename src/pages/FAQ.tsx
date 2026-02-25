/**
 * MAXXPAINN — FAQ Page
 *
 * Design system: maxx-* tokens, btn-p / btn-s / eyebrow / pill classes.
 * No raw Tailwind color names, no hex codes in JSX.
 */

import { useState } from "react";
import {
  AlertTriangle, Shield, Zap, Flame, Skull,
  Target, Settings, Blocks, Users, BookOpen,
  ChevronDown, ArrowRight,
} from "lucide-react";
import { SiTelegram, SiX } from "@icons-pack/react-simple-icons";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import Navigation from "@/components/nav/Navigation";
import socialConfig from "@/config/socials";
import Button from "@/components/button/Button";

/* ─── data ───────────────────────────────────────────────────── */
const faqs = [
  {
    category: "TECHNICAL",
    Icon: Settings,
    tw: {
      label:  "text-blue-400",
      badge:  "bg-blue-400/10 border-blue-400/30",
      border: "border-l-blue-400",
      bg:     "bg-blue-400/5",
    },
    question: "What is MAXXPAINN?",
    answer: "MAXXPAINN is a free-to-mint token protocol built on the Solana blockchain, inspired by the viral mechanics of XEN Network. It allows anyone to mint tokens 100% free, promoting fair distribution and organic community growth.",
  },
  {
    category: "ELIGIBILITY",
    Icon: Skull,
    tw: {
      label:  "text-maxx-pink",
      badge:  "bg-maxx-pink/10 border-maxx-pink/30",
      border: "border-l-maxx-pink",
      bg:     "bg-maxx-pink/5",
    },
    question: "What qualifies me as a 'degen' for the free mint?",
    answer: "If you have a Solana wallet, you're in. No whitelist, no gatekeeping — just pure degen energy. Anyone with a wallet qualifies to mint for free on the protocol.",
  },
  {
    category: "MINTING",
    Icon: Target,
    tw: {
      label:  "text-maxx-violet",
      badge:  "bg-maxx-violet/10 border-maxx-violet/30",
      border: "border-l-maxx-violet",
      bg:     "bg-maxx-violet/5",
    },
    question: "How do I claim my free MAXXPAINN Tokens?",
    answer: "First, initiate the mint process. After that, you'll need to wait for the selected wait period to expire before you can withdraw your MAXXPAINN tokens. 🔥 Patience is pain; but pain is gain.",
  },
  {
    category: "TECHNICAL",
    Icon: Settings,
    tw: {
      label:  "text-blue-400",
      badge:  "bg-blue-400/10 border-blue-400/30",
      border: "border-l-blue-400",
      bg:     "bg-blue-400/5",
    },
    question: "What blockchain is MAXXPAINN on?",
    answer: "MAXXPAINN is currently deployed exclusively on the Solana blockchain, taking full advantage of its speed, low fees, and degen-friendly ecosystem.",
  },
  {
    category: "UTILITY",
    Icon: Zap,
    tw: {
      label:  "text-yellow-400",
      badge:  "bg-yellow-400/10 border-yellow-400/30",
      border: "border-l-yellow-400",
      bg:     "bg-yellow-400/5",
    },
    question: "What utility does my MAXXPAINN tokens have?",
    answer: "MAXXPAINN currently has no utility — it's a pure degen experiment. There are no promises, no guarantees — just vibes, speculation, and pain.",
  },
  {
    category: "SUPPLY",
    Icon: Blocks,
    tw: {
      label:  "text-emerald-400",
      badge:  "bg-emerald-400/10 border-emerald-400/30",
      border: "border-l-emerald-400",
      bg:     "bg-emerald-400/5",
    },
    question: "How many MAXXPAINN tokens will exist?",
    answer: "The total supply of MAXXPAINN is not fixed. However, as more tokens are minted, the cost to mint increases due to our on-chain algorithm that factors in rising computational and storage costs. Over time, minting becomes more painful — and more expensive.",
  },
  {
    category: "ROADMAP",
    Icon: Flame,
    tw: {
      label:  "text-orange-400",
      badge:  "bg-orange-400/10 border-orange-400/30",
      border: "border-l-orange-400",
      bg:     "bg-orange-400/5",
    },
    question: "What's the long-term vision for MAXXPAINN?",
    answer: "MAXXPAINN is more than just a token — it's the foundation of a full-blown degen ecosystem. We're building toward DAO governance, DeFi integrations, and cross-chain expansion. This isn't a meme, it's a movement. Pain today. Power tomorrow. LFG! 🌙",
  },
  {
    category: "LEGAL",
    Icon: AlertTriangle,
    tw: {
      label:  "text-maxx-pink",
      badge:  "bg-maxx-pink/10 border-maxx-pink/30",
      border: "border-l-maxx-pink",
      bg:     "bg-maxx-pink/5",
    },
    question: "Is this financial advice?",
    answer: "Absolutely not. We're not financial advisors — we're just battle-tested degens embracing the chaos. Always DYOR, know the risks, and remember: NFA. ⚠️",
  },
  {
    category: "COMMUNITY",
    Icon: Users,
    tw: {
      label:  "text-cyan-400",
      badge:  "bg-cyan-400/10 border-cyan-400/30",
      border: "border-l-cyan-400",
      bg:     "bg-cyan-400/5",
    },
    question: "How can I get involved in the community?",
    answer: "Join our Telegram, follow our X, share your pain story, and help other degens navigate the crypto wasteland. We're stronger together. Apes together strong! 🦍",
  },
  {
    category: "SECURITY",
    Icon: Shield,
    tw: {
      label:  "text-emerald-400",
      badge:  "bg-emerald-400/10 border-emerald-400/30",
      border: "border-l-emerald-400",
      bg:     "bg-emerald-400/5",
    },
    question: "How do I know this isn't another rug pull or scam?",
    answer: "Fair question — we've all felt the pain. But MAXXPAINN is a 100% fair, free mint with no pre-mine, no team allocation, and everything happens on-chain. What's there to rug when you're minting for free? Still, stay safe: always use a fresh wallet for minting and claiming. Trust, but verify. 🛡️",
  },
];

const socialLinks = [
  {
    url:   `https://t.me/${socialConfig.telegram}`,
    icon:  <SiTelegram size={16} />,
    label: "Telegram",
    tw:    "text-maxx-violet bg-maxx-violet/10 border-maxx-violet/30 hover:bg-maxx-violet/20 hover:border-maxx-violet/50",
  },
  {
    url:   `https://x.com/${socialConfig.x}`,
    icon:  <SiX size={14} />,
    label: "X / Twitter",
    tw:    "text-maxx-pink bg-maxx-pink/10 border-maxx-pink/30 hover:bg-maxx-pink/20 hover:border-maxx-pink/50",
  },
  {
    url:   `https://x.com/${socialConfig.medium}`,
    icon:  <BookOpen size={16} />,
    label: "Blog Posts",
    tw:    "text-emerald-400 bg-emerald-400/10 border-emerald-400/30 hover:bg-emerald-400/20 hover:border-emerald-400/50",
  },
];

/* ─── FAQ card ───────────────────────────────────────────────── */
const FaqCard = ({ faq, index, isOpen, onToggle }) => (
  <div
    className={`bg-maxx-bg1/80 border rounded-lg shadow-2xl transition-all duration-300 ${
      isOpen
        ? "border-maxx-violet/40 shadow-maxx-violet/10"
        : "border-maxx-violet/20 hover:border-maxx-violet/40"
    }`}
  >
    <button
      className="w-full flex items-center gap-4 p-6 md:p-8 text-left cursor-pointer bg-transparent border-none"
      onClick={() => onToggle(index)}
      aria-expanded={isOpen}
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 border ${faq.tw.badge}`}>
        <faq.Icon size={20} className={faq.tw.label} strokeWidth={1.8} />
      </div>

      <div className="flex-1 min-w-0">
        <span className={`font-mono text-[0.62rem] tracking-[0.15em] uppercase mb-1.5 block ${faq.tw.label}`}>
          {faq.category}
        </span>
        <p className="font-sans font-bold text-[1.05rem] leading-[1.4] text-maxx-bright">
          {faq.question}
        </p>
      </div>

      <ChevronDown
        size={20}
        strokeWidth={2}
        className={`flex-shrink-0 text-maxx-violet/60 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>

    {isOpen && (
      <div className="px-6 md:px-8 pb-6 md:pb-8 pt-0 animate-acc-open">
        <p className={`font-sans text-base leading-[1.85] border-l-4 pl-6 py-3 rounded-r-md text-maxx-bright ${faq.tw.border} ${faq.tw.bg}`}>
          {faq.answer}
        </p>
      </div>
    )}
  </div>
);

/* ─── page ───────────────────────────────────────────────────── */
const title       = "MaxxPainn FAQ – Frequently Asked Questions";
const description = "Find answers to common questions about minting, clans, token claims, and how MaxxPainn works.";

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleToggle = (i) => setOpenIndex(p => p === i ? null : i);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description"         content={description} />
        <meta property="og:title"        content={title} />
        <meta property="og:description"  content={description} />
        <meta property="og:type"         content="website" />
        <meta property="og:url"          content="https://maxxpainn.com/faq" />
        <meta property="og:image"        content="https://maxxpainn.com/images/pages/faq.jpg" />
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content="https://maxxpainn.com/images/pages/faq.jpg" />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Navigation />

        <div className="relative overflow-hidden">

          {/* ambient glows */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
            <div className="absolute top-1/3 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
          </div>

          <main className="relative pt-32 pb-20">
            <div className="max-w-4xl mx-auto px-4">

              {/* ── HEADER ── */}
              <div className="text-center mb-20">
                <div className="eyebrow justify-center mb-4">
                  <span className="eyebrow-dot" />
                  Community · Knowledge Base
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter">
                  <span className="text-maxx-white">FREQUENTLY </span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">ASKED</span>
                </h1>

                <p className="text-xl md:text-2xl text-maxx-mid max-w-2xl mx-auto leading-relaxed">
                  No fluff. Just straight answers about the MAXXPAINN movement.
                </p>

                <div className="flex items-center justify-center gap-4 mt-10">
                  <div className="h-px w-16 bg-gradient-to-r from-transparent to-maxx-violet/50" />
                  <Flame size={20} className="text-maxx-pink" />
                  <div className="h-px w-16 bg-gradient-to-l from-transparent to-maxx-violet/50" />
                </div>
              </div>

              {/* ── FAQ LIST ── */}
              <div className="space-y-2">
                {faqs.map((faq, i) => (
                  <FaqCard key={i} faq={faq} index={i} isOpen={openIndex === i} onToggle={handleToggle} />
                ))}
              </div>

              {/* ── DISCLAIMER ── */}
              <div className="mt-20">
                <div className="bg-maxx-bg1/80 border-2 border-maxx-pink/30 rounded-lg p-8 md:p-12 shadow-2xl shadow-maxx-pink/5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-pink/60 via-maxx-violet/40 to-transparent" />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-grad-btn">
                      <AlertTriangle size={22} className="text-maxx-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black bg-grad-accent bg-clip-text text-transparent uppercase">
                      ⚠️ Degen Disclaimer
                    </h2>
                  </div>

                  <p className="font-sans text-base leading-[1.9] text-maxx-mid">
                    MAXXPAINN is an experimental project created by degens, for degens.
                    This is <strong className="text-maxx-pink">NOT</strong> financial advice.
                    Cryptocurrency investments carry <strong className="text-maxx-pink">HIGH RISK</strong> and
                    can result in <strong className="text-maxx-pink">TOTAL LOSS</strong>. Only participate
                    with funds you can afford to lose completely. We are not responsible for any financial
                    losses.{" "}
                    <strong className="text-maxx-violet">DYOR and make informed decisions. NFA! 🚨</strong>
                  </p>
                </div>
              </div>

              {/* ── COMMUNITY + CTA ── */}
              <div className="mt-6">
                <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-8 md:p-12 shadow-2xl text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-violet/40 to-transparent" />

                  <h3 className="text-xl md:text-2xl font-bold mb-3 text-maxx-bright">
                    Still have questions?
                  </h3>
                  <p className="mb-8 text-base leading-[1.75] text-maxx-mid">
                    Hit us up in our community channels. We're here for you, fren! 🤝
                  </p>

                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {socialLinks.map(({ url, icon, label, tw }) => (
                      <a
                        key={label}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2.5 font-mono font-semibold text-[0.82rem] tracking-wider uppercase no-underline border rounded-lg px-5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 ${tw}`}
                      >
                        {icon}
                        {label}
                      </a>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-maxx-violet/15">
                    <div className="eyebrow justify-center mb-4">
                      <span className="eyebrow-dot" />
                      Ready to mint?
                    </div>
                    <Link to="/mint">
                      <Button variant="primary" skewed className="shadow-[0_0_30px_rgba(255,45,120,0.2)]">
                        <Flame size={16} />
                        CLAIM YOUR FREE MINT
                        <ArrowRight size={16} />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Faq;

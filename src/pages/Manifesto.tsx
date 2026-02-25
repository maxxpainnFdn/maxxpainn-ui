/**
 * MAXXPAINN — Manifesto Page
 *
 * Design system: maxx-* tokens, btn-p / eyebrow / pill / card-hover classes.
 * No raw Tailwind color names, no hex codes in JSX.
 */

import React from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { Shield, Zap, Flame, TrendingUp, Users, Target, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '@/components/button/Button';

const title       = "The MaxxPainn Manifesto – Pain to Power";
const description = "From the depths of crypto pain emerges unstoppable power. Join the degens' revolution and turn losses into strength with MaxxPainn.";

/* ─── creed items ─────────────────────────────────────────────── */
const creedItems = [
  { icon: Shield,     text: "We embrace the pain because it makes us unbreakable",          tw: "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet"  },
  { icon: TrendingUp, text: "We turn losses into lessons, tears into determination",         tw: "bg-blue-500/10   border-blue-500/30    text-blue-400"       },
  { icon: Zap,        text: "We hodl when others fold, buy when others cry",                 tw: "bg-yellow-500/10 border-yellow-500/30  text-yellow-400"     },
  { icon: Crown,      text: "We are the storm that others fear to weather",                  tw: "bg-maxx-pink/10  border-maxx-pink/30   text-maxx-pink"      },
];

const revolutionStats = [
  { label: "Transactions", value: "Votes"     },
  { label: "Holds",        value: "Rebellion" },
  { label: "Pumps",        value: "Power"     },
];

/* ─── shared section icon badge ─────────────────────────────────── */
const IconBadge = ({ Icon, tw }) => (
  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-lg flex items-center justify-center flex-shrink-0 border ${tw}`}>
    <Icon className="w-6 h-6 md:w-7 md:h-7" />
  </div>
);

const Divider = () => (
  <div className="flex items-center justify-center gap-4">
    <div className="h-px w-16 bg-gradient-to-r from-transparent to-maxx-violet/50" />
    <Flame size={20} className="text-maxx-pink" />
    <div className="h-px w-16 bg-gradient-to-l from-transparent to-maxx-violet/50" />
  </div>
);

/* ─── page ───────────────────────────────────────────────────── */
const Manifesto = () => (
  <>
    <Helmet>
      <title>{title}</title>
      <meta name="description"         content={description} />
      <meta property="og:title"        content={title} />
      <meta property="og:description"  content={description} />
      <meta property="og:type"         content="website" />
      <meta property="og:url"          content="https://maxxpainn.com/manifesto" />
      <meta property="og:image"        content="https://maxxpainn.com/images/pages/manifesto.jpg" />
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content="https://maxxpainn.com/images/pages/manifesto.jpg" />
    </Helmet>

    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="relative overflow-hidden">

        {/* ambient glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-maxx-violet rounded-full blur-[160px] opacity-[0.07]" />
          <div className="absolute top-1/2 -right-48 w-[600px] h-[600px] bg-maxx-pink rounded-full blur-[140px] opacity-[0.05]" />
        </div>

        <main className="relative pt-32 pb-12">
          <div className="max-w-6xl mx-auto px-4">

            {/* ── HEADER ── */}
            <div className="text-center mb-20">
              <div className="eyebrow justify-center mb-4">
                <span className="eyebrow-dot" />
                The Degen Declaration
              </div>

              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter">
                <span className="text-maxx-white">THE </span>
                <span className="bg-grad-accent bg-clip-text text-transparent">MANIFESTO</span>
              </h1>

              <p className="text-2xl text-maxx-mid max-w-3xl mx-auto leading-relaxed">
                From the depths of crypto pain emerges unstoppable power
              </p>

              <div className="mt-12">
                <Divider />
              </div>
            </div>

            {/* ── CONTENT ── */}
            <div className="space-y-8">

              {/* ── 01 THE GENESIS ── */}
              <section className="relative">
                <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-8 md:p-12 shadow-2xl card-hover relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/30 to-transparent" />

                  <div className="flex items-center gap-4 mb-8">
                    <IconBadge Icon={Shield} tw="bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet" />
                    <div>
                      <div className="eyebrow mb-1"><span className="eyebrow-dot" />Section 01</div>
                      <h2 className="text-2xl md:text-4xl font-black text-maxx-white tracking-tight">
                        The Genesis of Pain
                      </h2>
                    </div>
                  </div>

                  <div className="space-y-6 text-lg text-maxx-mid leading-relaxed">
                    <p className="text-maxx-bright text-xl">
                      We are the battle-scarred veterans of a thousand crypto winters. We've watched fortunes
                      evaporate in milliseconds, seen dreams shatter on red candles, and felt the crushing
                      weight of FOMO decisions. But from this pain, we rise stronger.
                    </p>
                    <p className="text-xl border-l-4 border-maxx-pink pl-6 py-3 bg-maxx-pink/5 rounded-r-md text-maxx-bright">
                      MAXXPAINN isn't just a token—it's a declaration. A middle finger to the market makers,
                      the whales, and the suits who think they own this space. We are the degens, and this
                      is our time.
                    </p>
                  </div>
                </div>
              </section>

              {/* ── 02 OUR CREED ── */}
              <section>
                <div className="bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-8 md:p-12 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-pink/50 via-maxx-violet/30 to-transparent" />

                  <div className="flex items-center gap-4 mb-8">
                    <IconBadge Icon={Flame} tw="bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink" />
                    <div>
                      <div className="eyebrow mb-1"><span className="eyebrow-dot" />Section 02</div>
                      <h2 className="text-2xl md:text-4xl font-black text-maxx-white tracking-tight">
                        Our Creed
                      </h2>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    {creedItems.map(({ icon: Icon, text, tw }, idx) => (
                      <div
                        key={idx}
                        className="bg-maxx-bg0/60 border border-maxx-violet/15 rounded-lg p-6 hover:border-maxx-violet/30 hover:translate-x-1 transition-all duration-300 group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 border group-hover:scale-110 transition-transform duration-300 ${tw}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <p className="text-base text-maxx-bright leading-relaxed pt-2">
                            {text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ── 03 THE REVOLUTION ── */}
              <section>
                <div className="relative overflow-hidden bg-maxx-bg1/80 border-2 border-maxx-violet/25 rounded-lg p-8 md:p-12 shadow-2xl">
                  {/* top accent */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/60 via-maxx-pink/40 to-transparent" />
                  {/* corner glow */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-maxx-violet/8 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                      <IconBadge Icon={Target} tw="bg-grad-btn text-maxx-white border-maxx-pink/30" />
                      <div>
                        <div className="eyebrow mb-1"><span className="eyebrow-dot" />Section 03</div>
                        <h2 className="text-2xl md:text-4xl font-black text-maxx-white tracking-tight">
                          The Revolution
                        </h2>
                      </div>
                    </div>

                    <div className="space-y-6 text-lg text-maxx-mid leading-relaxed">
                      <p className="text-maxx-bright text-xl">
                        This isn't about getting rich quick. This is about proving that the degens, the
                        risk-takers, the ones who dare to dream big in a world that tells us to play it
                        safe—we are the future of finance.
                      </p>
                      <p className="text-xl font-semibold text-maxx-violetLt">
                        Every transaction is a vote of confidence. Every hold is an act of rebellion.
                        Every pump is proof that pain transforms into power when wielded by the right hands.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
                      {revolutionStats.map(({ label, value }) => (
                        <div key={label} className="text-center p-6 bg-maxx-bg0/60 rounded-lg border border-maxx-violet/15">
                          <div className="text-xs text-maxx-pink font-bold mb-2 font-mono uppercase tracking-widest">{label}</div>
                          <div className="text-2xl font-black text-maxx-violet">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── 04 THE PROMISE ── */}
              <section>
                <div className="relative overflow-hidden bg-maxx-bg1/80 border-2 border-maxx-violet/25 rounded-lg p-8 md:p-12 shadow-2xl">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-violet/50 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/3 to-maxx-pink/3 pointer-events-none" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8 justify-center">
                      <IconBadge Icon={Users} tw="bg-yellow-500/10 border-yellow-500/30 text-yellow-400" />
                      <div>
                        <div className="eyebrow mb-1"><span className="eyebrow-dot" />Section 04</div>
                        <h2 className="text-2xl md:text-4xl font-black text-maxx-white tracking-tight">
                          The Promise
                        </h2>
                      </div>
                    </div>

                    <div className="max-w-4xl mx-auto">
                      <div className="bg-maxx-bg0/60 border border-maxx-violet/25 p-8 md:p-10 rounded-lg">
                        <blockquote className="text-xl sm:text-2xl md:text-3xl text-center font-bold bg-grad-accent bg-clip-text text-transparent leading-relaxed">
                          "We swear by the code, by the blockchain, by the unstoppable force of
                          decentralization—MAXXPAINN will be the token that turns your deepest
                          crypto wounds into your greatest victories."
                        </blockquote>
                        <div className="flex justify-center mt-8">
                          <Divider />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── CTA ── */}
              <section className="text-center py-12">
                <h2 className="text-4xl md:text-6xl font-black mb-6 bg-grad-accent bg-clip-text text-transparent tracking-tighter">
                  JOIN THE REVOLUTION
                </h2>

                <p className="text-2xl text-maxx-mid mb-12 max-w-3xl mx-auto leading-relaxed">
                  The time for playing it safe is over. The degens shall inherit the blockchain.
                </p>

                {/* pain → power flow */}
                <div className="flex items-center justify-center gap-3 text-xl sm:text-2xl font-black mb-12">
                  <Flame className="w-6 h-6 text-maxx-pink" />
                  <span className="bg-grad-accent bg-clip-text text-transparent">Pain</span>
                  <span className="text-maxx-violet/50">→</span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">Power</span>
                  <span className="text-maxx-violet/50">→</span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">Profit</span>
                </div>

                <Link to="/mint">
                  <Button variant="primary" skewed className="shadow-[0_0_40px_rgba(255,45,120,0.25)] text-xl px-12 py-5">
                    <Flame size={18} />
                    Start Your Journey
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </section>

              {/* ── BOTTOM QUOTE ── */}
              <section className="text-center py-8">
                <div className="max-w-3xl mx-auto p-8 bg-maxx-bg1/60 border border-maxx-violet/20 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-maxx-violet/30 to-transparent" />
                  <p className="text-xl text-maxx-sub italic">
                    "Every great fortune was built on great pain. Your time is now."
                  </p>
                  <div className="mt-5 flex justify-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-maxx-violet" />
                    <div className="w-1.5 h-1.5 rounded-full bg-maxx-pink" />
                    <div className="w-1.5 h-1.5 rounded-full bg-maxx-pinkDk" />
                  </div>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  </>
);

export default Manifesto;

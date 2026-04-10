/**
 * MAXXPAINN — Terms of Service Page
 *
 * Design system: maxx-* tokens, btn-p / btn-s / eyebrow / pill / card-hover classes.
 * No raw Tailwind color names, no hex codes in JSX.
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import {
  CheckCircle,
  Layers,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  AlertOctagon,
  Scale,
  FileText,
  Mail,
  ChevronRight,
  AlertCircle,
  Shield,
  ArrowRight,
  Skull,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import socials from '@/config/socials';
import Button from '@/components/button/Button';

const title       = "MaxxPainn Terms of Service – Rules of the Pain Zone";
const description = "Read the MAXXPAINN Terms of Service before entering. Know the risks, understand the rules, and trade responsibly.";

/* ─── sections data ──────────────────────────────────────────── */
const sections = [
  {
    id: "acceptance",
    label: "01",
    title: "Acceptance of Terms",
    Icon: CheckCircle,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
    },
    content: (
      <p className="text-base leading-[1.85] border-l-4 border-maxx-violet pl-6 py-3 bg-maxx-violet/5 rounded-r-md text-maxx-bright">
        By accessing or using MAXXPAINN services, you agree to be bound by these Terms of Service.
        If you disagree with any part of these terms, you may not access our services. Your continued
        use of the platform constitutes acceptance of any updates to these terms.
      </p>
    ),
  },
  {
    id: "service",
    label: "02",
    title: "Description of Service",
    Icon: Layers,
    tw: {
      badge:  "bg-blue-500/10 border-blue-500/30 text-blue-400",
      accent: "via-blue-500/40",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          MAXXPAINN is a cryptocurrency token and community platform. Our services include:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Token trading and transactions",
            "Community participation and governance",
            "Educational content and resources",
            "Social features and interactions",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 p-4 rounded-lg bg-maxx-bg0/60 border border-blue-500/10 hover:border-blue-500/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-blue-400 flex-shrink-0 shadow-[0_0_8px_rgba(96,165,250,0.5)]" />
              <span className="text-maxx-bright text-sm">{item}</span>
            </div>
          ))}
        </div>
      </>
    ),
  },
  {
    id: "risk",
    label: "03",
    title: "Risk Disclosure",
    Icon: AlertTriangle,
    tw: {
      badge:  "bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink",
      accent: "via-maxx-pink/50",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          Entering the pain zone means understanding the risks:
        </p>
        <ul className="space-y-3">
          {[
            "Extreme price volatility",
            "Regulatory uncertainty",
            "Technology risks and smart contract vulnerabilities",
            "Market manipulation risks",
            "Liquidity risks",
          ].map((risk) => (
            <li key={risk} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-pink/10 hover:border-maxx-pink/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-maxx-pink mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(255,45,120,0.6)]" />
              <span className="text-maxx-bright text-sm leading-relaxed">{risk}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "responsibilities",
    label: "04",
    title: "User Responsibilities",
    Icon: UserCheck,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          By using our services, you agree to:
        </p>
        <ul className="space-y-3">
          {[
            { title: "Provide accurate information", desc: "All information provided must be truthful and up-to-date." },
            { title: "Comply with laws",             desc: "Follow all applicable laws and regulations in your jurisdiction." },
            { title: "Maintain security",            desc: "Keep your wallet and private keys secure at all times." },
            { title: "Trade ethically",              desc: "Do not engage in market manipulation or fraudulent activities." },
            { title: "Respect community",            desc: "Treat other community members with respect." },
          ].map(({ title: t, desc }) => (
            <li key={t} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/10 hover:border-maxx-violet/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-maxx-violet mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              <span className="text-maxx-bright text-sm leading-relaxed">
                <span className="text-maxx-white font-bold">{t}: </span>{desc}
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "prohibited",
    label: "05",
    title: "Prohibited Activities",
    Icon: ShieldAlert,
    tw: {
      badge:  "bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink",
      accent: "via-maxx-pink/50",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          The following activities are strictly prohibited:
        </p>
        <ul className="space-y-3">
          {[
            "Money laundering or terrorist financing",
            "Market manipulation or insider trading",
            "Hacking, phishing, or other malicious activities",
            "Spam, harassment, or abusive behavior",
            "Violation of intellectual property rights",
          ].map((item) => (
            <li key={item} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-pink/10 hover:border-maxx-pink/25 transition-all duration-300">
              <Skull className="w-4 h-4 text-maxx-pink mt-0.5 flex-shrink-0" />
              <span className="text-maxx-bright text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "disclaimers",
    label: "06",
    title: "Disclaimers",
    Icon: AlertOctagon,
    tw: {
      badge:  "bg-yellow-500/10 border-yellow-500/30 text-yellow-400",
      accent: "via-yellow-500/40",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6 font-bold">
          IMPORTANT DISCLAIMERS:
        </p>
        <ul className="space-y-3">
          {[
            'MAXXPAINN is provided "as is" without warranties of any kind',
            "We do not guarantee profits or prevent losses",
            "This is not financial, investment, or legal advice",
            "We are not responsible for third-party services or platforms",
            "Transactions on the blockchain are irreversible",
          ].map((item) => (
            <li key={item} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-yellow-500/10 hover:border-yellow-500/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-yellow-400 mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
              <span className="text-maxx-bright text-sm leading-relaxed">{item}</span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "liability",
    label: "07",
    title: "Limitation of Liability",
    Icon: Scale,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
    },
    content: (
      <p className="text-base leading-[1.85] border-l-4 border-maxx-violet pl-6 py-3 bg-maxx-violet/5 rounded-r-md text-maxx-bright">
        To the maximum extent permitted by law, MAXXPAINN and its team shall not be liable
        for any direct, indirect, incidental, special, or consequential damages arising from
        the use of our services, including but not limited to financial losses, loss of data,
        or business interruption.
      </p>
    ),
  },
  {
    id: "governing",
    label: "08",
    title: "Governing Law",
    Icon: FileText,
    tw: {
      badge:  "bg-blue-500/10 border-blue-500/30 text-blue-400",
      accent: "via-blue-500/40",
    },
    content: (
      <p className="text-base leading-[1.85] border-l-4 border-blue-500 pl-6 py-3 bg-blue-500/5 rounded-r-md text-maxx-bright">
        These terms shall be governed by and construed in accordance with applicable laws.
        Any disputes shall be resolved through binding arbitration in accordance with international
        arbitration rules. You waive any right to participate in class-action lawsuits.
      </p>
    ),
  },
];

/* ─── sidebar nav item ───────────────────────────────────────── */
const NavItem = ({ section, isActive, onClick }) => (
  <button
    onClick={() => onClick(section.id)}
    className={`w-full text-left px-4 py-3 rounded-lg flex items-center justify-between group transition-all duration-300 border ${
      isActive
        ? 'bg-maxx-violet/10 text-maxx-violet border-maxx-violet/25'
        : 'text-maxx-sub hover:text-maxx-white hover:bg-maxx-bg0/60 border-transparent'
    }`}
  >
    <span className="flex items-center gap-3 text-sm font-medium">
      <span className={`font-mono text-[0.62rem] tracking-widest ${isActive ? 'text-maxx-pink' : 'text-maxx-dim'}`}>
        {section.label}
      </span>
      <section.Icon className="w-3.5 h-3.5" />
      {section.title}
    </span>
    {isActive && <ChevronRight className="w-3.5 h-3.5 animate-pulse" />}
  </button>
);

/* ─── content card ───────────────────────────────────────────── */
const SectionCard = ({ section }) => (
  <div
    id={section.id}
    className="relative bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-8 md:p-10 hover:border-maxx-violet/35 transition-all duration-300 overflow-hidden group"
  >
    <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${section.tw.accent} to-transparent opacity-60`} />

    <div className="flex items-start gap-4 mb-7">
      <div className={`flex-shrink-0 p-3 rounded-lg border ${section.tw.badge} group-hover:scale-105 transition-transform duration-300`}>
        <section.Icon className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <div className="eyebrow mb-1">
          <span className="eyebrow-dot" />
          Section {section.label}
        </div>
        <h2 className="text-2xl md:text-3xl font-black text-maxx-white uppercase tracking-tight">
          {section.title}
        </h2>
      </div>
    </div>

    <div className="text-maxx-mid leading-relaxed">
      {section.content}
    </div>
  </div>
);

/* ─── page ───────────────────────────────────────────────────── */
const Terms = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description"        content={description} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content="https://maxxpainn.com/terms" />
        <meta name="twitter:card"       content="summary_large_image" />
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
            <div className="max-w-7xl mx-auto px-4">

              {/* ── HEADER ── */}
              <div className="text-center mb-20">

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-none tracking-tighter">
                  <span className="text-maxx-white">TERMS OF </span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">SERVICE</span>
                </h1>

                <p className="text-xl md:text-2xl text-maxx-mid max-w-2xl mx-auto leading-relaxed mb-8">
                  Read carefully before entering the pain zone.
                </p>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-maxx-bg1/80 border border-maxx-violet/20 text-maxx-sub text-sm font-mono">
                  <AlertCircle className="w-4 h-4 text-maxx-violet" />
                  Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>

              </div>

              {/* ── LAYOUT ── */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* ── SIDEBAR ── */}
                <div className="hidden lg:block lg:col-span-4">
                  <div className="sticky top-32 space-y-1.5">
                    <h3 className="font-mono text-[0.62rem] tracking-[0.14em] uppercase text-maxx-sub mb-5 px-4">
                      Sections
                    </h3>
                    {sections.map((s) => (
                      <NavItem
                        key={s.id}
                        section={s}
                        isActive={activeSection === s.id}
                        onClick={scrollToSection}
                      />
                    ))}
                  </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="col-span-1 lg:col-span-8 space-y-4">
                  {sections.map((s) => (
                    <SectionCard key={s.id} section={s} />
                  ))}
                </div>

              </div>

              {/* ── DEGEN DISCLAIMER ── */}
              <div className="mt-16 relative bg-maxx-bg1/80 border-2 border-maxx-pink/30 rounded-lg p-8 md:p-12 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-pink/60 via-maxx-violet/40 to-transparent" />

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-grad-btn">
                    <AlertTriangle className="w-5 h-5 text-maxx-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black bg-grad-accent bg-clip-text text-transparent uppercase">
                    ⚠️ Degen Disclaimer
                  </h2>
                </div>

                <p className="text-base leading-[1.9] text-maxx-mid">
                  MAXXPAINN is an experimental project created by degens, for degens. This is{' '}
                  <strong className="text-maxx-pink">NOT</strong> financial advice. Cryptocurrency
                  investments carry <strong className="text-maxx-pink">HIGH RISK</strong> and can
                  result in <strong className="text-maxx-pink">TOTAL LOSS</strong>. Only participate
                  with funds you can afford to lose completely. We are not responsible for any
                  financial losses.{' '}
                  <strong className="text-maxx-violetLt">DYOR and make informed decisions. NFA! 🚨</strong>
                </p>
              </div>

              {/* ── BOTTOM CTA ── */}
              <div className="mt-6 relative bg-maxx-bg1/80 border-2 border-maxx-violet/25 rounded-lg p-10 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-maxx-violet/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/3 to-maxx-pink/3 pointer-events-none" />

                <div className="relative z-10">
                  <Shield className="w-12 h-12 text-maxx-violet mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-black text-maxx-white mb-3 tracking-tight">
                    Questions About These{' '}
                    <span className="bg-grad-accent bg-clip-text text-transparent">Terms?</span>
                  </h3>
                  <p className="text-maxx-mid mb-8 max-w-2xl mx-auto text-base leading-relaxed">
                    We're here to help clarify any part of our terms. Reach out through official channels.
                  </p>

                  <div className="flex flex-wrap justify-center gap-4">
                    <a
                      href={`https://t.me/${socials.telegram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="primary" skewed>
                        <Mail className="w-4 h-4" />
                        Contact Support
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </a>
                    <Link to="/privacy">
                      <Button variant="secondary">
                        <FileText className="w-4 h-4" />
                        Privacy Policy
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── FOOTER NOTE ── */}
              <div className="mt-8 text-center">
                <p className="font-mono text-[0.62rem] text-maxx-dim uppercase tracking-widest">
                  These terms are subject to change. Continued use after changes constitutes acceptance.
                </p>
              </div>

            </div>
          </main>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Terms;

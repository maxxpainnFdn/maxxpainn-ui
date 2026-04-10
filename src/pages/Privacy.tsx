/**
 * MAXXPAINN — Privacy Policy Page
 *
 * Design system: maxx-* tokens, btn-p / btn-s / eyebrow / pill / card-hover classes.
 * No raw Tailwind color names, no hex codes in JSX.
 */

import React, { useState, useEffect } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import {
  Fingerprint,
  Server,
  Share2,
  Lock,
  Globe,
  Mail,
  ChevronRight,
  AlertCircle,
  Shield,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import socials from '@/config/socials';
import Button from '@/components/button/Button';

const title       = "MaxxPainn Privacy Policy – How We Protect Your Data";
const description = "Learn how MAXXPAINN handles your data with a User Sovereignty policy. No selling, full transparency.";

/* ─── sections data ──────────────────────────────────────────── */
const sections = [
  {
    id: "collection",
    label: "01",
    title: "Information Collection",
    Icon: Fingerprint,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
      border: "border-l-maxx-violet",
      bg:     "bg-maxx-violet/5",
      dot:    "bg-maxx-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          We collect information you provide directly to us, such as when you create an account,
          participate in our community, or contact us for support.
        </p>
        <ul className="space-y-3">
          {[
            { label: "Wallet & Transaction Data", desc: "Public wallet addresses and on-chain activity interactions with our smart contracts." },
            { label: "Community Data",             desc: "Discord IDs, Twitter handles, and engagement metrics within the ecosystem." },
            { label: "Technical Telemetry",        desc: "Device type, browser version, and IP address for security and optimization." },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-violet/10 hover:border-maxx-violet/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-maxx-violet mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
              <span className="text-maxx-bright text-sm leading-relaxed">
                <span className="text-maxx-white font-bold">{label}: </span>{desc}
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "usage",
    label: "02",
    title: "Data Usage Protocol",
    Icon: Server,
    tw: {
      badge:  "bg-blue-500/10 border-blue-500/30 text-blue-400",
      accent: "via-blue-500/40",
      border: "border-l-blue-500",
      bg:     "bg-blue-500/5",
      dot:    "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          We use the information we collect to operate, maintain, and enhance the MAXXPAINN protocol:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            "Process blockchain transactions",
            "Detect and prevent botting/sybil attacks",
            "Distribute community rewards/airdrops",
            "Analyze protocol usage trends",
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
    id: "sharing",
    label: "03",
    title: "Information Sharing",
    Icon: Share2,
    tw: {
      badge:  "bg-maxx-pink/10 border-maxx-pink/30 text-maxx-pink",
      accent: "via-maxx-pink/40",
      border: "border-l-maxx-pink",
      bg:     "bg-maxx-pink/5",
      dot:    "bg-maxx-pink shadow-[0_0_8px_rgba(255,45,120,0.6)]",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          We strictly adhere to a <span className="text-maxx-pink font-bold">"User Sovereignty"</span> policy.
          We do not sell your personal data. Sharing occurs only in these specific scenarios:
        </p>
        <ul className="space-y-3">
          {[
            { label: "Service Providers", desc: "Trusted partners who assist in infrastructure (e.g., RPC providers)." },
            { label: "Legal Compliance",  desc: "Only when absolutely compelled by binding legal authority." },
            { label: "Explicit Consent",  desc: "When you authorize a connection to a third-party dApp." },
          ].map(({ label, desc }) => (
            <li key={label} className="flex items-start gap-4 p-4 rounded-lg bg-maxx-bg0/60 border border-maxx-pink/10 hover:border-maxx-pink/25 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-sm bg-maxx-pink mt-2.5 flex-shrink-0 shadow-[0_0_8px_rgba(255,45,120,0.6)]" />
              <span className="text-maxx-bright text-sm leading-relaxed">
                <span className="text-maxx-white font-bold">{label}: </span>{desc}
              </span>
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    id: "security",
    label: "04",
    title: "Security Measures",
    Icon: Lock,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
      border: "border-l-maxx-violet",
      bg:     "bg-maxx-violet/5",
      dot:    "bg-maxx-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    },
    content: (
      <p className="text-base leading-[1.85] border-l-4 border-maxx-violet pl-6 py-3 bg-maxx-violet/5 rounded-r-md text-maxx-bright">
        We implement industry-standard cryptographic security measures. However, remember that
        interaction with the blockchain is inherently public. While we protect off-chain data,
        on-chain transactions are permanent and visible to everyone.
      </p>
    ),
  },
  {
    id: "rights",
    label: "05",
    title: "Your Rights",
    Icon: Globe,
    tw: {
      badge:  "bg-maxx-violet/10 border-maxx-violet/30 text-maxx-violet",
      accent: "via-maxx-violet/50",
      border: "border-l-maxx-violet",
      bg:     "bg-maxx-violet/5",
      dot:    "bg-maxx-violet shadow-[0_0_8px_rgba(139,92,246,0.6)]",
    },
    content: (
      <>
        <p className="text-maxx-mid text-base leading-[1.85] mb-6">
          Depending on your jurisdiction (GDPR, CCPA, etc.), you have specific rights regarding your data:
        </p>
        <div className="flex flex-wrap gap-3">
          {['Access', 'Correction', 'Deletion', 'Portability', 'Restriction'].map((right) => (
            <span
              key={right}
              className="px-4 py-2 rounded-lg bg-maxx-violet/10 border border-maxx-violet/30 text-maxx-violetLt text-xs font-mono font-bold uppercase tracking-widest"
            >
              {right}
            </span>
          ))}
        </div>
      </>
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
    {/* top accent */}
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
const Privacy = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 120;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  // Update active section on scroll
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
        <meta property="og:url"         content="https://maxxpainn.com/privacy" />
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
                  <span className="text-maxx-white">PRIVACY </span>
                  <span className="bg-grad-accent bg-clip-text text-transparent">POLICY</span>
                </h1>

                <p className="text-xl md:text-2xl text-maxx-mid max-w-2xl mx-auto leading-relaxed mb-8">
                  Your data is yours. Here's how we keep it that way.
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
                      Contents
                    </h3>
                    {sections.map((s) => (
                      <NavItem
                        key={s.id}
                        section={s}
                        isActive={activeSection === s.id}
                        onClick={scrollToSection}
                      />
                    ))}

                    {/* contact card */}
                    <div className="mt-8 relative bg-maxx-bg1/80 border border-maxx-violet/20 rounded-lg p-6 overflow-hidden">
                      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-maxx-violet/50 via-maxx-pink/30 to-transparent" />
                      <Mail className="w-8 h-8 text-maxx-violet mb-3" />
                      <h4 className="font-black text-maxx-white mb-2">Questions?</h4>
                      <p className="text-xs text-maxx-sub mb-4 leading-relaxed">
                        Our team is available via encrypted channels for any privacy concerns.
                      </p>
                      <a
                        href={`https://t.me/${socials.telegram}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-maxx-violet hover:text-maxx-violetLt transition-colors uppercase tracking-wider flex items-center gap-1 font-mono"
                      >
                        Contact Support <ChevronRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* ── CONTENT ── */}
                <div className="col-span-1 lg:col-span-8 space-y-4">
                  {sections.map((s) => (
                    <SectionCard key={s.id} section={s} />
                  ))}
                </div>

              </div>

              {/* ── BOTTOM CTA ── */}
              <div className="mt-16 relative bg-maxx-bg1/80 border-2 border-maxx-violet/25 rounded-lg p-10 text-center overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-maxx-violet/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-maxx-violet/3 to-maxx-pink/3 pointer-events-none" />

                <div className="relative z-10">
                  <Shield className="w-12 h-12 text-maxx-violet mx-auto mb-4" />
                  <h3 className="text-2xl md:text-3xl font-black text-maxx-white mb-3 tracking-tight">
                    Questions About Your{' '}
                    <span className="bg-grad-accent bg-clip-text text-transparent">Privacy?</span>
                  </h3>
                  <p className="text-maxx-mid mb-8 max-w-2xl mx-auto text-base leading-relaxed">
                    We're committed to transparency. Reach out through official channels if you need clarification.
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
                    <Link to="/terms">
                      <Button variant="secondary">
                        <FileText className="w-4 h-4" />
                        Terms of Service
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── DISCLAIMER ── */}
              <div className="mt-8 text-center">
                <p className="font-mono text-[0.62rem] text-maxx-dim uppercase tracking-widest">
                  This policy is subject to change. We'll notify you of significant updates.
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

export default Privacy;

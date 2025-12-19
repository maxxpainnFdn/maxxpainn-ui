import React, { useState } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { 
  Shield, 
  Eye, 
  Lock, 
  Share2, 
  FileText, 
  Mail, 
  ChevronRight, 
  Fingerprint,
  Server,
  Globe,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('collection');

  const scrollToSection = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 120;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const sections = [
    {
      id: "collection",
      title: "Information Collection",
      icon: <Fingerprint className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-4">We collect information you provide directly to us, such as when you create an account, participate in our community, or contact us for support.</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Wallet & Transaction Data:</span> Public wallet addresses and on-chain activity interactions with our smart contracts.</span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Community Data:</span> Discord IDs, Twitter handles, and engagement metrics within the ecosystem.</span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Technical Telemetry:</span> Device type, browser version, and IP address for security and optimization.</span>
            </li>
          </ul>
        </>
      )
    },
    {
      id: "usage",
      title: "Data Usage Protocol",
      icon: <Server className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-4">We use the information we collect to operate, maintain, and enhance the MAXXPAINN protocol:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Process blockchain transactions</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Detect and prevent botting/sybil attacks</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Distribute community rewards/airdrops</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Analyze protocol usage trends</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "sharing",
      title: "Information Sharing",
      icon: <Share2 className="w-6 h-6" />,
      content: (
        <>
          <p className="mb-4">We strictly adhere to a "User Sovereignty" policy. We do not sell your personal data. Sharing occurs only in these specific scenarios:</p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Service Providers:</span> Trusted partners who assist in infrastructure (e.g., RPC providers).</span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Legal Compliance:</span> Only when absolutely compelled by binding legal authority.</span>
            </li>
            <li className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
              <span className="text-gray-300 leading-relaxed"><span className="text-white font-bold">Explicit Consent:</span> When you authorize a connection to a third-party dApp.</span>
            </li>
          </ul>
        </>
      )
    },
    {
      id: "security",
      title: "Security Measures",
      icon: <Lock className="w-6 h-6" />,
      content: (
        <p className="text-gray-400 leading-relaxed">
          We implement industry-standard cryptographic security measures. However, remember that interaction with the blockchain is inherently public. 
          While we protect off-chain data, on-chain transactions are permanent and visible to everyone.
        </p>
      )
    },
    {
      id: "rights",
      title: "Your Rights",
      icon: <Globe className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <p className="text-gray-400 leading-relaxed mb-4">Depending on your jurisdiction (GDPR, CCPA, etc.), you have specific rights regarding your data:</p>
          <div className="flex flex-wrap gap-3">
            {['Access', 'Correction', 'Deletion', 'Portability', 'Restriction'].map((right) => (
              <span key={right} className="px-4 py-2 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
                {right}
              </span>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <Navigation />
      
      {/* --- BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-20 right-10 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-40 left-10 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
      </div>
      
      <main className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* --- HEADER --- */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4 text-purple-500 animate-pulse" />
              <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
                Legal Documentation
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              <span className="text-white">PRIVACY </span>
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                POLICY
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 font-light mb-4">
              Your privacy matters. Here's how we protect it.
            </p>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/40 border border-white/10 text-gray-400 text-sm font-mono">
              <AlertCircle className="w-4 h-4" />
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>

          {/* --- LAYOUT GRID --- */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* --- STICKY SIDEBAR --- */}
            <div className="hidden lg:block lg:col-span-4">
              <div className="sticky top-32 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-4">
                  Contents
                </h3>
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-all duration-300 ${
                      activeSection === section.id 
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' 
                        : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-3 font-medium text-sm">
                      {React.cloneElement(section.icon, { className: "w-4 h-4" })}
                      {section.title}
                    </span>
                    {activeSection === section.id && (
                      <ChevronRight className="w-4 h-4 animate-pulse" />
                    )}
                  </button>
                ))}

                {/* Contact Card */}
                <div className="mt-8 relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
                  <Mail className="w-8 h-8 text-purple-400 mb-3" />
                  <h4 className="font-bold text-white mb-2">
                    Questions?
                  </h4>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    Our team is available via encrypted channels for privacy concerns.
                  </p>
                  <a 
                    href="#" 
                    className="text-xs font-bold text-purple-400 hover:text-purple-300 transition-colors uppercase tracking-wider flex items-center gap-1"
                  >
                    Contact Support <ChevronRight className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>

            {/* --- CONTENT AREA --- */}
            <div className="col-span-1 lg:col-span-8 space-y-6">
              {sections.map((section) => (
                <div 
                  id={section.id} 
                  key={section.id}
                  className="relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 hover:border-white/20 transition-all duration-300 overflow-hidden group"
                >
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-50" />

                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex-shrink-0 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20 transition-colors">
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                        {section.title}
                      </h2>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="text-gray-400 leading-relaxed">
                    {section.content}
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* --- BOTTOM CTA --- */}
          <div className="mt-16 relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-10 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
            
            <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-white mb-3">
              Questions About Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Privacy?</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're committed to transparency and protecting your data. Reach out through our official channels if you need clarification.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`https://t.me/${socials.telegram}`} 
                target="_blank" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-400 font-bold text-sm uppercase tracking-wider hover:bg-purple-950/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
              <Link to="/terms" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-950/30 border border-white/10 text-gray-400 font-bold text-sm uppercase tracking-wider hover:bg-gray-950/50 hover:border-white/20 transition-all duration-300"
              >
                <FileText className="w-4 h-4" />
                Terms of Service
              </Link>
            </div>
          </div>

          {/* --- DISCLAIMER --- */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest">
              This policy is subject to change. We'll notify you of significant updates.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;
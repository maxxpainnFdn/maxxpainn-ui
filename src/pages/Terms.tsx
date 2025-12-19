import React, { useState } from 'react';
import Navigation from '@/components/nav/Navigation';
import Footer from '@/components/Footer';
import { 
  Shield, 
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
  Skull
} from 'lucide-react';
import { Link } from 'react-router-dom';
import socials from '@/config/socials';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('acceptance');

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
      id: "acceptance",
      title: "Acceptance of Terms",
      icon: <CheckCircle className="w-6 h-6" />,
      content: (
        <p className="text-gray-400 leading-relaxed">
          By accessing or using MAXXPAINN services, you agree to be bound by these Terms of Service. 
          If you disagree with any part of these terms, you may not access our services. Your continued 
          use of the platform constitutes acceptance of any updates to these terms.
        </p>
      )
    },
    {
      id: "service",
      title: "Description of Service",
      icon: <Layers className="w-6 h-6" />,
      content: (
        <>
          <p className="text-gray-400 leading-relaxed mb-4">
            MAXXPAINN is a cryptocurrency token and community platform. Our services include:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Token trading and transactions</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Community participation and governance</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Educational content and resources</span>
            </div>
            <div className="p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
              <span className="text-gray-300 leading-relaxed">Social features and interactions</span>
            </div>
          </div>
        </>
      )
    },
    {
      id: "risk",
      title: "Risk Disclosure",
      icon: <AlertTriangle className="w-6 h-6" />,
      content: (
        <>
          <div className="relative bg-red-950/30 border-2 border-red-500/30 rounded-2xl p-6 mb-6 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
            <div className="flex items-start gap-3 mb-3">
              <Skull className="w-6 h-6 text-red-400 flex-shrink-0 animate-pulse" />
              <p className="text-red-300 font-black text-lg uppercase tracking-wider">⚠️ HIGH RISK WARNING</p>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Cryptocurrency trading involves substantial risk and may result in complete loss of funds. 
              Past performance does not guarantee future results. Only invest what you can afford to lose.
            </p>
          </div>
          <p className="text-gray-400 leading-relaxed mb-4">Understanding the risks:</p>
          <ul className="space-y-3">
            {[
              'Extreme price volatility',
              'Regulatory uncertainty',
              'Technology risks and smart contract vulnerabilities',
              'Market manipulation risks',
              'Liquidity risks'
            ].map((risk, index) => (
              <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 shadow-lg shadow-red-400/50" />
                <span className="text-gray-300 leading-relaxed">{risk}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: "responsibilities",
      title: "User Responsibilities",
      icon: <UserCheck className="w-6 h-6" />,
      content: (
        <>
          <p className="text-gray-400 leading-relaxed mb-4">
            By using our services, you agree to:
          </p>
          <ul className="space-y-3">
            {[
              { title: 'Provide accurate information', desc: 'All information provided must be truthful and up-to-date' },
              { title: 'Comply with laws', desc: 'Follow all applicable laws and regulations in your jurisdiction' },
              { title: 'Maintain security', desc: 'Keep your wallet and private keys secure at all times' },
              { title: 'Trade ethically', desc: 'Do not engage in market manipulation or fraudulent activities' },
              { title: 'Respect community', desc: 'Treat other community members with respect' }
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0 shadow-lg shadow-purple-400/50" />
                <span className="text-gray-300 leading-relaxed">
                  <span className="text-white font-bold">{item.title}:</span> {item.desc}
                </span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: "prohibited",
      title: "Prohibited Activities",
      icon: <ShieldAlert className="w-6 h-6" />,
      content: (
        <>
          <p className="text-gray-400 leading-relaxed mb-4">
            The following activities are strictly prohibited:
          </p>
          <ul className="space-y-3">
            {[
              'Money laundering or terrorist financing',
              'Market manipulation or insider trading',
              'Hacking, phishing, or other malicious activities',
              'Spam, harassment, or abusive behavior',
              'Violation of intellectual property rights'
            ].map((activity, index) => (
              <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0 shadow-lg shadow-red-400/50" />
                <span className="text-gray-300 leading-relaxed">{activity}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: "disclaimers",
      title: "Disclaimers",
      icon: <AlertOctagon className="w-6 h-6" />,
      content: (
        <>
          <p className="text-gray-400 leading-relaxed mb-4 font-bold">
            IMPORTANT DISCLAIMERS:
          </p>
          <ul className="space-y-3">
            {[
              'MAXXPAINN is provided "as is" without warranties of any kind',
              'We do not guarantee profits or prevent losses',
              'This is not financial, investment, or legal advice',
              'We are not responsible for third-party services or platforms',
              'Transactions on the blockchain are irreversible'
            ].map((disclaimer, index) => (
              <li key={index} className="flex items-start gap-3 p-4 rounded-xl bg-black/30 border border-white/5 hover:bg-black/50 hover:border-white/10 transition-all duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-2 flex-shrink-0 shadow-lg shadow-orange-400/50" />
                <span className="text-gray-300 leading-relaxed">{disclaimer}</span>
              </li>
            ))}
          </ul>
        </>
      )
    },
    {
      id: "liability",
      title: "Limitation of Liability",
      icon: <Scale className="w-6 h-6" />,
      content: (
        <p className="text-gray-400 leading-relaxed">
          To the maximum extent permitted by law, MAXXPAINN and its team shall not be liable 
          for any direct, indirect, incidental, special, or consequential damages arising from 
          the use of our services, including but not limited to financial losses, loss of data, 
          or business interruption.
        </p>
      )
    },
    {
      id: "governing",
      title: "Governing Law",
      icon: <FileText className="w-6 h-6" />,
      content: (
        <p className="text-gray-400 leading-relaxed">
          These terms shall be governed by and construed in accordance with applicable laws. 
          Any disputes shall be resolved through binding arbitration in accordance with international 
          arbitration rules. You waive any right to participate in class-action lawsuits.
        </p>
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
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-red-500/20 mb-8 backdrop-blur-md">
              <Shield className="w-4 h-4 text-red-500 animate-pulse" />
              <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent uppercase">
                Legal Agreement
              </span>
            </div>

            <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-none">
              <span className="text-white">TERMS OF </span>
              <span className="bg-gradient-to-r from-red-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                SERVICE
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 font-light mb-4">
              Read carefully before entering the pain zone.
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
                  Sections
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

                {/* Warning Card */}
                <div className="mt-8 relative bg-red-950/30 backdrop-blur-xl border border-red-500/30 rounded-2xl p-6 overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
                  <Skull className="w-8 h-8 text-red-400 mb-3 animate-pulse" />
                  <h4 className="font-bold text-white mb-2">
                    Degen Warning
                  </h4>
                  <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                    "This is not financial advice. This is therapy for degens."
                  </p>
                  <p className="text-xs text-red-400 font-bold uppercase tracking-wider">
                    Only invest what you can afford to lose... again.
                  </p>
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
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                    section.id === 'risk' ? 'via-red-500/50' : 'via-purple-500/50'
                  } to-transparent opacity-50`} />

                  {/* Header with Icon */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`flex-shrink-0 p-3 rounded-xl ${
                      section.id === 'risk' 
                        ? 'bg-red-500/10 border border-red-500/20 text-red-400 group-hover:bg-red-500/20' 
                        : 'bg-purple-500/10 border border-purple-500/20 text-purple-400 group-hover:bg-purple-500/20'
                    } transition-colors`}>
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
              Questions About These <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Terms?</span>
            </h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              We're here to help clarify any part of our terms. Reach out through our official channels for assistance.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              <a href={`https://t.me/${socials.telegram}`} 
                 target="_blank" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-purple-950/30 border border-purple-500/20 text-purple-400 font-bold text-sm uppercase tracking-wider hover:bg-purple-950/50 hover:border-purple-500/30 transition-all duration-300"
              >
                <Mail className="w-4 h-4" />
                Contact Support
              </a>
              <Link to="/privacy"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gray-950/30 border border-white/10 text-gray-400 font-bold text-sm uppercase tracking-wider hover:bg-gray-950/50 hover:border-white/20 transition-all duration-300"
              >
                <FileText className="w-4 h-4" />
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* --- DISCLAIMER --- */}
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-600 uppercase tracking-widest">
              These terms are subject to change. Continued use after changes constitutes acceptance.
            </p>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
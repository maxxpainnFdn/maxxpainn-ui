import React from 'react';
import { Flame, Twitter, Send, MessageCircle, BookOpen, Zap, Shield, TrendingUp, Mail } from 'lucide-react';
import socials from '@/config/socials';
import { SiX } from '@icons-pack/react-simple-icons';

// Mock Link component
const Link = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => (
  <a href={to} className={className}>{children}</a>
);

const Footer: React.FC = () => {
  return (
    <footer className="footer relative bg-gradient-to-b from-black via-gray-950 to-black border-t-2 border-purple-500/30 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-1 max-w-7xl mx-auto px-4 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <Zap className="w-6 h-6 md:w-8 md:h-8 text-purple-500" fill="currentColor" />
                <div className="absolute inset-0 bg-purple-500 blur-xl opacity-50"></div>
              </div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-black">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MAXX</span>
                <span className="text-pink-600">PAINN</span>
              </h3>
            </div>

            <p className="text-gray-300 text-lg mb-6 leading-relaxed max-w-md">
              Transforming crypto pain into unstoppable power.
              Built by degens, for degens, with degens.
            </p>

            {/* Power Flow Badge */}
            <div className="inline-flex items-center gap-3  py-3 ">
              <Flame className="w-5 h-5 text-pink-600" />
              <div className="flex items-center gap-2 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                <span>Pain</span>
                <span>→</span>
                <span>Power</span>
                <span>→</span>
                <span>Profit</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-8">
              <p className="text-gray-400 text-sm font-semibold mb-4 uppercase tracking-wider">
                Join the Movement
              </p>
              <div className="flex gap-4">
                {[
                  { icon: SiX, href: `https://x.com/${socials.x}`, label: 'X', color: 'hover:bg-blue-500/20 hover:border-blue-500/50' },
                  { icon: Send, href: `https://t.me/${socials.telegram}`, label: 'Telegram', color: 'hover:bg-cyan-500/20 hover:border-cyan-500/50' },
                  { icon: Mail, href: `https://mailto:${socials.email}`, label: 'Email', color: 'hover:bg-purple-500/20 hover:border-purple-500/50' },
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    aria-label={social.label}
                    className={`group w-12 h-12 rounded-xl bg-gray-800/60 border-2 border-gray-700/50 ${social.color} transition-all duration-300 flex items-center justify-center hover:scale-110`}
                  >
                    <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'How it Works', to: '/how-it-works' },
                { name: 'Mint', to: '/mint' },
                { name: 'Clans', to: '/clans' },
                { name: 'Leaderboard', to: '/leaderboard' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="group text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-purple-400" />
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { name: 'Manifesto', to: '/manifesto' },
                { name: 'Whitepaper', to: '/whitepaper' },
                { name: 'Tokenomics', to: '/tokenomics' },
                { name: 'Roadmap', to: '/roadmap' },
                { name: 'FAQ', to: '/faq' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="group text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-400" />
              Legal & Support
            </h4>
            <ul className="space-y-3 mb-6">
              {[
                { name: 'Privacy Policy', to: '/privacy' },
                { name: 'Terms of Service', to: '/terms' },
              ].map((link, idx) => (
                <li key={idx}>
                  <Link
                    to={link.to}
                    className="group text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-purple-400 hover:to-pink-400 transition-all duration-200 inline-flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider with gradient */}
        <div className="relative h-px mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <div className="text-gray-400 text-sm">
            © 2025 MAXXPAINN. Built with pain, powered by degens.
          </div>

          {/* Contract Address or Status */}
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/60 border border-purple-500/20 rounded-lg">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-gray-400 text-sm font-mono">Network: Solana</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className=" p-6  text-center">
          <div className="flex items-start gap-3">
            <Flame className="w-5 h-5 text-pink-400 flex-shrink-0 mt-1" />
            <div>
              <p className="text-sm text-gray-400 leading-relaxed mb-2">
                <span className="font-bold text-pink-400">DISCLAIMER:</span> MAXXPAINN is an experimental project. This is <span className="text-pink-400 font-semibold">NOT</span> financial advice.
                Cryptocurrency investments carry high risk. Only invest what you can afford to lose.
              </p>
              <p className="text-xs text-gray-500 italic">
                "This is not financial advice. This is therapy for degens." 🔥
              </p>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

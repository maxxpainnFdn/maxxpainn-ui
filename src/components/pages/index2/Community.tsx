import {
  MessageCircle,
  Send,
  Users,
  ArrowRight,
  ExternalLink,
  Heart,
} from 'lucide-react';
import Button from '../../button/Button';
import { SiX } from '@icons-pack/react-simple-icons';
import { useIsMobile } from '@/hooks/useIsMobile';

const Community = () => {
  const isMobile = useIsMobile();

  return (
    <section className="relative py-32 bg-black overflow-hidden">
      {/* ===== BACKGROUND ===== */}
      <div className="absolute inset-0 pointer-events-none">
        {!isMobile ? (
          <>
            <div className="absolute inset-0 opacity-15">
              <div
                className="absolute top-40 right-10 w-[500px] h-[500px] bg-purple-600 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '8s' }}
              />
              <div
                className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-pink-500 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse"
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.03)_1px,transparent_1px)] bg-[size:100px_100px] opacity-20" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/10 via-transparent to-pink-900/10" />
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-gray-900/50 border border-purple-500/20 mb-8 backdrop-blur-md">
            <Heart className="w-4 h-4 text-purple-500 animate-pulse" />
            <span className="text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent uppercase">
              Join The Movement
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-none">
            <span className="text-white">WE ARE </span>
            <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              LEGION
            </span>
          </h2>

          <p className="text-lg xs:text-xl sm:text-2xl text-gray-400 max-w-2xl mx-auto font-light">
            <span className="text-white font-bold">127K+ degens</span> who
            earned their spot through pain
          </p>
        </div>

        {/* Channel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
          {/* X / Twitter */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <SiX className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The Loudspeaker
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Alpha calls, shitposting, and coping together. Join the
                conversation.
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Follow on X
              </div>
            </div>
          </a>

          {/* Telegram Group */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-green-500/10 text-green-400 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Send className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The War Room
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Live coordinated raids and mental health support. 24/7 active.
              </p>
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Join Telegram Group
              </div>
            </div>
          </a>

          {/* Telegram Channel */}
          <a
            href="#"
            className="group relative bg-gray-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 hover:bg-black hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <div className="relative z-10 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 rounded-2xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <ExternalLink className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                The Bunker
              </h3>
              <p className="text-gray-400 mb-6 flex-grow">
                Deep dive research, governance proposals, and roadmap updates.
              </p>
              <div className="flex items-center gap-2 text-purple-400 font-mono text-sm">
                <Users className="w-4 h-4" /> Join Telegram Channel
              </div>
            </div>
          </a>
        </div>

        {/* Final CTA */}
        <div className="text-center relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] animate-pulse" />
          <Button variant="secondary" size="lg" className="rounded-2xl">
            JOIN THE REVOLUTION <ArrowRight className="w-8 h-8" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Community;

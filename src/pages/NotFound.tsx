import { useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/nav/Navigation";
import Footer from "@/components/Footer";
import { Home, Rocket, Map, Zap, Ghost, RefreshCw, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();
  const [counter, setCounter] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );

    // Pain counter that keeps incrementing
    const interval = setInterval(() => {
      setCounter(prev => prev + Math.floor(Math.random() * 100));
    }, 100);

    return () => clearInterval(interval);
  }, [location.pathname]);

  const quickLinks = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Rocket, label: "Mint", path: "/mint" },
    { icon: Map, label: "Roadmap", path: "/roadmap" },
    { icon: Zap, label: "Whitepaper", path: "/whitepaper" },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-hidden">
      <Navigation />
      
      {/* --- VOID BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none">
        {/* Deep black base */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Central Black Hole Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Outer glow rings */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-purple-500/10 animate-ping" style={{ animationDuration: '3s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-red-500/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-pink-500/10 animate-ping" style={{ animationDuration: '2s', animationDelay: '1s' }} />
          
          {/* Accretion disk gradient */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-conic from-purple-600/20 via-transparent via-50% to-red-600/20 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }} />
          
          {/* Core void */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-black rounded-full shadow-[0_0_100px_50px_rgba(0,0,0,1)]" />
        </div>

        {/* Floating particles being sucked in */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 3}s`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.02)_1px,transparent_1px)] bg-[size:80px_80px] opacity-10" />
      </div>

      <main className="relative z-10 pt-32 pb-20 min-h-[80vh] flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* --- LEFT: CONTENT --- */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              
              {/* Error Code */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-950/30 border border-red-500/20 mb-6 backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-mono text-red-400 uppercase tracking-wider">
                  Error Code: 404_VOID_BREACH
                </span>
              </div>
              
              {/* Headline */}
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-none">
                <span className="block text-white">YOU'VE</span>
                <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
                  BEEN LOST
                </span>
                <span className="block text-white">TO THE VOID</span>
              </h1>
              
              {/* Description */}
              <p className="text-xl text-gray-400 mb-8 max-w-md mx-auto lg:mx-0">
                This page was consumed by the infinite darkness. Not even your crypto can save you here.
              </p>
              
              {/* Path info */}
              <div className="flex flex-col sm:flex-row gap-4 items-center lg:items-start mb-10">
                <div className="px-4 py-3 rounded-xl bg-gray-900/60 border border-white/10 backdrop-blur-md">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Requested Path</p>
                  <p className="text-sm text-white font-mono truncate max-w-[250px]">{location.pathname}</p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-gray-900/60 border border-white/10 backdrop-blur-md">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Pain Generated</p>
                  <p className="text-sm text-red-400 font-mono font-bold">{counter.toLocaleString()} units</p>
                </div>
              </div>
              
              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/">
                  <Button 
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 h-auto rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold uppercase tracking-wider shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                  >
                    <Home className={`w-5 h-5 transition-transform ${isHovered ? 'scale-110' : ''}`} />
                    Escape the Void
                  </Button>
                </Link>
                <Button 
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 h-auto rounded-2xl bg-transparent border-2 border-white/10 text-white font-bold uppercase tracking-wider hover:bg-white/5 hover:border-white/20 transition-all duration-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  Go Back
                </Button>
              </div>
            </div>

            {/* --- RIGHT: VISUAL --- */}
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                {/* Ghost illustration container */}
                <div className="relative w-72 h-72 md:w-96 md:h-96">
                  {/* Glow behind */}
                  <div className="absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-full blur-3xl" />
                  
                  {/* Main ghost/void entity */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative group">
                      {/* Outer ring */}
                      <div className="absolute -inset-8 rounded-full border-2 border-dashed border-purple-500/20 animate-spin" style={{ animationDuration: '30s' }} />
                      
                      {/* Middle ring */}
                      <div className="absolute -inset-4 rounded-full border border-white/10" />
                      
                      {/* Icon container */}
                      <div className="relative p-12 rounded-full bg-gradient-to-b from-gray-900/80 to-black border border-white/10 backdrop-blur-xl shadow-2xl shadow-purple-500/10">
                        <Ghost className="w-24 h-24 md:w-32 md:h-32 text-gray-600 group-hover:text-purple-400 transition-colors duration-500" />
                      </div>
                      
                      {/* Floating badges around */}
                      <div className="absolute -top-4 -right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-xs font-bold text-red-400 animate-bounce">
                        404
                      </div>
                      <div className="absolute -bottom-2 -left-4 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-400 animate-bounce" style={{ animationDelay: '0.5s' }}>
                        LOST
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* --- QUICK LINKS --- */}
          <div className="mt-20 pt-12 border-t border-white/5">
            <p className="text-center text-gray-600 text-xs uppercase tracking-[0.3em] mb-8 font-bold">
              Quick Navigation
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {quickLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="group flex items-center gap-2 px-5 py-3 rounded-xl bg-gray-900/40 border border-white/5 hover:border-purple-500/30 hover:bg-gray-900/60 transition-all duration-300 backdrop-blur-sm"
                >
                  <link.icon className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <span className="text-sm font-bold text-gray-400 group-hover:text-white transition-colors uppercase tracking-wider">
                    {link.label}
                  </span>
                  <ExternalLink className="w-3 h-3 text-gray-600 group-hover:text-purple-400 transition-colors opacity-0 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </div>

          {/* --- BOTTOM BRANDING --- */}
          <div className="mt-16 text-center">
            <p className="text-gray-700 text-sm">
              Even in the void, <span className="text-purple-500 font-bold">MAXXPAINN</span> finds a way.
            </p>
          </div>

        </div>
      </main>

      <Footer />

      {/* Custom animation for conic gradient */}
      <style>{`
        @keyframes spin {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
        .bg-gradient-conic {
          background: conic-gradient(from 0deg, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default NotFound;
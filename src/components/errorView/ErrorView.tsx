import React, { useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';

export default function ErrorView({  
  text = "", 
  className = "",
  Icon = null,
  onBack = null,
  onReload = null
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsVisible(true);
    
    // Generate random particles with better distribution
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 3 + 4,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
  }, []);

  // Derive display values from errorMessages lookup if available

  let DisplayIcon = (Icon) ? Icon : AlertCircle;

  return (
    <div className={`w-full flex flex-col items-center justify-center min-h-[500px] text-center px-6 relative ${className}`}>
      {/* Subtle radial gradient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px]"></div>
      </div>

      {/* Floating particles */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute bg-white rounded-full animate-float-particle"
          style={{
            left: `${particle.left}%`,
            top: `${particle.top}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: 0.2,
            animationDuration: `${particle.duration}s`,
            animationDelay: `${particle.delay}s`
          }}
        ></div>
      ))}

      {/* Main content */}
      <div className={`relative overflow-hidden z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Icon container with rings */}
        <div className="relative mb-10 flex justify-center items-center w-full">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* Outer rotating ring */}
            <div className="absolute w-44 h-44 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.08] rounded-full animate-spin-slow"></div>
            
            {/* Pulsing rings */}
            <div className="absolute w-36 h-36 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.12] rounded-full animate-ping-slow"></div>
            <div className="absolute w-36 h-36 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-white/[0.06] rounded-full animate-ping-slower"></div>
            
            {/* Orbiting dots */}
            <div className="absolute w-36 h-36 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slow">
              <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-white/50 rounded-full -ml-0.75 shadow-lg shadow-white/30"></div>
            </div>
            <div className="absolute w-36 h-36 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin-slower">
              <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-white/40 rounded-full -ml-0.75 shadow-lg shadow-white/20"></div>
            </div>

            {/* Icon circle */}
            <div className="absolute w-32 h-32 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center bg-gradient-to-br from-white/[0.06] to-white/[0.02] backdrop-blur-md rounded-full border border-white/[0.15] shadow-2xl shadow-white/[0.08] transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-transparent rounded-full opacity-40"></div>
              <DisplayIcon className="relative w-12 h-12 text-white/95 animate-icon-float drop-shadow-lg" strokeWidth={1.8} />
            </div>
          </div>
        </div>
        
        {/* Text content with staggered animations */}
        <div className={`transition-all duration-1000 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>   
          {/* Subtle underline effect */}
          <div className="flex justify-center mb-7">
            <div className="w-20 h-[2px] bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-full"></div>
          </div>
        </div>
        
        {text && (
          <p className={`text-gray-300 text:md md:text-lg font-semibold  mb-10 max-w-md leading-relaxed}`}>
            {text}
          </p>
        )}
        
        {(onBack || onReload) && (
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {onBack && (
              <button
                onClick={onBack}
                className={`group relative inline-flex items-center gap-3 px-10 py-4 bg-white text-black font-bold rounded-xl overflow-hidden transition-all duration-1000 delay-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform duration-300" />
                <span className="relative">Go Back</span>
                
                {/* Button glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white blur-xl -z-10 transition-opacity duration-300"></div>
              </button>
            )}
            
            {onReload && (
              <button
                onClick={onReload}
                className={`group relative inline-flex items-center gap-3 px-10 py-4 bg-white/10 text-white font-bold rounded-xl border border-white/20 overflow-hidden transition-all duration-1000 delay-300 hover:scale-105 hover:bg-white/15 hover:shadow-2xl hover:shadow-white/20 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              >
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span className="relative">Reload</span>
                
                {/* Button glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/30 blur-xl -z-10 transition-opacity duration-300"></div>
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ping-slow {
          0% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.4);
            opacity: 0;
          }
          100% {
            transform: scale(1.4);
            opacity: 0;
          }
        }

        @keyframes ping-slower {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-slower {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        @keyframes icon-float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes float-particle {
          0%, 100% {
            transform: translate(0, 0);
            opacity: 0.3;
          }
          50% {
            transform: translate(10px, -30px);
            opacity: 0.6;
          }
        }

        .animate-ping-slow {
          animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-ping-slower {
          animation: ping-slower 4s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 15s linear infinite;
        }

        .animate-spin-slower {
          animation: spin-slower 20s linear infinite;
        }

        .animate-icon-float {
          animation: icon-float 4s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import { X, Share2, Sparkles, Gift } from 'lucide-react';
import { Badge, BadgeProps } from './Badge';

interface BadgeRevealProps {
  badge: BadgeProps;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

// Box fragment that flies away on burst
const BoxFragment = ({
  index,
  color
}: {
  index: number;
  color: string;
}) => {
  const angles = [
    { x: -200, y: -300, rotate: -720 },
    { x: 200, y: -300, rotate: 720 },
    { x: -250, y: -150, rotate: -540 },
    { x: 250, y: -150, rotate: 540 },
    { x: -180, y: 100, rotate: -360 },
    { x: 180, y: 100, rotate: 360 },
    { x: -100, y: -350, rotate: -900 },
    { x: 100, y: -350, rotate: 900 },
  ];

  const angle = angles[index % angles.length];

  return (
    <div
      className="absolute w-12 h-12 opacity-0"
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        borderRadius: '4px',
        boxShadow: `0 0 20px ${color}80`,
        animation: `fragment-explode-${index} 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
      }}
    >
      <style>{`
        @keyframes fragment-explode-${index} {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(${angle.x}px, ${angle.y}px) rotate(${angle.rotate}deg) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
};

// Confetti particle
const ConfettiParticle = ({ delay, startX, color }: {
  delay: number;
  startX: number;
  color: string;
}) => (
  <div
    className="absolute top-0 opacity-0"
    style={{
      left: `${startX}%`,
      width: `${6 + Math.random() * 8}px`,
      height: `${6 + Math.random() * 8}px`,
      backgroundColor: color,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      animation: `confetti-fall ${2 + Math.random() * 1.5}s ease-out ${delay}s forwards`,
    }}
  />
);

// Light ray component
const LightRay = ({ angle, delay }: { angle: number; delay: number }) => (
  <div
    className="absolute top-1/2 left-1/2 w-2 h-40 opacity-0 origin-bottom"
    style={{
      background: 'linear-gradient(to top, rgba(255, 215, 0, 0.8), transparent)',
      transform: `translate(-50%, -100%) rotate(${angle}deg)`,
      animation: `ray-burst 0.8s ease-out ${delay}s forwards`,
    }}
  />
);

// Shockwave ring
const ShockwaveRing = ({ delay, color }: { delay: number; color: string }) => (
  <div
    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 pointer-events-none"
    style={{
      border: `4px solid ${color}`,
      boxShadow: `0 0 30px ${color}, inset 0 0 30px ${color}40`,
      animation: `shockwave ${0.8}s ease-out ${delay}s forwards`,
    }}
  />
);

export const BadgeReveal: React.FC<BadgeRevealProps> = ({
  badge,
  isOpen,
  onClose,
  onShare,
}) => {
  const [stage, setStage] = useState<'idle' | 'shaking' | 'burst' | 'revealed'>('idle');

  const confettiColors = [
    '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
    '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE',
    '#FF69B4', '#00CED1', '#FFD93D', '#6BCB77', '#FF8C00'
  ];

  const boxColors = ['#8B5CF6', '#7C3AED', '#6D28D9', '#5B21B6'];

  useEffect(() => {
    if (isOpen) {
      setStage('idle');

      // Start shaking after a brief moment
      const shakeTimer = setTimeout(() => {
        setStage('shaking');
      }, 300);

      // Burst open
      const burstTimer = setTimeout(() => {
        setStage('burst');
      }, 2800); // Shake for ~2.5 seconds

      // Show revealed state
      const revealTimer = setTimeout(() => {
        setStage('revealed');
      }, 3400);

      return () => {
        clearTimeout(shakeTimer);
        clearTimeout(burstTimer);
        clearTimeout(revealTimer);
      };
    } else {
      setStage('idle');
    }
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setStage('idle');
    onClose();
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100] transition-all duration-500"
        style={{
          background: stage === 'burst' || stage === 'revealed'
            ? 'radial-gradient(circle at center, rgba(20, 10, 40, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)'
            : 'rgba(0, 0, 0, 0.9)',
        }}
        onClick={stage === 'revealed' ? handleClose : undefined}
      />

      {/* Main Container */}
      <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative w-full max-w-lg mx-4 pointer-events-auto flex flex-col items-center">

          {/* === THE BOX === */}
          {(stage === 'idle' || stage === 'shaking') && (
            <div
              className={`
                relative w-40 h-40 cursor-pointer
                ${stage === 'shaking' ? 'animate-violent-shake' : 'animate-gentle-float'}
              `}
            >
              {/* Box glow */}
              <div
                className="absolute inset-0 -m-4 rounded-3xl transition-all duration-300"
                style={{
                  background: stage === 'shaking'
                    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)'
                    : 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                  animation: stage === 'shaking' ? 'glow-pulse 0.2s ease-in-out infinite' : 'none',
                }}
              />

              {/* Box body */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(145deg, #8B5CF6 0%, #6D28D9 50%, #5B21B6 100%)',
                  boxShadow: `
                    0 20px 60px rgba(139, 92, 246, 0.4),
                    inset 0 2px 0 rgba(255, 255, 255, 0.2),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.2)
                  `,
                }}
              >
                {/* Box shine */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)',
                  }}
                />

                {/* Ribbon horizontal */}
                <div
                  className="absolute top-1/2 left-0 right-0 h-6 -translate-y-1/2"
                  style={{
                    background: 'linear-gradient(180deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    boxShadow: '0 2px 10px rgba(255, 215, 0, 0.5)',
                  }}
                />

                {/* Ribbon vertical */}
                <div
                  className="absolute top-0 bottom-0 left-1/2 w-6 -translate-x-1/2"
                  style={{
                    background: 'linear-gradient(90deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
                    boxShadow: '0 0 10px rgba(255, 215, 0, 0.5)',
                  }}
                />

                {/* Bow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="relative w-12 h-12 rounded-full flex items-center justify-center"
                    style={{
                      background: 'radial-gradient(circle, #FFD700 0%, #FFA500 100%)',
                      boxShadow: '0 4px 20px rgba(255, 215, 0, 0.6)',
                    }}
                  >
                    <Gift className="w-6 h-6 text-purple-900" />
                  </div>
                </div>
              </div>

              {/* Particles escaping during shake */}
              {stage === 'shaking' && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 rounded-full"
                      style={{
                        background: confettiColors[i % confettiColors.length],
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `escape-particle ${0.5 + Math.random() * 0.5}s ease-out infinite`,
                        animationDelay: `${Math.random() * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Question marks / excitement during shake */}
              {stage === 'shaking' && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
                  ❓
                </div>
              )}
            </div>
          )}

          {/* === BURST EFFECTS === */}
          {(stage === 'burst' || stage === 'revealed') && (
            <>
              {/* Box fragments */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {stage === 'burst' && Array.from({ length: 8 }).map((_, i) => (
                  <BoxFragment
                    key={i}
                    index={i}
                    color={boxColors[i % boxColors.length]}
                  />
                ))}
              </div>

              {/* Light rays */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                {Array.from({ length: 12 }).map((_, i) => (
                  <LightRay key={i} angle={i * 30} delay={i * 0.02} />
                ))}
              </div>

              {/* Shockwaves */}
              <ShockwaveRing delay={0} color="rgba(255, 215, 0, 0.8)" />
              <ShockwaveRing delay={0.1} color="rgba(139, 92, 246, 0.6)" />
              <ShockwaveRing delay={0.2} color="rgba(255, 215, 0, 0.4)" />

              {/* Confetti explosion */}
              <div className="absolute inset-0 pointer-events-none" style={{ height: '200vh', top: '-50vh' }}>
                {Array.from({ length: 80 }).map((_, i) => (
                  <ConfettiParticle
                    key={i}
                    delay={Math.random() * 0.3}
                    startX={Math.random() * 100}
                    color={confettiColors[Math.floor(Math.random() * confettiColors.length)]}
                  />
                ))}
              </div>

              {/* Central flash */}
              {stage === 'burst' && (
                <div
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 215, 0, 0.8) 30%, transparent 70%)',
                    animation: 'flash-burst 0.5s ease-out forwards',
                  }}
                />
              )}
            </>
          )}

          {/* === REVEALED BADGE === */}
          {(stage === 'burst' || stage === 'revealed') && (
            <div
              className={`
                relative flex flex-col items-center
                ${stage === 'burst' ? 'animate-badge-emerge' : ''}
              `}
            >
              {/* Ambient glow behind badge */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(255, 215, 0, 0.4) 0%, rgba(255, 215, 0, 0.1) 40%, transparent 70%)',
                  filter: 'blur(40px)',
                  animation: 'glow-breathe 2s ease-in-out infinite',
                }}
              />

              {/* Rotating sparkle ring */}
              <div
                className="absolute top-8 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full pointer-events-none"
                style={{
                  border: '2px dashed rgba(255, 215, 0, 0.3)',
                  animation: 'spin-slow 10s linear infinite',
                }}
              >
                {[0, 60, 120, 180, 240, 300].map((angle) => (
                  <Sparkles
                    key={angle}
                    className="absolute w-4 h-4 text-yellow-400"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${angle}deg) translateY(-110px) rotate(-${angle}deg)`,
                    }}
                  />
                ))}
              </div>

              {/* Header */}
              <div
                className={`
                  text-center mb-4 transition-all duration-700
                  ${stage === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
                `}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl animate-bounce">🎉</span>
                  <span
                    className="text-yellow-400 text-xs font-bold tracking-[0.4em] uppercase"
                    style={{
                      textShadow: '0 0 20px rgba(255, 215, 0, 0.8)',
                    }}
                  >
                    New Achievement
                  </span>
                  <span className="text-3xl animate-bounce" style={{ animationDelay: '0.1s' }}>🎉</span>
                </div>

                <h1
                  className="text-3xl md:text-4xl font-black text-transparent bg-clip-text"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #FFD700 0%, #FFA500 25%, #FFD700 50%, #FFEC8B 75%, #FFD700 100%)',
                    backgroundSize: '200% auto',
                    animation: 'shimmer 2s linear infinite',
                    WebkitBackgroundClip: 'text',
                  }}
                >
                  UNLOCKED!
                </h1>
              </div>

              {/* Badge */}
              <div className="relative w-48 h-64 mb-4">
                <Badge
                  badge={{
                    ...badge,
                    isUnlocked: true,
                    showDescription: 'none',
                    enableTilt: true,
                    enableGlow: true,
                    glowIntensity: 'high',
                  }}
                />
              </div>

              {/* Badge info card */}
              <div
                className={`
                  w-full max-w-sm rounded-2xl p-6 transition-all duration-700 delay-300
                  ${stage === 'revealed' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
                `}
                style={{
                  background: 'linear-gradient(145deg, rgba(20, 20, 35, 0.95) 0%, rgba(10, 10, 20, 0.98) 100%)',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 215, 0, 0.1)',
                }}
              >
                <h2 className="text-2xl font-bold text-white text-center mb-2">
                  {badge.name}
                </h2>
                <p className="text-white/60 text-sm text-center mb-5">
                  {badge.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Type</span>
                    <p className="text-white font-semibold capitalize text-sm">{badge.type}</p>
                  </div>
                  <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] text-white/40 uppercase tracking-wider block">Tier</span>
                    <p className="text-white font-semibold capitalize text-sm">{badge.element}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-center gap-3">
                  {onShare && (
                    <button
                      onClick={onShare}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-medium hover:bg-white/20 hover:scale-105 transition-all duration-300 border border-white/10"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>
                  )}
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-xl font-bold hover:scale-105 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#1a1a2e',
                      boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)',
                    }}
                  >
                    Awesome! 🎊
                  </button>
                </div>
              </div>

              {/* Close button */}
              {stage === 'revealed' && (
                <button
                  onClick={handleClose}
                  className="absolute -top-2 -right-2 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/10"
                >
                  <X className="w-5 h-5 text-white/70" />
                </button>
              )}
            </div>
          )}

          {/* Teaser text during shake */}
          {stage === 'shaking' && (
            <p
              className="mt-8 text-lg text-white/80 font-medium animate-pulse text-center"
              style={{
                textShadow: '0 0 20px rgba(139, 92, 246, 0.8)',
              }}
            >
              Something amazing is inside...
            </p>
          )}
        </div>
      </div>

      {/* Global Animations */}
      <style>{`
        @keyframes violent-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-8px, -6px) rotate(-3deg); }
          20% { transform: translate(8px, 4px) rotate(3deg); }
          30% { transform: translate(-6px, 8px) rotate(-2deg); }
          40% { transform: translate(6px, -8px) rotate(2deg); }
          50% { transform: translate(-10px, 2px) rotate(-4deg); }
          60% { transform: translate(10px, -2px) rotate(4deg); }
          70% { transform: translate(-4px, -10px) rotate(-3deg); }
          80% { transform: translate(4px, 10px) rotate(3deg); }
          90% { transform: translate(-8px, 4px) rotate(-2deg); }
        }

        @keyframes gentle-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes glow-pulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }

        @keyframes escape-particle {
          0% {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(
              ${Math.random() > 0.5 ? '' : '-'}${20 + Math.random() * 30}px,
              -${30 + Math.random() * 40}px
            ) scale(0);
          }
        }

        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(100vh) rotate(720deg) scale(0.3);
          }
        }

        @keyframes ray-burst {
          0% {
            opacity: 0;
            transform: translate(-50%, -100%) rotate(var(--angle)) scaleY(0);
          }
          30% {
            opacity: 1;
            transform: translate(-50%, -100%) rotate(var(--angle)) scaleY(1.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -100%) rotate(var(--angle)) scaleY(2);
          }
        }

        @keyframes shockwave {
          0% {
            opacity: 1;
            width: 0;
            height: 0;
          }
          100% {
            opacity: 0;
            width: 500px;
            height: 500px;
          }
        }

        @keyframes flash-burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(3);
          }
        }

        @keyframes badge-emerge {
          0% {
            opacity: 0;
            transform: scale(0) translateY(50px);
          }
          60% {
            opacity: 1;
            transform: scale(1.15) translateY(-20px);
          }
          80% {
            transform: scale(0.95) translateY(5px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes glow-breathe {
          0%, 100% { opacity: 0.5; transform: translate(-50%, 0) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, 0) scale(1.1); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes spin-slow {
          from { transform: translate(-50%, 0) rotate(0deg); }
          to { transform: translate(-50%, 0) rotate(360deg); }
        }

        .animate-violent-shake {
          animation: violent-shake 0.15s ease-in-out infinite;
        }

        .animate-gentle-float {
          animation: gentle-float 2s ease-in-out infinite;
        }

        .animate-badge-emerge {
          animation: badge-emerge 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </>
  );
};

export default BadgeReveal;

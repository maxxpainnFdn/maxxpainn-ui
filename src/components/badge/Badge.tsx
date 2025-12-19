import React, { useState, useRef } from 'react';
import {
  Briefcase, Crown, Castle, Flame, Users, Star, Trophy, Target,
  Sparkles, Image, UserPlus, Eye, Link, Network, Zap, Coins,
  Layers, Infinity, UsersRound, Shield, Wallet, CreditCard,
  Banknote, ArrowUpCircle, Hourglass, Lock
} from 'lucide-react';

export interface BadgeProps {
  id: number;
  name: string;
  description: string;
  icon: string;
  progressHint: string;
  goal: number;
  element: string;
  type: "clan" | "community" | "special";
  size?: number | string;
  enableTilt?: boolean;
  enableGlow?: boolean;
  glowIntensity?: 'low' | 'medium' | 'high';
  showDescription?: 'hover' | 'click' | 'always' | 'none';
  isUnlocked?: boolean;
  progress?: number;
}

export const Badge = ({ badge }: { badge: BadgeProps }) => {
  const {
    name,
    icon,
    description,
    progressHint,
    goal,
    element: material = 'gold',
    size = '100%',
    enableTilt = true,
    enableGlow = true,
    glowIntensity = 'medium',
    showDescription = 'hover',
    isUnlocked = true,
    progress = 0,
  } = badge;

  const { isSpecial, shape } = getBadgeVisuals(badge);
  const normalizedMaterial = material.toLowerCase().replace(" ", "");

  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [showInfo, setShowInfo] = useState(showDescription === 'always');
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if we are in "Fill Parent" mode (string size) or "Fixed Size" mode (number size)
  const isFillParent = typeof size === 'string' && size.includes('%');

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const sensitivity = isFillParent ? 15 : 25;
    const tiltX = (mouseY / (rect.height / 2)) * -sensitivity;
    const tiltY = (mouseX / (rect.width / 2)) * sensitivity;

    setTilt({ x: tiltX, y: tiltY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (showDescription === 'hover') {
      setShowInfo(true);
    }
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
    if (showDescription === 'hover') {
      setShowInfo(false);
    }
  };

  const handleClick = () => {
    if (showDescription === 'click') {
      setShowInfo(!showInfo);
    }
  };

  const iconMap: Record<string, React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>> = {
    briefcase: Briefcase, crown: Crown, castle: Castle, flame: Flame, users: Users,
    star: Star, trophy: Trophy, target: Target, sparkles: Sparkles, image: Image,
    "user-plus": UserPlus, eye: Eye, link: Link, network: Network, zap: Zap,
    coin: Coins, layers: Layers, infinity: Infinity, "users-round": UsersRound,
    shield: Shield, wallet: Wallet, "credit-card": CreditCard, banknote: Banknote,
    "arrow-up-circle": ArrowUpCircle, hourglass: Hourglass, lock: Lock,
  };

  const styles: Record<string, { primary: string; secondary: string; tertiary: string; dark: string; glow: string }> = {
    iron: { primary: '#6B7280', secondary: '#4B5563', tertiary: '#374151', dark: '#1F2937', glow: 'rgba(107, 114, 128, 0.8)' },
    bronze: { primary: '#CD7F32', secondary: '#B87333', tertiary: '#8B4513', dark: '#654321', glow: 'rgba(205, 127, 50, 0.8)' },
    copper: { primary: '#B87333', secondary: '#A0522D', tertiary: '#8B4513', dark: '#654321', glow: 'rgba(184, 115, 51, 0.8)' },
    garnet: { primary: '#8B0000', secondary: '#6B0000', tertiary: '#4B0000', dark: '#2B0000', glow: 'rgba(139, 0, 0, 0.8)' },
    amethyst: { primary: '#9966CC', secondary: '#7B4FA4', tertiary: '#5D3A7B', dark: '#3F2653', glow: 'rgba(153, 102, 204, 0.8)' },
    topaz: { primary: '#FFC87C', secondary: '#FFB347', tertiary: '#FF9E2C', dark: '#E68A00', glow: 'rgba(255, 200, 124, 0.8)' },
    spinel: { primary: '#FF1744', secondary: '#D50000', tertiary: '#AA0000', dark: '#800000', glow: 'rgba(255, 23, 68, 0.8)' },
    opal: { primary: '#E0F7FA', secondary: '#B2EBF2', tertiary: '#80DEEA', dark: '#4DD0E1', glow: 'rgba(224, 247, 250, 0.8)' },
    tanzanite: { primary: '#5E4FA2', secondary: '#4A3F8C', tertiary: '#362F76', dark: '#221F60', glow: 'rgba(94, 79, 162, 0.8)' },
    silver: { primary: '#F0F0F0', secondary: '#C0C0C0', tertiary: '#A8A8A8', dark: '#808080', glow: 'rgba(192, 192, 192, 0.8)' },
    palladium: { primary: '#CED0D4', secondary: '#A8AAAE', tertiary: '#838588', dark: '#5E6062', glow: 'rgba(206, 208, 212, 0.8)' },
    gold: { primary: '#FFD700', secondary: '#FFA500', tertiary: '#FF8C00', dark: '#B8860B', glow: 'rgba(255, 215, 0, 0.8)' },
    platinum: { primary: '#E5E4E2', secondary: '#BCC6CC', tertiary: '#98A8B8', dark: '#7F8C9E', glow: 'rgba(229, 228, 226, 0.8)' },
    sapphire: { primary: '#0F52BA', secondary: '#0C3C8C', tertiary: '#09265E', dark: '#061130', glow: 'rgba(15, 82, 186, 0.8)' },
    paraiba: { primary: '#00D4FF', secondary: '#00B8E6', tertiary: '#009CCC', dark: '#0080B3', glow: 'rgba(0, 212, 255, 0.8)' },
    alexandrite: { primary: '#6B3FA0', secondary: '#4A2C70', tertiary: '#2A1A40', dark: '#1A0A20', glow: 'rgba(107, 63, 160, 0.8)' },
    ruby: { primary: '#E0115F', secondary: '#C41E3A', tertiary: '#9B111E', dark: '#6B0F1A', glow: 'rgba(224, 17, 95, 0.8)' },
    emerald: { primary: '#50C878', secondary: '#2E8B57', tertiary: '#228B22', dark: '#0F5132', glow: 'rgba(80, 200, 120, 0.8)' },
    diamond: { primary: '#E0F7FF', secondary: '#B9F2FF', tertiary: '#92EDFF', dark: '#6BE8FF', glow: 'rgba(224, 247, 255, 0.9)' },
    reddiamond: { primary: '#FF0040', secondary: '#CC0033', tertiary: '#990026', dark: '#660019', glow: 'rgba(255, 0, 64, 0.9)' },
  };

  const IconComponent = isUnlocked ? (iconMap[icon] || Star) : Lock;
  const currentStyle = styles[normalizedMaterial] || styles.gold;

  const glowSettings = {
    low: { blur: 10, opacity: 0.4 },
    medium: { blur: 20, opacity: 0.6 },
    high: { blur: 30, opacity: 0.8 },
  };
  const glow = glowSettings[glowIntensity];

  const shapes = {
    circle: {
      darkShape: <circle cx="170" cy="155" r="87" fill={`url(#darkGradient-${normalizedMaterial})`} filter={`url(#dropShadow-${normalizedMaterial})`} />,
      mainShape: <circle cx="170" cy="155" r="83" fill={`url(#mainGradient-${normalizedMaterial})`} />,
      centerGlow: <circle cx="170" cy="155" r="83" fill={`url(#centerGlow-${normalizedMaterial})`} />,
      shineOverlay: <circle cx="170" cy="155" r="83" fill={`url(#shineGradient-${normalizedMaterial})`} opacity="0.6" />,
      innerBorder: <circle cx="170" cy="155" r="70" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />,
      specularShape: <circle cx="170" cy="155" r="83" fill={`url(#specular-${normalizedMaterial})`} />,
      corners: [] as React.ReactNode[],
      iconCenter: { x: 170, y: 155 },
      specialStarY: 45,
      outerGlowRadius: 110,
      innerGlowRadius: 95,
    },
    hexagon: {
      darkShape: <path d="M 170 70 L 230 105 L 230 175 L 170 210 L 110 175 L 110 105 Z" fill={`url(#darkGradient-${normalizedMaterial})`} filter={`url(#dropShadow-${normalizedMaterial})`} />,
      mainShape: <path d="M 170 75 L 225 108 L 225 172 L 170 205 L 115 172 L 115 108 Z" fill={`url(#mainGradient-${normalizedMaterial})`} />,
      centerGlow: <path d="M 170 75 L 225 108 L 225 172 L 170 205 L 115 172 L 115 108 Z" fill={`url(#centerGlow-${normalizedMaterial})`} />,
      shineOverlay: <path d="M 170 75 L 225 108 L 225 172 L 170 205 L 115 172 L 115 108 Z" fill={`url(#shineGradient-${normalizedMaterial})`} opacity="0.6" />,
      innerBorder: <path d="M 170 85 L 215 113 L 215 167 L 170 195 L 125 167 L 125 113 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />,
      specularShape: <path d="M 170 75 L 225 108 L 225 172 L 170 205 L 115 172 L 115 108 Z" fill={`url(#specular-${normalizedMaterial})`} />,
      corners: [
        <circle key="hex-1" cx="170" cy="70" r="8" fill={`url(#mainGradient-${normalizedMaterial})`} filter={`url(#glow-${normalizedMaterial})`} />,
        <circle key="hex-2" cx="230" cy="105" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
        <circle key="hex-3" cx="230" cy="175" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
        <circle key="hex-4" cx="170" cy="210" r="8" fill={`url(#mainGradient-${normalizedMaterial})`} filter={`url(#glow-${normalizedMaterial})`} />,
        <circle key="hex-5" cx="110" cy="175" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
        <circle key="hex-6" cx="110" cy="105" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
      ],
      iconCenter: { x: 170, y: 140 },
      specialStarY: 35,
      outerGlowRadius: 130,
      innerGlowRadius: 115,
    },
    shield: {
      darkShape: <path d="M 170 55 L 240 80 L 240 160 Q 240 220 170 255 Q 100 220 100 160 L 100 80 Z" fill={`url(#darkGradient-${normalizedMaterial})`} filter={`url(#dropShadow-${normalizedMaterial})`} />,
      mainShape: <path d="M 170 60 L 235 83 L 235 157 Q 235 215 170 248 Q 105 215 105 157 L 105 83 Z" fill={`url(#mainGradient-${normalizedMaterial})`} />,
      centerGlow: <path d="M 170 60 L 235 83 L 235 157 Q 235 215 170 248 Q 105 215 105 157 L 105 83 Z" fill={`url(#centerGlow-${normalizedMaterial})`} />,
      shineOverlay: <path d="M 170 60 L 235 83 L 235 157 Q 235 215 170 248 Q 105 215 105 157 L 105 83 Z" fill={`url(#shineGradient-${normalizedMaterial})`} opacity="0.6" />,
      innerBorder: <path d="M 170 75 L 220 95 L 220 153 Q 220 200 170 230 Q 120 200 120 153 L 120 95 Z" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" />,
      specularShape: <path d="M 170 60 L 235 83 L 235 157 Q 235 215 170 248 Q 105 215 105 157 L 105 83 Z" fill={`url(#specular-${normalizedMaterial})`} />,
      corners: [
        <circle key="shield-1" cx="170" cy="55" r="8" fill={`url(#mainGradient-${normalizedMaterial})`} filter={`url(#glow-${normalizedMaterial})`} />,
        <circle key="shield-2" cx="240" cy="80" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
        <circle key="shield-3" cx="100" cy="80" r="6" fill={`url(#mainGradient-${normalizedMaterial})`} opacity="0.8" />,
      ],
      iconCenter: { x: 170, y: 140 },
      specialStarY: 20,
      outerGlowRadius: 130,
      innerGlowRadius: 115,
    },
  };

  const currentShape = shapes[shape] || shapes.hexagon;
  const lightMaterials = ['silver', 'diamond', 'platinum', 'opal'];
  const iconColor = lightMaterials.includes(normalizedMaterial) ? currentStyle.dark : 'white';

  const shineX = 50 + tilt.y * 1.5;
  const shineY = 50 + tilt.x * 1.5;

  const progressPercent = Math.min((progress / goal) * 100, 100);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      // UPDATE: Changed from 'fixed' to 'relative w-full h-full' to stay inside parent div
      className="relative w-full h-full flex items-center justify-center  cursor-pointer"
      style={{
        perspective: '1500px',
      }}
    >
      {/* Badge Container with Tilt */}
      <div
        className="relative flex items-center justify-center transition-[height] duration-300 ease-out"
        style={{
          width: size,
          height: isFillParent ? '100%' : (typeof size === 'number' ? size + (showInfo ? 140 : 0) : size),
          transformStyle: 'preserve-3d',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
          filter: !isUnlocked ? 'grayscale(80%) brightness(0.6)' : 'none',
        }}
      >
        {/* Outer Glow Effect */}
        {enableGlow && isUnlocked && (
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] pointer-events-none transition-opacity duration-300 ease-out ${shape === 'circle' ? 'rounded-full' : 'rounded-[20%]'}`}
            style={{
              background: `radial-gradient(circle, ${currentStyle.primary}80 0%, transparent 70%)`,
              filter: `blur(${glow.blur}px)`,
              opacity: isHovered ? glow.opacity : glow.opacity * 0.5,
            }}
          />
        )}

        {/* Pulsing Glow for Special Badges */}
        {isSpecial && enableGlow && isUnlocked && (
          <div
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] h-[95%] pointer-events-none animate-pulse-glow ${shape === 'circle' ? 'rounded-full' : 'rounded-[20%]'}`}
            style={{
              background: `radial-gradient(circle, ${currentStyle.primary}60 0%, transparent 60%)`,
              filter: `blur(${glow.blur + 10}px)`,
            }}
          />
        )}

        <svg
          width="100%"
          height="100%"
          viewBox="35 20 270 330"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-[1] max-w-full max-h-full"
        >
          <defs>
            <linearGradient id={`mainGradient-${normalizedMaterial}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: currentStyle.primary }} />
              <stop offset="50%" style={{ stopColor: currentStyle.secondary }} />
              <stop offset="100%" style={{ stopColor: currentStyle.tertiary }} />
            </linearGradient>

            <linearGradient id={`darkGradient-${normalizedMaterial}`} x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" style={{ stopColor: currentStyle.dark }} />
              <stop offset="100%" style={{ stopColor: currentStyle.tertiary }} />
            </linearGradient>

            <linearGradient
              id={`shineGradient-${normalizedMaterial}`}
              x1={`${shineX - 30}%`}
              y1={`${shineY - 30}%`}
              x2={`${shineX + 30}%`}
              y2={`${shineY + 30}%`}
            >
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: isHovered ? 0.9 : 0.8 }} />
              <stop offset="50%" style={{ stopColor: 'white', stopOpacity: isHovered ? 0.4 : 0.2 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </linearGradient>

            <radialGradient id={`centerGlow-${normalizedMaterial}`}>
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </radialGradient>

            <radialGradient
              id={`specular-${normalizedMaterial}`}
              cx={`${50 + tilt.y * 2}%`}
              cy={`${50 + tilt.x * 2}%`}
              r="30%"
            >
              <stop offset="0%" style={{ stopColor: 'white', stopOpacity: isHovered ? 0.8 : 0 }} />
              <stop offset="100%" style={{ stopColor: 'white', stopOpacity: 0 }} />
            </radialGradient>

            <filter id={`glow-${normalizedMaterial}`}>
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            <filter id={`dropShadow-${normalizedMaterial}`}>
              <feDropShadow dx="0" dy="8" stdDeviation="12" floodOpacity="0.5" />
            </filter>

            <filter id={`enhancedGlow-${normalizedMaterial}`}>
              <feGaussianBlur stdDeviation={isHovered ? 8 : 6} result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background Glows */}
          <circle
            cx="170"
            cy="155"
            r={currentShape.outerGlowRadius}
            fill={`url(#mainGradient-${normalizedMaterial})`}
            opacity={isHovered ? 0.25 : 0.15}
            filter={`url(#glow-${normalizedMaterial})`}
            className="transition-opacity duration-300 ease-out"
          />
          <circle
            cx="170"
            cy="155"
            r={currentShape.innerGlowRadius}
            fill={`url(#mainGradient-${normalizedMaterial})`}
            opacity={isHovered ? 0.35 : 0.25}
            filter={`url(#glow-${normalizedMaterial})`}
            className="transition-opacity duration-300 ease-out"
          />

          {/* Main Shape Layers */}
          {currentShape.darkShape}
          {currentShape.mainShape}
          {currentShape.centerGlow}
          {currentShape.shineOverlay}
          {currentShape.specularShape}
          {currentShape.innerBorder}

          {/* Corner Decorations */}
          <g filter={isHovered ? `url(#enhancedGlow-${normalizedMaterial})` : undefined}>
            {currentShape.corners}
          </g>

          {/* Icon Circle Background */}
          <circle
            cx={currentShape.iconCenter.x}
            cy={currentShape.iconCenter.y}
            r="42"
            fill="rgba(0,0,0,0.3)"
          />
          <circle
            cx={currentShape.iconCenter.x}
            cy={currentShape.iconCenter.y}
            r="40"
            fill="rgba(255,255,255,0.15)"
          />
          <circle
            cx={currentShape.iconCenter.x}
            cy={currentShape.iconCenter.y}
            r="40"
            fill={`url(#shineGradient-${normalizedMaterial})`}
            opacity="0.4"
          />

          {/* Icon */}
          <foreignObject
            x={currentShape.iconCenter.x - 20}
            y={currentShape.iconCenter.y - 20}
            width="40"
            height="40"
          >
            <div className="flex items-center justify-center w-full h-full">
              <IconComponent size={32} color={iconColor} strokeWidth={1.5} />
            </div>
          </foreignObject>

          {/* Special Star */}
          {isSpecial && isUnlocked && (
            <g filter={`url(#enhancedGlow-${normalizedMaterial})`}>
              <path
                d={`M 170 ${currentShape.specialStarY}
                    L 175 ${currentShape.specialStarY + 10}
                    L 186 ${currentShape.specialStarY + 11}
                    L 178 ${currentShape.specialStarY + 19}
                    L 180 ${currentShape.specialStarY + 30}
                    L 170 ${currentShape.specialStarY + 24}
                    L 160 ${currentShape.specialStarY + 30}
                    L 162 ${currentShape.specialStarY + 19}
                    L 154 ${currentShape.specialStarY + 11}
                    L 165 ${currentShape.specialStarY + 10} Z`}
                fill="#FFD700"
              />
              <path
                d={`M 170 ${currentShape.specialStarY}
                    L 175 ${currentShape.specialStarY + 10}
                    L 186 ${currentShape.specialStarY + 11}
                    L 178 ${currentShape.specialStarY + 19}
                    L 180 ${currentShape.specialStarY + 30}
                    L 170 ${currentShape.specialStarY + 24}
                    L 160 ${currentShape.specialStarY + 30}
                    L 162 ${currentShape.specialStarY + 19}
                    L 154 ${currentShape.specialStarY + 11}
                    L 165 ${currentShape.specialStarY + 10} Z`}
                fill="white"
                opacity="0.6"
              />
            </g>
          )}

          {/* Sparkles for Special Badges on Hover */}
          {isSpecial && isHovered && isUnlocked && (
            <g>
              <circle cx="130" cy="90" r="3" fill="white" opacity="0.8">
                <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="3;4;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
              <circle cx="210" cy="100" r="2" fill="white" opacity="0.6">
                <animate attributeName="opacity" values="0.6;0.1;0.6" dur="2s" repeatCount="indefinite" />
              </circle>
              <circle cx="200" cy="190" r="2.5" fill="white" opacity="0.7">
                <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.8s" repeatCount="indefinite" />
              </circle>
              <circle cx="140" cy="180" r="2" fill="white" opacity="0.5">
                <animate attributeName="opacity" values="0.5;0.1;0.5" dur="2.2s" repeatCount="indefinite" />
              </circle>
            </g>
          )}

          {/* Name Banner */}
          <g>
            <path
              d="M 90 280 L 90 320 L 170 340 L 250 320 L 250 280 L 170 295 Z"
              fill={`url(#darkGradient-${normalizedMaterial})`}
              filter={`url(#dropShadow-${normalizedMaterial})`}
            />
            <path
              d="M 95 282 L 95 315 L 170 333 L 245 315 L 245 282 L 170 293 Z"
              fill={`url(#mainGradient-${normalizedMaterial})`}
            />
            <path
              d="M 95 282 L 245 282"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="2"
            />
            <line x1="130" y1="285" x2="130" y2="305" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="170" y1="287" x2="170" y2="310" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <line x1="210" y1="285" x2="210" y2="305" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
            <text
              x="170"
              y="310"
              textAnchor="middle"
              fill={lightMaterials.includes(normalizedMaterial) ? '#374151' : 'white'}
              fontSize={name.length > 15 ? '11' : name.length > 12 ? '13' : '15'}
              fontWeight="bold"
              className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {name.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* Description Panel */}
        <div
          className={`
          absolute z-[9999] transition-all
          duration-300 ease-out
          ${showInfo ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-4 pointer-events-none'}
        `}
          style={{
            bottom:  -192,
            width: isFillParent ? '340px' : '100%',
            maxWidth: isFillParent ? 'unset' : size,
            left: isFillParent ? 'unset' : '50%',
            transform: isFillParent ? 'unset' : (showInfo ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(16px)')
          }}
        >
          <div
            className="rounded-xl backdrop-blur-[20px] p-3"
            style={{
              background: 'linear-gradient(135deg, rgba(8, 8, 12, 1) 0%, rgba(15, 15, 25, 1) 100%)',
              boxShadow: `0 10px 40px rgba(0,0,0,0.7), 0 0 30px ${currentStyle.glow}30, inset 0 1px 0 rgba(255,255,255,0.05)`,
              border: `1px solid ${currentStyle.primary}25`,
            }}
          >
            {/* Badge Type Tag */}
            <div
              className="inline-block px-2.5 py-1 rounded-full"
              style={{
                background: `${currentStyle.primary}15`,
                border: `1px solid ${currentStyle.primary}35`,
              }}
            >
              <span
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: currentStyle.primary }}
              >
                {badge.type} {isSpecial && '★ SPECIAL'}
              </span>
            </div>

            {/* Description */}
            <p className="text-white/85 text-[13px] leading-relaxed mt-2">
              {description}
            </p>

            {/* Progress Section (for locked badges) */}
            {!isUnlocked && (
              <div className="mt-3">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[11px] text-white/50 font-medium">
                    Progress
                  </span>
                  <span
                    className="text-[11px] font-bold"
                    style={{
                      color: currentStyle.primary,
                      textShadow: `0 0 8px ${currentStyle.glow}`,
                    }}
                  >
                    {progress} / {goal}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-black/60 rounded border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                  <div
                    className="h-full rounded transition-[width] duration-500 ease-out"
                    style={{
                      width: `${progressPercent}%`,
                      background: `linear-gradient(90deg, ${currentStyle.dark}, ${currentStyle.secondary}, ${currentStyle.primary})`,
                      boxShadow: `0 0 12px ${currentStyle.glow}, inset 0 1px 0 rgba(255,255,255,0.3)`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Progress Hint */}
            <div className="flex items-center gap-2 mt-3 py-2.5 px-3 bg-black/50 rounded-lg border border-white/[0.06] shadow-[inset_0_1px_3px_rgba(0,0,0,0.4)]">
              <div
                className="flex items-center justify-center w-6 h-6 rounded-md"
                style={{ background: `${currentStyle.primary}20` }}
              >
                <Target size={14} color={currentStyle.primary} />
              </div>
              <span className="text-[11px] text-white/65 leading-snug">
                {progressHint}
              </span>
            </div>

            {/* Unlocked Status */}
            {isUnlocked && (
              <div
                className="flex items-center justify-center gap-2 mt-3 py-2 rounded-lg"
                style={{
                  background: `linear-gradient(135deg, ${currentStyle.primary}10 0%, ${currentStyle.primary}05 100%)`,
                  border: `1px solid ${currentStyle.primary}25`,
                  boxShadow: `0 0 20px ${currentStyle.glow}20`,
                }}
              >
                <Sparkles size={16} color={currentStyle.primary} />
                <span
                  className="text-xs font-bold tracking-wider"
                  style={{
                    color: currentStyle.primary,
                    textShadow: `0 0 12px ${currentStyle.glow}`,
                  }}
                >
                  UNLOCKED
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Tailwind Animation */}
      <style>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.3;
            transform: translate(-50%, -50%) scale(1);
          }
          50% {
            opacity: 0.6;
            transform: translate(-50%, -50%) scale(1.1);
          }
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

function getBadgeVisuals(badge: BadgeProps): { shape: 'circle' | 'hexagon' | 'shield'; isSpecial: boolean } {
  const { element, goal, type, name } = badge;
  const material = element.toLowerCase().replace(" ", "");

  const eliteMaterials = ['diamond', 'ruby', 'reddiamond', 'platinum'];
  if (eliteMaterials.includes(material)) {
    return { shape: 'shield', isSpecial: true };
  }

  if (goal >= 1000) {
    return { shape: 'shield', isSpecial: true };
  }

  if (/God|King|Legend|Veteran|Legendary/i.test(name)) {
    return { shape: 'shield', isSpecial: true };
  }

  const midTierMaterials = ['gold', 'emerald', 'sapphire', 'topaz', 'amethyst'];
  if (midTierMaterials.includes(material)) {
    if (goal >= 100 || type === 'special') {
      return { shape: 'hexagon', isSpecial: true };
    }
    return { shape: 'hexagon', isSpecial: false };
  }

  if (material === 'silver' && goal >= 10) {
    return { shape: 'hexagon', isSpecial: false };
  }

  return { shape: 'circle', isSpecial: false };
}

export default Badge;

import React, { useState } from 'react';

export const ImageAvatar2 = ({ 
  src, 
  name = 'User',
  size = 120,
  borderColor = '#8b5cf6',
  borderWidth = 3,
  fallbackType = 'initials',
  dicebearStyle = 'avataaars',
  glowEffect = true,
  showOnlineStatus = false,
  isOnline = false,
  backgroundEnabled = true, // ✅ NEW
  rounded = true,           // ✅ NEW
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const getInitials = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const getDicebearUrl = (name, style) => {
    const seed = encodeURIComponent(name);
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
  };

  const getGradientFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 80) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 75%, 55%), hsl(${hue2}, 75%, 45%))`;
  };

  const getTailwindColors = () => {
    const colors = {
      violet: { 500: '#8b5cf6', 600: '#7c3aed', 700: '#6d28d9' },
      pink: { 500: '#ec4899', 600: '#db2777', 700: '#be185d' },
      blue: { 500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8' },
      // ... keep only a few if needed
    };
    const map = {};
    Object.keys(colors).forEach((color) => {
      Object.keys(colors[color]).forEach((shade) => {
        map[`${color}-${shade}`] = colors[color][shade];
      });
    });
    return map;
  };

  const tailwindToHex = (color) => {
    const map = getTailwindColors();
    const clean = color.startsWith('from-') ? color.replace('from-', '') : color;
    return map[clean] || '#8b5cf6';
  };

  const generateGradient = (color) => {
    const hexColor = color.startsWith('#') ? color : tailwindToHex(color);
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    const rNorm = r / 255, gNorm = g / 255, bNorm = b / 255;
    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    let h, s, l = (max + min) / 2;
    if (max === min) h = s = 0;
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
        case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
        case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
      }
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    const h2 = (h + 30) % 360;
    const l1 = Math.min(l + 10, 90);
    const l2 = Math.max(l - 10, 20);
    return `linear-gradient(135deg, hsl(${h}, ${s}%, ${l1}%), hsl(${h2}, ${s}%, ${l2}%))`;
  };

  const shouldShowImage = src && !imageError;
  const shouldShowFallback = !src || imageError;

  return (
    <div 
      className={`relative inline-block ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Glow */}
      {glowEffect && (
        <div
          className={`absolute inset-0 ${rounded ? 'rounded-full' : 'rounded-lg'} blur-xl opacity-40 animate-pulse`}
          style={{
            background: borderColor.startsWith('#') ? borderColor : tailwindToHex(borderColor),
            transform: 'scale(1.1)'
          }}
        />
      )}

      {/* Main container */}
      <div
        className={`${rounded ? 'rounded-full' : 'rounded-lg'} overflow-hidden relative transition-all duration-300 hover:scale-105`}
        style={{
          width: '100%',
          height: '100%',
          padding: borderWidth,
          background: backgroundEnabled ? generateGradient(borderColor) : 'transparent',
          boxShadow: backgroundEnabled ? `0 4px 20px ${borderColor}40, 0 0 40px ${borderColor}20` : 'none'
        }}
      >
        <div 
          className={`w-full h-full ${rounded ? 'rounded-full' : 'rounded-lg'} overflow-hidden`}
          style={{
            background: shouldShowFallback && fallbackType === 'initials' && backgroundEnabled
              ? getGradientFromName(name)
              : backgroundEnabled
                ? '#1a1a2e'
                : 'transparent'
          }}
        >
          {shouldShowImage && (
            <>
              {imageLoading && (
                <div 
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: backgroundEnabled ? getGradientFromName(name) : 'transparent' }}
                >
                  <div className="relative" style={{ width: size / 3, height: size / 3 }}>
                    <div className="absolute inset-0 rounded-full border-4 border-white/30" />
                    <div className="absolute inset-0 rounded-full border-4 border-white border-t-transparent animate-spin" />
                  </div>
                </div>
              )}
              <img
                src={src}
                alt={name}
                className="w-full h-full object-cover transition-opacity duration-300"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
                style={{ 
                  display: imageLoading ? 'none' : 'block',
                  opacity: imageLoading ? 0 : 1
                }}
              />
            </>
          )}

          {shouldShowFallback && (
            fallbackType === 'initials' ? (
              <div className="w-full h-full flex items-center justify-center">
                <span 
                  className="font-bold text-white select-none"
                  style={{ 
                    fontSize: size * 0.35,
                    textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                >
                  {getInitials(name)}
                </span>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800">
                <img
                  src={getDicebearUrl(name, dicebearStyle)}
                  alt={name}
                  className="w-full h-full object-cover"
                  style={{ imageRendering: 'crisp-edges' }}
                />
              </div>
            )
          )}
        </div>
      </div>

      {/* Online badge */}
      {showOnlineStatus && (
        <div
          className={`absolute ${rounded ? 'rounded-full' : 'rounded-lg'} border-4 border-gray-900`}
          style={{
            width: size * 0.25,
            height: size * 0.25,
            bottom: size * 0.05,
            right: size * 0.05,
            background: isOnline 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : 'linear-gradient(135deg, #6b7280, #4b5563)',
            boxShadow: isOnline 
              ? '0 0 20px rgba(16, 185, 129, 0.6)'
              : 'none'
          }}
        >
          {isOnline && (
            <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
          )}
        </div>
      )}
    </div>
  );
};

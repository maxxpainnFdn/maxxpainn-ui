export const MATERIAL_TIERS = {
  COMMON: 'common',
  RARE: 'rare',
  LEGENDARY: 'legendary'
} as const;

export const materialRarity = {
  // COMMON TIER - Basic metals (Circle shape)
  iron: {
    tier: 'common',
    rarity: 1,
    shape: 'circle',
    description: 'Common metal, foundational achievement'
  },
  bronze: {
    tier: 'common',
    rarity: 2,
    shape: 'circle',
    description: 'Common metal, entry-level recognition'
  },
  copper: {
    tier: 'common',
    rarity: 3,
    shape: 'circle',
    description: 'Common metal, basic accomplishment'
  },

  // RARE TIER - Semi-precious gems & precious metals (Shield shape)
  garnet: {
    tier: 'rare',
    rarity: 4,
    shape: 'shield',
    description: 'Semi-precious gemstone, notable achievement'
  },
  amethyst: {
    tier: 'rare',
    rarity: 5,
    shape: 'shield',
    description: 'Semi-precious gemstone, impressive feat'
  },
  topaz: {
    tier: 'rare',
    rarity: 6,
    shape: 'shield',
    description: 'Semi-precious gemstone, significant milestone'
  },
  spinel: {
    tier: 'rare',
    rarity: 7,
    shape: 'shield',
    description: 'Semi-precious gemstone, remarkable accomplishment'
  },
  opal: {
    tier: 'rare',
    rarity: 8,
    shape: 'shield',
    description: 'Semi-precious gemstone, distinguished honor'
  },
  tanzanite: {
    tier: 'rare',
    rarity: 9,
    shape: 'shield',
    description: 'Rare gemstone, exceptional achievement'
  },
  silver: {
    tier: 'rare',
    rarity: 10,
    shape: 'shield',
    description: 'Precious metal, outstanding performance'
  },

  // LEGENDARY TIER - Precious metals & gems (Hexagon shape)
  palladium: {
    tier: 'legendary',
    rarity: 11,
    shape: 'hexagon',
    description: 'Rare precious metal, elite status'
  },
  gold: {
    tier: 'legendary',
    rarity: 12,
    shape: 'hexagon',
    description: 'Precious metal, supreme excellence'
  },
  platinum: {
    tier: 'legendary',
    rarity: 13,
    shape: 'hexagon',
    description: 'Precious metal, pinnacle achievement'
  },
  sapphire: {
    tier: 'legendary',
    rarity: 14,
    shape: 'hexagon',
    description: 'Precious gemstone, legendary accomplishment'
  },
  paraiba: {
    tier: 'legendary',
    rarity: 15,
    shape: 'hexagon',
    description: 'Ultra-rare gemstone, extraordinary feat'
  },
  alexandrite: {
    tier: 'legendary',
    rarity: 16,
    shape: 'hexagon',
    description: 'Rare color-changing gem, mythical status'
  },
  ruby: {
    tier: 'legendary',
    rarity: 17,
    shape: 'hexagon',
    description: 'Precious gemstone, master-level achievement'
  },
  emerald: {
    tier: 'legendary',
    rarity: 18,
    shape: 'hexagon',
    description: 'Precious gemstone, legendary mastery'
  },
  diamond: {
    tier: 'legendary',
    rarity: 19,
    shape: 'hexagon',
    description: 'Most precious gemstone, ultimate achievement'
  },
  reddiamond: {
    tier: 'legendary',
    rarity: 20,
    shape: 'hexagon',
    description: 'Rarest gemstone on Earth, unparalleled excellence'
  }
} as const;

// Helper functions
export const getMaterialTier = (material: string) => {
  return materialRarity[material]?.tier || 'common';
};

export const getMaterialRarity = (material: string) => {
  return materialRarity[material]?.rarity || 1;
};

export const getMaterialsByTier = (tier: 'common' | 'rare' | 'legendary') => {
  return Object.entries(materialRarity)
    .filter(([_, data]) => data.tier === tier)
    .map(([material]) => material);
};

// Tier summaries
export const TIER_INFO = {
  common: {
    name: 'Common',
    materials: ['iron', 'bronze', 'copper'],
    shape: 'circle',
    color: '#9CA3AF',
    description: 'Entry-level achievements'
  },
  rare: {
    name: 'Rare',
    materials: ['garnet', 'amethyst', 'topaz', 'spinel', 'opal', 'tanzanite', 'silver'],
    shape: 'shield',
    color: '#3B82F6',
    description: 'Significant accomplishments'
  },
  legendary: {
    name: 'Legendary',
    materials: ['palladium', 'gold', 'platinum', 'sapphire', 'paraiba', 'alexandrite', 'ruby', 'emerald', 'diamond', 'reddiamond'],
    shape: 'hexagon',
    color: '#F59E0B',
    description: 'Ultimate mastery and excellence'
  }
};
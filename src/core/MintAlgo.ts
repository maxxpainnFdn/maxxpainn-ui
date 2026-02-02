import { tokenConfig } from "@/config/token";

export interface MintRewardInfo {
  rank: number;
  baseReward: number; // Display value (float)
  networkMultiplier: number; // Display value (float)
  earlyAdopterMultiplier: number; // Display value (float)
  lockPeriodMultiplier: number; // Display value (float)
  finalReward: number; // Display value (float)
  rewardAmount: number; // Display value (float)
  globalRank: number;
  daysLate: number;
  penaltyPercent: number;
  finalAmountRaw: bigint,
  // Added raw values for transaction use
  rawRewardAmount: string;
}

// ============================================================================
//                               CONSTANTS
// ============================================================================
// These MUST match the Rust contract exactly!
// ============================================================================

const PRECISION = 1_000_000n;

// ----------------------------------------------------------------------------
// Base Reward Configuration (UPDATED)
// ----------------------------------------------------------------------------
// Formula: BaseReward = BASE_REWARD × K / (√rank + K)
// This creates a dampened decay curve
const BASE_REWARD = 1_000_000n;
const BASE_REWARD_NUMERATOR = BASE_REWARD * PRECISION;
const DAMPENER_K = 10_000n;

// ----------------------------------------------------------------------------
// Early Adopter Configuration (Unchanged)
// ----------------------------------------------------------------------------
// Linear decay from 3.0x (Rank 1) to 1.0x (Rank 1M)
const EA_MAX_RANK = 1_000_000n;
const EAM_MAX_SCALED = 3n * PRECISION; // 3.0x
const EAM_MIN_SCALED = 1n * PRECISION; // 1.0x

// ----------------------------------------------------------------------------
// Network Effect Configuration (UPDATED)
// ----------------------------------------------------------------------------
// Formula: NEM = min(1 + 0.002 × √delta, 2.0)
// Reaches 2.0x cap when 250,000 users join after you
const NEM_CURVE_SCALED = 2_000n; // 0.002 (was 0.1)
const NEM_MAX_SCALED = 2n * PRECISION; // 2.0x cap (was 3.0x)

// ----------------------------------------------------------------------------
// Lock Period Configuration (UPDATED)
// ----------------------------------------------------------------------------
// Formula: LPM = min(1 + 0.06 × √days, 3.0)
// Reaches 3.0x cap at ~1,095 days (3 years)
const LPM_SCALE_SCALED = 60_000n; // 0.06 (was 0.5)
const LPM_MAX_SCALED = 3n * PRECISION; // 3.0x cap (NEW)

// ----------------------------------------------------------------------------
// Penalty Array (Unchanged)
// ----------------------------------------------------------------------------
const LATE_MINT_PENALTY = [0n, 1n, 3n, 8n, 17n, 35n, 72n, 99n];

// Default token decimals - adjust to match your mint
const TOKEN_DECIMALS = tokenConfig.decimals;

// ============================================================================
//                            HELPER FUNCTIONS
// ============================================================================

/**
 * Integer Square Root for BigInt (matches Rust .isqrt())
 * Uses Newton's method.
 */
function isqrt(n: bigint): bigint {
  if (n < 0n) throw new Error("negative BigInt sqrt");
  if (n < 2n) return n;

  let x = n;
  let y = (x + 1n) / 2n;
  while (y < x) {
    x = y;
    y = (x + n / x) / 2n;
  }
  return x;
}

/**
 * Matches Rust helper: (a * b) / PRECISION
 */
function mulScale(a: bigint, b: bigint): bigint {
  return (a * b) / PRECISION;
}

/**
 * Returns the minimum of two BigInts
 */
function minBigInt(a: bigint, b: bigint): bigint {
  return a < b ? a : b;
}

// ============================================================================
//                            MAIN CLASS
// ============================================================================

export default class MintAlgo {
  /**
   * Safely convert number or bigint to bigint
   */
  static toBigInt(value: bigint | number): bigint {
    if (typeof value !== "bigint") {
      value = BigInt(Math.floor(value));
    }
    return value;
  }

  /**
   * Convert scaled BigInt to float for display
   */
  static format(value: bigint): number {
    return Number(value) / Number(PRECISION);
  }

  // --------------------------------------------------------------------------
  // Base Reward (UPDATED - Now uses dampened decay)
  // --------------------------------------------------------------------------
  /**
   * Calculate base reward with dampened decay
   * Formula: BASE_REWARD × K / (√rank + K)
   *
   * With K = 10,000:
   *   - Rank 1:    ~99.99% of base
   *   - Rank 1M:   ~91% of base
   *   - Rank 100M: ~50% of base
   */
  static getBaseReward(rank: bigint | number): bigint {
    rank = this.toBigInt(rank);

    // Add 1 to avoid sqrt(0) edge case
    const rankPlusOne = rank + 1n;
    const sqrtRank = isqrt(rankPlusOne);

    // Denominator = √rank + K
    const decayDenominator = sqrtRank + DAMPENER_K;

    // base_reward = (BASE_REWARD × PRECISION × K) / (√rank + K)
    const baseReward = (BASE_REWARD_NUMERATOR * DAMPENER_K) / decayDenominator;

    return baseReward;
  }

  // --------------------------------------------------------------------------
  // Early Adopter Multiplier (Unchanged)
  // --------------------------------------------------------------------------
  /**
   * Calculate Early Adopter Multiplier
   * Linear decay from 3.0x (Rank 1) to 1.0x (Rank 1M)
   * Rank > 1M gets 1.0x (no bonus)
   */
  static getEarlyAdopterMultiplier(rank: bigint | number): bigint {
    rank = this.toBigInt(rank);

    if (rank > EA_MAX_RANK) {
      return EAM_MIN_SCALED;
    }

    const range = EAM_MAX_SCALED - EAM_MIN_SCALED;
    const remainingRanks = EA_MAX_RANK - rank;
    const denominator = EA_MAX_RANK - 1n;

    const bonus = (range * remainingRanks) / denominator;
    return EAM_MIN_SCALED + bonus;
  }

  // --------------------------------------------------------------------------
  // Network Effect Multiplier (UPDATED)
  // --------------------------------------------------------------------------
  /**
   * Calculate Network Effect Multiplier
   * Formula: NEM = min(1 + 0.002 × √delta, 2.0)
   *
   * UPDATED: Now capped at 2.0x (was 3.0x)
   * Reaches cap when 250,000 users join after you
   */
  static getNetworkEffectMultiplier(
    rank: bigint | number,
    globalRank: bigint | number
  ): bigint {
    rank = this.toBigInt(rank);
    globalRank = this.toBigInt(globalRank);

    // Calculate delta (saturating subtraction)
    let delta = globalRank > rank ? globalRank - rank : 0n;

    // NEM = 1 + 0.002 × √delta
    const nemBonus = isqrt(delta) * NEM_CURVE_SCALED;
    const rawNem = PRECISION + nemBonus;

    // Cap at maximum (2.0x)
    return minBigInt(rawNem, NEM_MAX_SCALED);
  }

  // --------------------------------------------------------------------------
  // Lock Period Multiplier (UPDATED)
  // --------------------------------------------------------------------------
  /**
   * Calculate Lock Period Multiplier
   * Formula: LPM = min(1 + 0.06 × √days, 3.0)
   *
   * UPDATED: Now capped at 3.0x
   * Reaches cap at ~1,095 days (3 years)
   */
  static getLockPeriodMultiplier(waitDays: bigint | number): bigint {
    waitDays = this.toBigInt(waitDays);

    // LPM = 1 + 0.06 × √days
    const lpmBonus = isqrt(waitDays) * LPM_SCALE_SCALED;
    const rawLpm = PRECISION + lpmBonus;

    // Cap at maximum (3.0x)
    return minBigInt(rawLpm, LPM_MAX_SCALED);
  }

  // --------------------------------------------------------------------------
  // Late Mint Penalty (Unchanged)
  // --------------------------------------------------------------------------
  /**
   * Calculate reward after applying late penalty
   * Penalty increases exponentially: 0%, 1%, 3%, 8%, 17%, 35%, 72%, 99%
   */
  static getRewardWithPenalty(
    totalReward: bigint | number,
    daysLate: bigint | number
  ): {
    penaltyPercent: bigint;
    finalReward: bigint;
  } {
    totalReward = this.toBigInt(totalReward);
    daysLate = this.toBigInt(daysLate);

    let penaltyPercent = 0n;
    let finalReward = totalReward;

    if (daysLate > 0n) {
      // Clamp at index 7 (99%)
      const idx = daysLate >= 7n ? 7 : Number(daysLate);
      penaltyPercent = LATE_MINT_PENALTY[idx];

      const retainedPercent = 100n - penaltyPercent;
      finalReward = (totalReward * retainedPercent) / 100n;
    }

    return {
      penaltyPercent,
      finalReward,
    };
  }

  // --------------------------------------------------------------------------
  // Combined Multiplier (Helper for UI)
  // --------------------------------------------------------------------------
  /**
   * Calculate the combined multiplier (EAM × NEM × LPM)
   * Useful for displaying total bonus to user
   */
  static getCombinedMultiplier(
    rank: bigint | number,
    globalRank: bigint | number,
    waitDays: bigint | number
  ): bigint {
    const eam = this.getEarlyAdopterMultiplier(rank);
    const nem = this.getNetworkEffectMultiplier(rank, globalRank);
    const lpm = this.getLockPeriodMultiplier(waitDays);

    return mulScale(mulScale(eam, nem), lpm);
  }

  // --------------------------------------------------------------------------
  // Main Calculation Function
  // --------------------------------------------------------------------------
  /**
   * Calculates the Final Reward by combining all components using BigInt math
   * to ensure exact parity with the Rust Smart Contract.
   *
   * @param userRankVal - User's rank number (1-indexed)
   * @param globalRankVal - Current total users in the system
   * @param lockPeriodDaysVal - Lock period in days
   * @param daysLateVal - Days late claiming (0 = on time)
   * @param tokenDecimals - Token decimals (default: 9)
   */
  static calculateFinalReward(
    userRankVal: number,
    globalRankVal: number,
    lockPeriodDaysVal: number,
    daysLateVal: number,
    tokenDecimals: number = TOKEN_DECIMALS
  ): MintRewardInfo {
    // 1. Convert inputs to BigInt for integer math
    const rank = BigInt(Math.floor(userRankVal));
    const globalRank = BigInt(Math.floor(globalRankVal));
    const waitDays = BigInt(Math.floor(lockPeriodDaysVal));
    const daysLate = BigInt(Math.floor(daysLateVal));

    // ---------------------------------------------------------
    // A. Base Reward (Dampened Decay)
    // ---------------------------------------------------------
    const baseReward = this.getBaseReward(rank);

    // ---------------------------------------------------------
    // B. Early Adopter Multiplier (EAM)
    // Linear: 3.0x (Rank 1) → 1.0x (Rank 1M+)
    // ---------------------------------------------------------
    const eaMultiplier = this.getEarlyAdopterMultiplier(rank);

    // ---------------------------------------------------------
    // C. Network Effect Multiplier (NEM)
    // Sqrt curve: 1.0x → 2.0x (at 250K growth)
    // ---------------------------------------------------------
    const networkMultiplier = this.getNetworkEffectMultiplier(rank, globalRank);

    // ---------------------------------------------------------
    // D. Lock Period Multiplier (LPM)
    // Sqrt curve: 1.0x → 3.0x (at 3 years)
    // ---------------------------------------------------------
    const lockMultiplier = this.getLockPeriodMultiplier(waitDays);

    // ---------------------------------------------------------
    // E. Aggregation
    // Total = Base × EAM × NEM × LPM
    // ---------------------------------------------------------
    let totalReward = baseReward;
    totalReward = mulScale(totalReward, eaMultiplier);
    totalReward = mulScale(totalReward, networkMultiplier);
    totalReward = mulScale(totalReward, lockMultiplier);

    // ---------------------------------------------------------
    // F. Late Penalty
    // ---------------------------------------------------------
    const { penaltyPercent, finalReward } = this.getRewardWithPenalty(
      totalReward,
      daysLate
    );

    // ---------------------------------------------------------
    // G. Final Token Scaling (for blockchain transaction)
    // ---------------------------------------------------------
    const tokenScale = 10n ** BigInt(tokenDecimals);
    const finalAmountRaw = (finalReward * tokenScale) / PRECISION;

    // ---------------------------------------------------------
    // H. Convert to floating point for UI Display
    // ---------------------------------------------------------
    const toUiFloat = (val: bigint) => Number(val / PRECISION);

    return {
      rank: userRankVal,
      baseReward: toUiFloat(baseReward),
      networkMultiplier: toUiFloat(networkMultiplier),
      earlyAdopterMultiplier: toUiFloat(eaMultiplier),
      lockPeriodMultiplier: toUiFloat(lockMultiplier),

      finalReward: toUiFloat(finalReward), // Post-Penalty
      rewardAmount: toUiFloat(totalReward), // Pre-Penalty

      globalRank: globalRankVal,
      daysLate: Number(daysLate),
      penaltyPercent: Number(penaltyPercent),
      finalAmountRaw,
      // Use this string for Solana Transaction arguments (u64)
      rawRewardAmount: finalAmountRaw.toString(),
    };
  }

  // --------------------------------------------------------------------------
  // Utility: Maximum Reward Calculator
  // --------------------------------------------------------------------------
  /**
   * Calculate the theoretical maximum reward for a given rank
   * Assumes: max growth (250K+), max lock (3 years), on-time claim
   */
  static calculateMaxReward(
    userRankVal: number,
    tokenDecimals: number = TOKEN_DECIMALS
  ): MintRewardInfo {
    
    // Max growth to hit NEM cap (250K users)
    const maxGrowth = 250_000;
    
    // Max lock to hit LPM cap (3 years)
    const maxLockDays = 1095;

    return this.calculateFinalReward(
      userRankVal,
      userRankVal + maxGrowth,
      maxLockDays,
      0,
      tokenDecimals
    );
  }

  // --------------------------------------------------------------------------
  // Utility: Format multiplier for display
  // --------------------------------------------------------------------------
  /**
   * Format a multiplier value for UI display
   * e.g., 2500000n → "2.50x"
   */
  static formatMultiplier(scaled: bigint): string {
    const value = Number(scaled) / Number(PRECISION);
    return `${value.toFixed(2)}x`;
  }

  // --------------------------------------------------------------------------
  // Utility: Check if user is early adopter
  // --------------------------------------------------------------------------
  /**
   * Returns true if rank qualifies for early adopter bonus
   */
  static isEarlyAdopter(rank: number): boolean {
    return rank <= Number(EA_MAX_RANK);
  }

}

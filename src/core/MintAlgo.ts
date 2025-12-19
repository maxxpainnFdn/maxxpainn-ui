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
  // Added raw values for transaction use
  rawRewardAmount: string;
}

// --- CONSTANTS (Matching Rust Precision) ---
const PRECISION = 1_000_000n;

// Base Reward Configuration
const BASE_REWARD = 10_000_000n;
const BASE_REWARD_MULTIPLIER = 100n;
// Rust: BASE_REWARD * BASE_REWARD_MULTIPLIER * PRECISION
const BASE_REWARD_NUMERATOR = BASE_REWARD * BASE_REWARD_MULTIPLIER * PRECISION;

// Early Adopter Configuration
const EA_MAX_RANK = 1_000_000n;
const EAM_MAX_SCALED = 3n * PRECISION; // 3.0
const EAM_MIN_SCALED = 1n * PRECISION; // 1.0

// Network Effect Configuration
// Rust: PRECISION / 10 = 0.1
const NEM_CURVE_SCALED = PRECISION / 10n;
const NEM_MAX_SCALED = 3n * PRECISION;

// Lock Period Configuration
// Rust code says: PRECISION / 2 = 0.5.
const LPM_SCALE_SCALED = PRECISION / 2n;

// Penalty Array
const LATE_MINT_PENALTY = [0n, 1n, 3n, 8n, 17n, 35n, 72n, 99n];

const TOKEN_DECIMALS = 4; // Adjust this to match your mint's actual decimals

// --- HELPER FUNCTIONS ---

/**
 * Integer Square Root for BigInt (matches Rust .isqrt())
 * Uses Newton's method.
 * Essential for curve parity with Rust.
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

export default class MintAlgo {

  static toBigInt(value: bigint | number){

    if(typeof value !== 'bigint'){
      value = BigInt(value.toString())
    }

    return value;
  }

  static format(value: bigint) {
    return (Number(value) / Number(PRECISION));
  }

  // Base Reward
  static getBaseReward(rank: bigint | number){

    rank = this.toBigInt(rank);

    // ---------------------------------------------------------
    // A. Base Reward
    // Rust: BASE_REWARD_NUMERATOR / (rank + 1).isqrt()
    // ---------------------------------------------------------
    const rankPlusOne = rank + 1n;
    const sqrtRank = isqrt(rankPlusOne);

    // Handle div by zero safety check (though rank+1 >= 1)
    let baseReward = 0n;

    if (sqrtRank > 0n) {
      baseReward = BASE_REWARD_NUMERATOR / sqrtRank;
    } else {
      baseReward = PRECISION;
    }

    return baseReward;
  }

  // Early Adopter Multiplier
  static getEarlyAdopterMultiplier(rank: bigint | number) {

    let eaMultiplier: bigint;

    rank = this.toBigInt(rank);

    if (rank > EA_MAX_RANK) {
      eaMultiplier = EAM_MIN_SCALED;
    } else {
      const range = EAM_MAX_SCALED - EAM_MIN_SCALED;
      const remainingRanks = EA_MAX_RANK - rank;
      const denominator = EA_MAX_RANK - 1n;

      // Rust: range * remaining / denominator
      const bonus = (range * remainingRanks) / denominator;
      eaMultiplier = EAM_MIN_SCALED + bonus;
    }

    return eaMultiplier
  }

  // get locked period multiplier
  static getLockPeriodMultiplier(waitDays: bigint | number) {

    // ---------------------------------------------------------
    // D. Lock Period Multiplier (LPM)
    // Rust: 1.0 + isqrt(days) * 0.5
    // ---------------------------------------------------------

    waitDays = this.toBigInt(waitDays)

    const lpmBonus = isqrt(waitDays) * LPM_SCALE_SCALED;
    const lockMultiplier = PRECISION + lpmBonus;
    return lockMultiplier;
  }

  // Network Effect Multiplier
  static getNetworkEffectMultiplier(rank: bigint | number, globalRank: bigint | number){

    // ---------------------------------------------------------
    // C. Network Effect Multiplier (NEM)
    // Rust: 1.0 + isqrt(global - rank) * 0.1
    // ---------------------------------------------------------

    rank = this.toBigInt(rank);

    globalRank = this.toBigInt(globalRank)

    let delta = globalRank - rank;
    if (delta < 0n) delta = 0n; // saturate_sub

    const nemBonus = isqrt(delta) * NEM_CURVE_SCALED; // Integers multiply first
    const rawNem = PRECISION + nemBonus;

    // min(raw, max)
    const networkMultiplier = rawNem > NEM_MAX_SCALED ? NEM_MAX_SCALED : rawNem;

    return networkMultiplier;
  }

  // Reward with Late Mint Penalty
  static getRewardWithPenalty(totalReward: bigint | number, daysLate: bigint | number):
    { penaltyPercent:bigint,
      finalReward: bigint
    }
  {

    totalReward = this.toBigInt(totalReward)

    daysLate = this.toBigInt(daysLate)

    let penaltyPercent = 0n;
    let finalReward = totalReward;

    if (daysLate > 0n) {
      // Clamp at index 7 (99%)
      const idx = daysLate >= 7n ? 7 : Number(daysLate);
      penaltyPercent = LATE_MINT_PENALTY[idx];

      const retainedPercent = 100n - penaltyPercent;

      // Apply penalty: total * retained / 100
      finalReward = (totalReward * retainedPercent) / 100n;
    }

    return {
      penaltyPercent,
      finalReward
    }
  }

  /**
   * Calculates the Final Reward by combining all components using BigInt math
   * to ensure exact parity with the Rust Smart Contract.
   */
  static calculateFinalReward(
    userRankVal: number,
    globalRankVal: number,
    lockPeriodDaysVal: number,
    daysLateVal: number,
    tokenDecimals: number = TOKEN_DECIMALS, // Default to const if not provided
  ): MintRewardInfo {

    // 1. Convert inputs to BigInt for integer math
    const rank = BigInt(Math.floor(userRankVal));
    const globalRank = BigInt(Math.floor(globalRankVal));
    const waitDays = BigInt(Math.floor(lockPeriodDaysVal));
    const daysLate = BigInt(Math.floor(daysLateVal));

    // A. get the baseReward
    const baseReward = this.getBaseReward(rank);

    // ---------------------------------------------------------
    // B. Early Adopter Multiplier (EAM)
    // ---------------------------------------------------------

    const eaMultiplier = this.getEarlyAdopterMultiplier(rank);

    // ---------------------------------------------------------
    // C. Network Effect Multiplier (NEM)
    // Rust: 1.0 + isqrt(global - rank) * 0.1
    // ---------------------------------------------------------

    const networkMultiplier = this.getNetworkEffectMultiplier(rank, globalRank)

    // ---------------------------------------------------------
    // D. Lock Period Multiplier (LPM)
    // Rust: 1.0 + isqrt(days) * 0.5
    // ---------------------------------------------------------

    const lockMultiplier = this.getLockPeriodMultiplier(waitDays)

    // ---------------------------------------------------------
    // E. Aggregation
    // ---------------------------------------------------------
    let totalReward = baseReward;

    // Apply multipliers sequentially with precision scaling correction
    totalReward = mulScale(totalReward, eaMultiplier);
    totalReward = mulScale(totalReward, networkMultiplier);
    totalReward = mulScale(totalReward, lockMultiplier);

    // ---------------------------------------------------------
    // F. Late Penalty
    // ---------------------------------------------------------

    const { penaltyPercent, finalReward } = this.getRewardWithPenalty(totalReward, daysLate)


    // ---------------------------------------------------------
    // G. Final Token Scaling (Transactions)
    // ---------------------------------------------------------
    // This calculates the raw integer to send to the blockchain (e.g. 900000)
    const tokenScale = 10n ** BigInt(tokenDecimals);
    const finalAmountRaw = (finalReward * tokenScale) / PRECISION;

    // ---------------------------------------------------------
    // H. Convert back to floating point for UI Display
    // ---------------------------------------------------------
    // helper: Converts internal BigInt (1,000,000 precision) to a human readable Number
    const toUiFloat = (val: bigint) => Number(val) / Number(PRECISION);

    return {
      rank: userRankVal,
      baseReward: toUiFloat(baseReward),
      networkMultiplier: toUiFloat(networkMultiplier),
      earlyAdopterMultiplier: toUiFloat(eaMultiplier),
      lockPeriodMultiplier: toUiFloat(lockMultiplier),

      // Both now use toUiFloat so they are comparable in the UI
      finalReward: toUiFloat(finalReward), // Post-Penalty
      rewardAmount: toUiFloat(totalReward), // Pre-Penalty

      globalRank: globalRankVal,
      daysLate: Number(daysLate),
      penaltyPercent: Number(penaltyPercent),

      // Use this string for Solana Transaction arguments (u64)
      rawRewardAmount: finalAmountRaw.toString(),
    };
  }
}

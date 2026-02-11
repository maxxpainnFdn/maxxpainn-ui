import { UserStakeInfo } from "@/types/UserStakeInfo";
import { stakingConfig } from "@/config/staking";

const { maxYield, minTermDays, maxTermDays } = stakingConfig;

// Constants
const SECONDS_PER_DAY = 86400;

export interface StakeInfo {
  termDays: number;
  amount: number;
  endTime: number; // Unix timestamp (seconds)
}

export class StakingMath {
  /**
   * Calculates the new weighted unstake time based on the amount added vs existing amount.
   * Mirrors: get_weighted_end_time
   */
  static getWeightedEndTime(
    stakeInfo: UserStakeInfo,
    addedAmount: number,
    currentTime: number,
  ): number {
    // 1. Calculate the target end date for the NEW capital
    const termSeconds = stakeInfo.termDays * SECONDS_PER_DAY;
    const targetNewUnstakeTime = currentTime + termSeconds;

    // 2. Check if the EXISTING stake is already expired
    if (currentTime >= stakeInfo.endTime) {
      // If expired, the old money is "free". Reset entire pot to the new target date.
      return targetNewUnstakeTime;
    }

    // 3. If Active, Calculate Weighted Average of the End Dates
    const weightOld = stakeInfo.amount * stakeInfo.endTime;
    const weightNew = addedAmount * targetNewUnstakeTime;

    const totalWeight = weightOld + weightNew;
    const totalAmount = stakeInfo.amount + addedAmount;

    if (totalAmount === 0) {
      return targetNewUnstakeTime;
    }

    // Return the average, floored to nearest second (integer timestamp)
    return Math.floor(totalWeight / totalAmount);
  }

  /**
   * Calculates pending rewards.
   * Mirrors: get_reward
   */
  static getReward(
    principal: number,
    termDays: number,
    termElapsedSecs: number,
  ): number {
    if (principal === 0 || termDays === 0 || termElapsedSecs <= 0) {
      return 0;
    }

    const yieldPercent = this.getFixedYieldPercent(termDays);

    // 1. Cap elapsed time to the term duration
    const termSecs = termDays * SECONDS_PER_DAY;
    const cappedElapsedSecs = Math.min(termElapsedSecs, termSecs);

    // 2. Calculation
    // Rate = yield% / 100
    // Fraction = Elapsed / Total Term
    // Reward = Principal * Rate * Fraction
    const rate = yieldPercent / 100;
    const fraction = cappedElapsedSecs / termSecs;

    // Return exact float result (use Math.floor() externally if token logic requires integers)
    return principal * rate * fraction;
  }

  /**
   * Calculates the yield percentage based on the term length.
   * Mirrors: get_fixed_yield_bps (but returns %)
   *
   * yield = maxYield * term / maxTermDays
   *
   * This proportional formula ensures that splitting a long stake
   * into repeated shorter stakes cannot earn more than the max yield.
   */
  static getFixedYieldPercent(termDays: number): number {
    if (maxTermDays === 0) {
      return 0;
    }

    // 1. Clamp term_days
    let term = Math.max(termDays, minTermDays);
    term = Math.min(term, maxTermDays);

    // 2. Proportional yield: maxYield * term / maxTermDays
    return (maxYield * term) / maxTermDays;
  }

  static getMultiplier(termDays: number) {
    const yieldPercent = this.getFixedYieldPercent(termDays);
    return (1 + yieldPercent / 100).toFixed(2);
  }
}

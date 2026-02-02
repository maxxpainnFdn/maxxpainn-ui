import { stakingConfig } from "@/config/staking";

//const { minApy, maxApy, minTermDays, maxTermDays } = stakingConfig;

export default class StakingAlgo {
  /*static getApy(termDays: number): number {
    // Clamp termDays to min/max
    const term = Math.max(minTermDays, Math.min(termDays, maxTermDays));

    // Daily increment per day after minTerm
    const dailyIncrement = (maxApy - minApy) / (maxTermDays - minTermDays);

    // APY = minApy + elapsed days beyond minTerm
    const apy = minApy + (term - minTermDays) * dailyIncrement;

    return Number(apy.toFixed(2));
  }

  static getMultiplier(termDays) {
    // Mock Logic: 1x base + 0.5x per 90 days
    const apy = this.getApy(termDays);
    return (1 + apy / 100).toFixed(2);
  }

  static getReward(
    principal: number,
    termDays: number,
    elapsedTimeSecs: number,
  ): number {
    if (termDays <= 0 || principal <= 0 || elapsedTimeSecs <= 0) {
      return 0; // early return for invalid values
    }

    const apyPercent = this.getApy(termDays);

    if (apyPercent <= 0) return 0;

    // Total reward for the full term
    const totalReward = principal * (apyPercent / 100);

    // Convert termDays to seconds
    const termSecs = termDays * 24 * 60 * 60;

    // Cap elapsed time to the term duration
    const cappedElapsedSecs = Math.min(elapsedTimeSecs, termSecs);

    // Scale reward by fraction of term completed
    const elapsedReward = totalReward * (cappedElapsedSecs / termSecs);

    // Truncate decimals like on-chain
    return Math.floor(elapsedReward);
  }*/
}

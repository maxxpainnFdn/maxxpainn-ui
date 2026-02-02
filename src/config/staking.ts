export interface StakingConfig {
  minYield: number;
  maxYield: number;
  minTermDays: number;
  maxTermDays: number;
  penaltyPercent: number;
}

export const stakingConfig: StakingConfig = {
  minYield: 5,
  maxYield: 100,
  minTermDays: 1,
  maxTermDays: 1095,
  penaltyPercent: 10
};

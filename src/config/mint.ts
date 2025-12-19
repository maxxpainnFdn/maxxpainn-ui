interface MintConfig {
  minLockDays: number;
  maxLockDays: number;
  defaultLockPeriod: number;
  mintRewardUsd: number;
}

const config: MintConfig = {
  minLockDays: 1,
  maxLockDays: 1461, // 4years
  defaultLockPeriod: 30,
  mintRewardUsd: 0.1
}

export default config;

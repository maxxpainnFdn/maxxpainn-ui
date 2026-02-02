export default class MintCore {

    /**
     * Returns the maximum allowed lock period in seconds for a given rank.
     * Matches Rust: max_wait_period_for_rank
     */
    static maxLockPeriodSecondsForRank(rank) {
        
        // Ensure rank is treated as a number
        const r = Number(rank);
        let days;

        if (r <= 10_000) {
            days = 30;          // Founders
        } else if (r <= 100_000) {
            days = 60;          // Pioneers
        } else if (r <= 1_000_000) {
            days = 90;          // Early
        } else if (r <= 10_000_000) {
            days = 180;         // Growth
        } else if (r <= 100_000_000) {
            days = 365;         // Mainstream
        } else if (r <= 500_000_000) {
            days = 730;         // Late
        } else {
            days = 1095;        // Final (3 years)
        }

        const SECONDS_PER_DAY = 86400;

        return days * SECONDS_PER_DAY;
    }

}

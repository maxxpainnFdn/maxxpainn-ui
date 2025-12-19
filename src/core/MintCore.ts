
export default class MintCore {

    static maxLockPeriodSecondsForRank(rank) {
        
        let days;

        if (rank >= 0 && rank <= 100_000) {
            days = 30; // early adopters
        } else if (rank <= 1_000_000) {
            days = 90;
        } else if (rank <= 5_000_000) {
            days = 180;
        } else if (rank <= 10_000_000) {
            days = 360;
        } else if (rank <= 100_000_000) {
            days = 480; // around 400M gives ~480d
        } else if (rank <= 400_000_000) {
            days = 540;
        } else if (rank <= 1_000_000_000) {
            days = 720;
        } else {
            days = 1825; // cap at 5 years
        }

        const SECONDS_PER_DAY = 86400;

        return days * SECONDS_PER_DAY;
    }

}
import { Activity, Award, ChevronRight, Crown, Medal, PiggyBank, Star, TrendingUp, Users, Zap } from "lucide-react";
import QuickStatCard from "../QuickStatCard";

export interface OverviewContentProps {
  totalMints: number;
  amountMinted: number;
  totalReferral: number;
  totalFollowers: number;
}

export default function OverviewContent({
  totalMints,
  amountMinted,
  totalReferral,
  totalFollowers
}: OverviewContentProps) {
  return (
    <div className="space-y-8">


      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
        <QuickStatCard
          icon={Zap}
          label="Mint Count"
          value={totalMints}
          sub=""
          color="purple"
          //trend=""
        />
        <QuickStatCard
          icon={PiggyBank}
          label="Minted Amount"
          value={amountMinted}
          sub=""
          color="blue"
          //trend=""
        />
        <QuickStatCard
          icon={Star}
          label="Referrals"
          value={totalReferral}
          sub=""
          color="emerald"
          //trend="+8.1%"
        />
        <QuickStatCard
          icon={Users}
          label="Followers"
          value={totalFollowers}
          sub=""
          color="yellow"
          //trend="+8.1%"
        />
      </div>


    </div>
  );
}

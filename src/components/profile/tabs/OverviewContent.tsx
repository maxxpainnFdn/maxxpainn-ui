import { Activity, Award, ChevronRight, Crown, Medal, PiggyBank, Star, TrendingUp, Users, Zap } from "lucide-react";
import QuickStatCard from "../QuickStatCard";
import StatsCard from "@/components/StatsCard";

export interface OverviewContentProps {
  totalMints: number | string;
  amountMinted: number | string;
  totalReferral: number | string;
  totalFollowers: number | string;
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
        <StatsCard
          icon={Zap}
          title="Mint Count"
          value={totalMints || 0}
          color="magenta"
          //trend=""
        />
        <StatsCard
          icon={PiggyBank}
          title="Minted Amount"
          value={amountMinted}
          color="plasma"
          //trend=""
        />
        
        <StatsCard
          icon={Users}
          title="Followers"
          value={totalFollowers}
          color="neon"
          //trend="+8.1%"
        />
      </div>


    </div>
  );
}

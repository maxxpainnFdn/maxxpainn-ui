import { Info } from "lucide-react";
import PainMeter from "./PainMeter";

export interface MintPreviewData {
    baseReward: number;
    earlyAdopterMultiplier: number;
    lockPeriodMultiplier: number;
    networkMultiplier: number;
    minRewardAmount: number;
}

export default function MintPreview({ 
    baseReward,
    earlyAdopterMultiplier,
    lockPeriodMultiplier,
    networkMultiplier,
    minRewardAmount
 }: MintPreviewData) {
    return (
        <div className="bg-gray-900/80 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Reward Preview</h3>
            
            <div className="space-y-4">
            {[
                { label: 'Base', value: baseReward.toLocaleString(), info: 'Base reward decreases as token supply increases' },
                { label: 'EAM', value: `${earlyAdopterMultiplier.toFixed(2)}x`, info: 'Early Adopter Multiplier gives early users extra boost' },
                { label: 'LPM', value: `${lockPeriodMultiplier.toFixed(2)}x`, info: 'Lock Period Multiplier rewards longer wait times' },
                { label: 'NEM', value: `${networkMultiplier}x`, info: 'Network Effect Multiplier grows as more join' }
            ].map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 font-medium">{item.label}</span>
                        <div className="relative">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                            <div className="hidden group-hover:block absolute left-6 top-0 w-48 bg-gray-800 text-xs text-gray-300 p-3 rounded-lg shadow-xl z-10 border border-purple-500/20">
                                {item.info}
                            </div>
                        </div>
                    </div>
                    <span className="text-white font-bold text-lg">{item.value}</span>
                </div>
            ))}
            
                <div className="border-t-2 border-purple-500/20 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-400 font-semibold">Min. Reward</span>
                        <span className="text-lg xs:text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            {minRewardAmount.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
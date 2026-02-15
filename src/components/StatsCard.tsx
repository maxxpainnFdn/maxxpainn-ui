import { ReactElement, ReactNode } from "react";

export interface StatCardProps {
  title: string;
  color: string;
  value: any;
  icon: any;
}

export const StatsCard = ({ 
  title,
  color,
  value,
  icon
}: StatCardProps) => {
  
  const Icon = icon;
  const iconColor = `text-${color}-400`
  const glow = `bg-${color}-500/10`
  
  return (
    <div
      className={`
        group relative bg-gray-900/40 backdrop-blur-md rounded-xl
        p-4 md:p-6 hover:bg-purple/[0.06] hover:border-purple/[0.1] 
        transition-all duration-500 ease-out cursor-default overflow-hidden
        shadow-lg
      `}
    >
      {/* Subtle gradient glow on hover */}
      <div
        className={`absolute inset-0 ${glow} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl`}
      />

      <div className="relative z-10">
        <div
          className={`inline-flex p-2 md:p-3 rounded-lg ${glow} mb-2.5 md:mb-3`}
        >
          <Icon
            className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`}
            strokeWidth={2}
          />
        </div>

        <p className="text-lg md:text-2xl font-bold tracking-tight text-white">
          { value }
        </p>

        <p className="text-[11px] md:text-xs font-medium text-white/40 uppercase tracking-widest mt-0.5">
          { title }
        </p>
      </div>
    </div>
  )
}

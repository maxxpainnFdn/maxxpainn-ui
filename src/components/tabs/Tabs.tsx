import { cn } from "@/lib/utils";
import { useState } from "react";

export interface TabsProps {
  id: string;
  name: string;
  icon: any;
  component: any;
  args: Record<string, any>
}

export default function Tabs({ items = [] }: TabsProps[]) {
  
  const [activeTab, setActiveTab] = useState<string>((items[0]?.id || ""));

  return (
    <>
      <div className="flex items-end gap-0 border-b border-maxx-violet/15 overflow-x-auto nav-scroll-container">
        {items.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-5 py-3.5 text-sm font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "text-maxx-white"
                  : "text-maxx-sub hover:text-maxx-mid"
              )}
            >
              <tab.icon className={cn("w-4 h-4", isActive ? "text-maxx-pink" : "")} />
              {tab.label}

              {/* Active underline */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-maxx-violet via-maxx-pink to-transparent rounded-t-sm" />
              )}
            </button>
          );
        })}
      </div>
      <div className="animate-fade-up mt-6" key={activeTab}>
        {items.map((tab) => {
          const Component = (tab?.component || <div></div>);
          const args = tab?.args || {}
          
          return (
            <>{ tab.id == activeTab && <Component {...args} /> }</>
          )
        })}
      </div>
    </>
  )
}

import { ChevronDown } from "lucide-react";
import { useState } from "react";

const ClansSorter: React.FC<{ onChange: (value: string) => void }> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('newest');

  const sortTypes: Record<string, string> = {
    newest: "Newest",
    oldest: "Oldest",
    most_members: "Most Members",
    least_members: "Least Members",
    most_earned: "Highest Earnings",
    least_earned: "Lowest Earnings",
    most_mints:   "Most Mints",
    least_mints:  "Least Mints",
    az: "Name (A–Z)",
    za: "Name (Z–A)",
  };

  const handleSelect = (key: string) => {
    setSelected(key);
    onChange(key);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full xs:w-[180px] sm:w-[220px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 bg-maxx-bg1/80 border-2 border-maxx-violet/20 backdrop-blur-sm rounded-xl text-white font-medium hover:border-purple-500/20 transition-all duration-300 flex items-center justify-between"
      >
        <span>{sortTypes[selected]}</span>
        <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full mt-2 w-full bg-maxx-bg1 backdrop-blur-xl border-2 border-purple-500/30 rounded-lg  max-h-[250px] shadow-2xl z-20 overflow-x-hidden">
            {Object.entries(sortTypes).map(([key, label]) => (
              <button
                key={key}
                onClick={() => handleSelect(key)}
                className={`w-full px-4 py-3 text-left hover:bg-purple-500/20 transition-colors ${
                  selected === key ? 'bg-purple-500/20 text-purple-400 font-semibold' : 'text-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ClansSorter

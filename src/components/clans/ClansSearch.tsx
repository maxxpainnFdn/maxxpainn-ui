import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useEffect, useRef } from "react";

export default function ClansSearch({ onChange }) {
    const inputRef = useRef();
    const timeoutRef = useRef(); // Store timeout ID for cleanup

    const handleOnSearch = (e) => {
        const value = e.target.value;
        
        // Clear the previous timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        
        // @ts-ignore
        timeoutRef.current = setTimeout(() => {
            onChange(value);
        }, 1000); // 500ms is typically better than 3000ms
    }

    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return (
         <div className="flex-1 max-w-sm">
            <div className="relative group">
                <input
                    placeholder="Search clans by name..."
                    onChange={handleOnSearch}
                    className="w-full h-14 pl-5 pr-14 bg-maxx-bg1/80 border-2 border-maxx-violet/20 backdrop-blur-sm  rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-maxx-violet/45 transition-colors duration-300"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-maxx-violet/20 p-2 group-focus-within:text-maxx-violet/45 rounded-lg transition-all duration-300 hover:scale-110">
                  <Search className="w-5 h-5" strokeWidth={3} />
                </button>
            </div>
        </div>
    )
}

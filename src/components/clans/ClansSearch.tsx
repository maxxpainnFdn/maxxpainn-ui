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
                    className="w-full h-14 pl-5 pr-14 bg-maxx-bg1/10 rounded-lg  overflow-hidden border-2 border-maxx-violet/10  text-white placeholder:text-maxx-sub focus:border-purple-500/60 focus:outline-none transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2  p-2 rounded-lg transition-all duration-300 hover:scale-110">
                    <Search className="w-5 h-5  text-maxx-violet/20  group-focus-within:text-maxx-violet" strokeWidth={2.5} />
                </button>
            </div>
        </div>
    )
}

import { Loader } from "lucide-react";

export default function Spinner({ className= ""}) {
    return(
        <div className={`flex align-middle  items-center justify-center ${className}`}>
            <Loader size={20} className="animate-spin" /> 
        </div>
    )
}
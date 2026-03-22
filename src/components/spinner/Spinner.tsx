import { Loader } from "lucide-react";

export default function Spinner({ className= "", size=20}) {
    return(
        <div className={`flex align-middle  items-center justify-center ${className}`}>
            <Loader size={size} className="animate-spin" /> 
        </div>
    )
}

import { ArrowLeft } from "lucide-react";
import Button from "../button/Button";
import { Link, useNavigate } from "react-router-dom";

export default function TitleAndBackBtn({ title }) {
  
  const navigate = useNavigate()
  
  return (
    <div className="relative my-5">
      <div className="sticky top-[160px] z-20 flex align-middle ">
        <Link to="/stories"
          //variant="ghost"
          className="p-1 text-maxx-violetLt/90 hover:bg-transparent hover:border-transparent active:border-transparent"
        >
          <ArrowLeft />
        </Link>
        <div className="font-light font-sans text-2xl text-maxx-violetLt/90 ml-3">
          {title}
        </div>
      </div>
    </div>
  )
}

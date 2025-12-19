import React from "react"
import { Popover as Popover_, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverArrow } from "@radix-ui/react-popover";

export interface PopoverProps {
    content: string | any;
    children: any;
}

export default function Popover({ content, children, ...props}: PopoverProps){
    return (
        <Popover_>
            <PopoverTrigger  className="z-0">
                { children }
            </PopoverTrigger>
            <PopoverContent>
                { content }
				<PopoverArrow />
            </PopoverContent>
        </Popover_>
    )
}
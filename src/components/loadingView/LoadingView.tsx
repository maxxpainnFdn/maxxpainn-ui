import { Loader, LoaderIcon } from "lucide-react";
import { ReactNode } from "react";
import ErrorView from "../errorView/ErrorView";
import Spinner from "../spinner/Spinner";
import errorMessages from "@/data/errorMessages";

export interface LoadingViewProps {
    children?: ReactNode;
    loading: boolean;
    error?: string;
    errorIcon?: any;
    className?: string;
    onBack?: () => void;
    onReload?: () => void;
}

export default function LoadingView({
    children = <></>,
    loading,
    error = "",
    errorIcon = null,
    className="",
    onBack=null,
    onReload=null
}: LoadingViewProps) {

    const errorProps = { title: "", message: error, Icon: errorIcon }

    if(error != ""){

        const errorSlug = error.toLowerCase().trim().replace(/\s+/g, "_");

        if (errorSlug in errorMessages) {
            const errObj = errorMessages[errorSlug];
            errorProps.title = errObj.title || "";
            errorProps.message = errObj.description || error;
            errorProps.Icon = errObj.icon || null;
        }
    }

    return (
        <>
        { loading ?
            <Spinner className={className} /> :
            <>
                {error != "" ?
                    <div className={`flex align-middle  items-center justify-center ${className}`}>
                        <ErrorView {...errorProps} onBack={onBack} onReload={onReload} />
                    </div> :
                    <>{ children }</>
                }
            </>
        }
        </>
    )
}

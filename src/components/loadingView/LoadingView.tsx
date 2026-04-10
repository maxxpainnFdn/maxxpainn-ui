import { ReactNode, useMemo } from "react";
import ErrorView from "../errorView/ErrorView";
import Spinner from "../spinner/Spinner";

export interface LoadingViewProps {
  children?: ReactNode;
  loading: boolean;
  spinerSize?: number;
  error?: string;
  errorIcon?: any;
  className?: string;
  onBack?: () => void;
  onReload?: () => void;
}

export default function LoadingView({
  children = <></>,
  loading,
  spinerSize=20,
  error = "",
  errorIcon = null,
  className="",
  onBack=null,
  onReload=null
}: LoadingViewProps) {

  const errorProps = useMemo(() => ({ text: error, Icon: errorIcon }), [error])

    return (
        <>
        { loading ?
            <Spinner size={spinerSize} className={className} /> :
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

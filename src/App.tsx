
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./routes/Routes";
import WalletProvider from "./components/wallet/WalletProvider";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "./store";
import { AlertDialogProvider } from "./services/AlertDialogProvider";
import { GlobalErrorView } from "./GlobalErrorView";
const queryClient = new QueryClient();

const App = () => {

  const isAuthenticated = useAtomValue(isAuthenticatedAtom)
  const [pageKey, setPageKey] = useState(0)

  useEffect(()=>{
    setPageKey(prev=> (prev+1))
  }, [isAuthenticated])

  return (
    <GlobalErrorView>
      <WalletProvider key={pageKey}>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <AlertDialogProvider>
              <Toaster
                position="top-center"
                richColors={true}
                closeButton={false}
                expand={true}
                visibleToasts={1}
              />
    
              <Routes />
            </AlertDialogProvider>
          </TooltipProvider>
        </QueryClientProvider>
      </WalletProvider>
    </GlobalErrorView>
  );
}

export default App;

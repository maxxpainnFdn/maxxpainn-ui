
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


import WalletCore from "./components/wallet/Wallet"
import Routes from "./routes/Routes";



const queryClient = new QueryClient();

const App = () => (
  <WalletCore>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        
        <Toaster 
          position="top-center" 
          richColors={true}
          closeButton={false}
          expand={true}
          visibleToasts={1}
        />

        <Routes />
    
      </TooltipProvider>
    </QueryClientProvider>
  </WalletCore>
);

export default App;

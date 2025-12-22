
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Routes from "./routes/Routes";
import {  WalletProvider } from '@/components/wallet';
const queryClient = new QueryClient();

const App = () => (
  <WalletProvider>
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
  </WalletProvider>
);

export default App;

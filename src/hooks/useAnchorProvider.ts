import { AnchorProvider } from '@coral-xyz/anchor'
import { useAppKitConnection } from '@reown/appkit-adapter-solana/react'
import { useAppKitProvider } from '@reown/appkit/react'
import { AnchorWallet } from '@solana/wallet-adapter-react'


export function useAnchorProvider() {

  const { walletProvider } = useAppKitProvider<any>('solana')
  const { connection } = useAppKitConnection();


  const getProvider = (network?: string) => {

    //const networkInfo = networks[network] 

   // const connection = new Connection(networkInfo.rpcUrls.default.http[0], 'confirmed')
    
    let anchorWallet = null;
    
    if(walletProvider) {
      anchorWallet = (walletProvider as AnchorWallet)
    }                      
                        
    const provider = new AnchorProvider(connection, anchorWallet, { commitment: 'confirmed' })

    return provider
  }
  
  return { getProvider }
}
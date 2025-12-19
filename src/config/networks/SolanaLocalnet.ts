import { defineChain } from '@reown/appkit/networks';

// Define the custom network
export const solanaLocalnet = defineChain({
    id: "C7PPtqrayTxjudYFNtv2hbWcU6SzEgvGjoZer4eAxv4V",
    name: "Solana Localnet",
    network: "solana-localnet",
    nativeCurrency: {
        name: "Solana",
        symbol: "SOL",
        decimals: 9
    },
    rpcUrls: {
        default: {
            http: [
                "http://127.0.0.1:8899"
            ]
        },
        chainDefault: {
            http: [
                "http://127.0.0.1:8899"
            ]
        }
    },
    blockExplorers: {
        default: {
          name: "Solscan",
          url: "https://solscan.io?cluster=custom&customUrl=http://127.0.0.1:8899"
        }
    },
    testnet: true,
    chainNamespace: "solana",
    caipNetworkId: "solana:C7PPtqrayTxjudYFNtv2hbWcU6SzEgvGjoZer4eAxv4V",
})


import { AppKitNetwork, solanaDevnet } from "@reown/appkit/networks";
import appConfig from "@/config/app"
import { solanaLocalnet } from "./networks/SolanaLocalnet";

// 1. Get projectId from https://dashboard.reown.com
export const projectId = "80b9218bf295e94b613a74ec2f49025e";

// 2. Create a metadata object - optional
export const metadata = {
  name: appConfig.name,
  description: appConfig.description,
  url: appConfig.url, // origin must match your domain & subdomain
  icons: [window.origin+"/logo_rounded.svg"],
};

export const networks: Record<string, AppKitNetwork> = {
  "solana-devnet":  solanaDevnet,
  //"solana-localnet": solanaLocalnet
}
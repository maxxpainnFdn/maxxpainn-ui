import { ConstantsUtil } from '@reown/appkit-common';
import { SIWXVerifier } from "@reown/appkit-siwx";
import VerifierCore from './VerifierCore';

/**
 * Default verifier for Solana sessions.
 */
export class SolanaAuthVerifier extends SIWXVerifier {
    
    chainNamespace = ConstantsUtil.CHAIN.SOLANA;

    async verify(session): Promise<boolean> {
        return VerifierCore.verify(this.chainNamespace, session);
    }
}
// services/authService.ts
import { AuthNonce, SignedSession, SessionStatus } from '@/types/Auth';
import authConfig from '@/config/auth';
import { Status } from '@/core/Status';
import HttpClient from './HttpClient';
import toast from '@/hooks/toast';

class AuthService {

  /**
   * Fetch a new nonce from the server
   */
  async getNonce(address: string): Promise<Status> {
    const uri = authConfig.endpoints.getNonce
    return HttpClient.get(uri, { address })
  }

  /**
   * Verify the signed message with the server
   */
  async verifySignature(signedSession: SignedSession): Promise<Status> {
    const uri = authConfig.endpoints.verifySignature
    return HttpClient.post(uri, signedSession)
  }

  /**
   * Get current session status
   */
  async getSession(address: string): Promise<Status> {
    const uri = authConfig.endpoints.getSession
    return await HttpClient.get(uri, { address })
  }

  /**
   * Logout / invalidate session
   */
  async logout(): Promise<Status> {
    const uri = authConfig.endpoints.logout
    return HttpClient.get(uri, {})
  }

  /**
   * Build the SIWS message
   */
  buildSignMessage(
    address:   string,
    nonce:     string,
    chainId:   string,
    issuedAt:  string,
    expiresAt: string
  ): string {
    const message = [
      `${authConfig.appDomain} wants you to sign in with your Solana account:`,
      address,
      '',
      authConfig.statement,
      '',
      `URI: ${authConfig.appUri}`,
      `Version: 1`,
      `Chain ID: ${chainId}`,
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAt}`,
      `Expiration Time: ${expiresAt}`,
    ].join('\n');

    return message;
  }
}

export const authService = new AuthService();
export default AuthService;

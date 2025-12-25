// services/authService.ts
import {  SignedSession } from '@/types/Auth';
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

  getSessions() {
    let sessions = localStorage.getItem()
  }

  /**
   * Get current session status
   */
  async getSession(address: string): Promise<Status> {

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

}

export const authService = new AuthService();
export default AuthService;

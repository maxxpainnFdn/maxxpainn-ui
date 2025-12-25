import { AccountData } from "./AccountData";

// types/auth.ts
export interface AuthNonce {
  nonce: string;
  expiresAt: string;
  issuedAt: string;
}

export interface SignedSession {
  address: string;
  signature: string;
  message: string;
  nonce: string;
}

export interface SessionData {
  isAuthenticated:  boolean;
  accessToken?:     string;
  accessTokenExpiryMs?: number;
}

export interface SessionWithAccountData extends SessionData {
  accountInfo?: AccountData
}

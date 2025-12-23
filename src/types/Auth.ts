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

export interface SessionStatus {
  isAuthenticated: boolean;
  id?:        number;
  address?:   string;
  username?:  string;
  photo?:     string;
}

import app from "./app";

// config/auth.ts
export const authConfig = {

  // Your app info for the SIWS message

  enabled: true,

  appName: app.name,
  appDomain: typeof window !== 'undefined' ? window.location.host : 'localhost',
  appUri: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',

  // Session settings
  sessionStorageKey: '__session',

  // API endpoints (adjust to your backend)
  endpoints: {
    getNonce: '/auth/nonce',
    verifySignature: '/api/auth/verify',
    getSession: '/auth/session',
    logout: '/auth/logout',
  },

  // Statement shown to user
    statement: `Sign this message to verify your wallet ownership and access ${app.name}. 
        This request will not trigger a blockchain transaction or cost any gas fees.`,
};

export default authConfig;

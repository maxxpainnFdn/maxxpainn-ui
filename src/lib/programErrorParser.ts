import { AnchorError, ProgramError } from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';

export interface ParsedAnchorError {
  type: 'anchor' | 'program' | 'rpc' | 'transaction' | 'unknown';
  code?: number | string;
  message: string;
  errorName?: string;
  logs?: string[];
  raw?: any;
}

/**
 * Parse errors from Anchor program calls into a structured format
 * @param error - The error object caught from an Anchor program call
 * @param program - Optional: The Anchor Program instance to help resolve custom error codes
 * @returns ParsedAnchorError with structured error information
 */
export function parseAnchorError(
  error: any,
  program?: Program
): ParsedAnchorError {
  // Handle AnchorError (custom program errors defined in IDL)
  if (error instanceof AnchorError) {
    return {
      type: 'anchor',
      code: error.error.errorCode.number,
      errorName: error.error.errorCode.code,
      message: error.error.errorMessage || error.message,
      logs: error.logs,
      raw: error,
    };
  }

  // Handle ProgramError (errors with error codes)
  if (error instanceof ProgramError) {
    return {
      type: 'program',
      code: error.code,
      message: error.msg || error.message,
      logs: error.logs,
      raw: error,
    };
  }

  // Handle SendTransactionError (transaction simulation/sending failures)
  if (error?.message?.includes('Transaction simulation failed') || 
      error?.name === 'SendTransactionError') {
    const logs = error.logs || [];
    const programErrorMatch = logs
      .join('\n')
      .match(/Program log: AnchorError.*?: (.*?)(?:\.|$)/i);
    
    return {
      type: 'transaction',
      message: programErrorMatch 
        ? `Transaction failed: ${programErrorMatch[1]}`
        : error.message || 'Transaction simulation failed',
      logs,
      raw: error,
    };
  }

  // Handle RPC errors (network/connection issues)
  if (error?.code || error?.name?.includes('RPC')) {
    return {
      type: 'rpc',
      code: error.code,
      message: error.message || 'RPC error occurred',
      raw: error,
    };
  }

  // Try to extract error code from error message or logs
  if (error?.logs) {
    const customErrorMatch = error.logs
      .join('\n')
      .match(/custom program error: 0x([0-9a-f]+)/i);
    
    if (customErrorMatch) {
      const errorCode = parseInt(customErrorMatch[1], 16);
      const errorName = program?.idl?.errors?.find(
        (e: any) => e.code === errorCode
      )?.name;
      const errorMessage = program?.idl?.errors?.find(
        (e: any) => e.code === errorCode
      )?.msg;

      return {
        type: 'program',
        code: errorCode,
        errorName,
        message: errorMessage || `Custom program error: ${errorCode}`,
        logs: error.logs,
        raw: error,
      };
    }
  }

  // Fallback for unknown errors
  return {
    type: 'unknown',
    message: error?.message || String(error) || 'Unknown error occurred',
    logs: error?.logs,
    raw: error,
  };
}

/**
 * Get a user-friendly error message from an Anchor error
 * @param error - The error object caught from an Anchor program call
 * @param program - Optional: The Anchor Program instance
 * @returns A user-friendly error message string
 */
export function getAnchorErrorMessage(
  error: any,
  program?: Program
): string {
  const parsed = parseAnchorError(error, program);
  
  switch (parsed.type) {
    case 'anchor':
    case 'program':
      return `${parsed.errorName ? `${parsed.errorName}: ` : ''}${parsed.message}`;
    case 'transaction':
      return parsed.message;
    case 'rpc':
      return `Network error: ${parsed.message}`;
    default:
      return parsed.message;
  }
}

/**
 * Log detailed error information to console
 * @param error - The error object caught from an Anchor program call
 * @param program - Optional: The Anchor Program instance
 */
export function logAnchorError(
  error: any,
  program?: Program
): void {
  const parsed = parseAnchorError(error, program);
  
  console.error('=== Anchor Program Error ===');
  console.error('Type:', parsed.type);
  if (parsed.code !== undefined) console.error('Code:', parsed.code);
  if (parsed.errorName) console.error('Error Name:', parsed.errorName);
  console.error('Message:', parsed.message);
  
  if (parsed.logs && parsed.logs.length > 0) {
    console.error('\nTransaction Logs:');
    parsed.logs.forEach((log, i) => console.error(`  ${i + 1}. ${log}`));
  }
  
  console.error('\nRaw Error:', parsed.raw);
  console.error('============================');
}
export type MutationResponse<T = any> = {
  success?: {
    data: T;
    message?: string;
  };
  error?: {
    message: string;
    code?: string;
  };
};
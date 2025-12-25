export type StatusType = "success" | "error";

export interface StatusJSON<T = unknown> {
  type: StatusType;
  message?: string | null;
  data?: T | null;
}

export class Status<T = unknown> {
  readonly type: StatusType;
  readonly message: string | null;
  readonly data: T | null;

  constructor(type: StatusType, message: string | null = null, data: T | null = null) {
    this.type = type;
    this.message = message;
    this.data = data;
  }

  // ✅ Factory methods
  static success<T>(message: string = "", data: T | null = null): Status<T> {
    return new Status("success", message, data);
  }

  static successData<T>(data: T): Status<T> {
    return this.success("", data);
  }

  static error<T = unknown>(message: string, data: T | null = null): Status<T> {
    return new Status("error", message, data);
  }

  // ✅ Convert from JSON
  static fromJSON<T>(json: StatusJSON<T>): Status<T> {
    if (!json || (json.type !== "success" && json.type !== "error")) {
      throw new Error("Invalid status JSON");
    }
    return new Status<T>(
      json.type,
      json.message ?? null,
      json.data ?? null
    );
  }

  // ✅ Convert back to plain JSON (useful for API responses)
  toJSON(): StatusJSON<T> {
    return {
      type: this.type,
      message: this.message,
      data: this.data,
    };
  }

  // ✅ Helpers
  isSuccess(): boolean {
    return this.type === "success";
  }

  isError(): boolean {
    return this.type === "error";
  }

  getType(): StatusType {
    return this.type;
  }

  getMessage(): string | null {
    return this.message;
  }

  getData(): T | null {
    return this.data as T;
  }
}

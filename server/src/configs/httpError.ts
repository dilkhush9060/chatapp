export class HttpError extends Error {
  public statusCode: number;
  public error?: unknown;
  public status: boolean;

  constructor(message: string, statusCode: number, error?: unknown) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.error = error;
    this.status = false;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

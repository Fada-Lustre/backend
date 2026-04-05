export class ApplicationError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, ApplicationError);
  }
}

export class WrapperError extends Error {
  statusCode: number;
  cause: Error;

  constructor(statusCode: number, message: string, cause: Error) {
    super(message);
    this.statusCode = statusCode;
    this.cause = cause;
    Error.captureStackTrace(this, WrapperError);
  }
}

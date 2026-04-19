export class ApplicationError extends Error {
  statusCode: number;
  code: string;

  constructor(statusCode: number, message: string, code = "APP_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
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

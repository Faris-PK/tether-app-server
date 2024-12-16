export class BaseCustomError extends Error {
    statusCode: number;
  
    constructor(message: string, statusCode: number) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode;
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export class ValidationError extends BaseCustomError {
    constructor(message: string) {
      super(message, 400);
    }
  }
  
  export class UnauthorizedError extends BaseCustomError {
    constructor(message: string = 'Unauthorized') {
      super(message, 401);
    }
  }
  
  export class ForbiddenError extends BaseCustomError {
    constructor(message: string = 'Forbidden') {
      super(message, 403);
    }
  }
  
  export class NotFoundError extends BaseCustomError {
    constructor(message: string = 'Resource not found') {
      super(message, 404);
    }
  }
  
  export class ConflictError extends BaseCustomError {
    constructor(message: string) {
      super(message, 409);
    }
  }
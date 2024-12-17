export declare class BaseCustomError extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class ValidationError extends BaseCustomError {
    constructor(message: string);
}
export declare class UnauthorizedError extends BaseCustomError {
    constructor(message?: string);
}
export declare class ForbiddenError extends BaseCustomError {
    constructor(message?: string);
}
export declare class NotFoundError extends BaseCustomError {
    constructor(message?: string);
}
export declare class ConflictError extends BaseCustomError {
    constructor(message: string);
}

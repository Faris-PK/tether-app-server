import { Request, Response, NextFunction } from 'express';
export declare const adminAuthMiddleware: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;

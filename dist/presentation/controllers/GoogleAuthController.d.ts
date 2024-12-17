import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
export declare class GoogleAuthController {
    private userRepository;
    constructor(userRepository: UserRepository);
    googleLogin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}

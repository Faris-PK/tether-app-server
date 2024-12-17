import { Request, Response } from 'express';
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { OTPRepository } from '../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../infrastructure/mail/MailService';
export declare class AuthController {
    private userRepository;
    private otpRepository;
    private mailService;
    private registerUserUseCase;
    private verifyOTPUseCase;
    private loginUserUseCase;
    private refreshTokenUseCase;
    private resendOTPUseCase;
    private forgotPasswordUseCase;
    private resetPasswordUseCase;
    constructor(userRepository: UserRepository, otpRepository: OTPRepository, mailService: MailService);
    register(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    verifyOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    resendOTP(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    login(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    refreshToken(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    logout(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    forgotPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    resetPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

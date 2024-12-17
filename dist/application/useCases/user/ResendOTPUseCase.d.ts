import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
export declare class ResendOTPUseCase {
    private otpRepository;
    private mailService;
    constructor(otpRepository: OTPRepository, mailService: MailService);
    execute(email: string): Promise<void>;
}

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
export declare class ForgotPasswordUseCase {
    private userRepository;
    private mailService;
    constructor(userRepository: UserRepository, mailService: MailService);
    execute(email: string): Promise<string>;
}

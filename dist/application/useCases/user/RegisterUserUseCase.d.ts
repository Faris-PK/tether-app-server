import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { RegisterUserDTO } from '../../dto/RegisterUserDTO';
import { OTPRepository } from '../../../infrastructure/repositories/OTPRepository';
import { MailService } from '../../../infrastructure/mail/MailService';
export declare class RegisterUserUseCase {
    private userRepository;
    private otpRepository;
    private mailService;
    constructor(userRepository: UserRepository, otpRepository: OTPRepository, mailService: MailService);
    execute(userData: RegisterUserDTO): Promise<void>;
}

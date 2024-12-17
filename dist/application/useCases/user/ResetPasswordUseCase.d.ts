import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
interface ResetPasswordDTO {
    token: string;
    newPassword: string;
}
export declare class ResetPasswordUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(data: ResetPasswordDTO): Promise<void>;
}
export {};

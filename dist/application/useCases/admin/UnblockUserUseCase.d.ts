import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
export declare class UnblockUserUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<void>;
}

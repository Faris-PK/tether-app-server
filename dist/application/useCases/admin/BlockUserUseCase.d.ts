import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
export declare class BlockUserUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<void>;
}

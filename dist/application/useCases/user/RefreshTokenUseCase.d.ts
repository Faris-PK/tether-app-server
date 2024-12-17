import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
export declare class RefreshTokenUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(refreshToken: string): Promise<string>;
}

import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IUser } from '../../../domain/entities/User';
export declare class GetUserProfileUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<IUser>;
}

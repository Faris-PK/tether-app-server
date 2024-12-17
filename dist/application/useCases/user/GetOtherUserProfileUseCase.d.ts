import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IUser } from '../../../domain/entities/User';
export declare class GetOtherUserProfileUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string, currentUserId: string): Promise<Partial<IUser>>;
}

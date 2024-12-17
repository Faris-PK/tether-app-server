import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IUser } from '../../../domain/entities/User';
export declare class RemoveProfilePictureUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string, type: 'profile' | 'cover'): Promise<IUser>;
}

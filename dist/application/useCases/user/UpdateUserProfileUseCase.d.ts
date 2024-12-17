import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { UpdateUserProfileDTO } from '../../dto/UpdateUserProfileDTO';
import { IUser } from '../../../domain/entities/User';
export declare class UpdateUserProfileUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string, updateData: UpdateUserProfileDTO): Promise<IUser>;
}

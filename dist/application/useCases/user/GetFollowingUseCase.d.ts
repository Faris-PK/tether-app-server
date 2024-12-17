import { IUserRepository } from '../../../domain/interfaces/IUserRepository';
import { PopulatedUser } from '../../../domain/types/PopulatedUser';
export declare class GetFollowingUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    execute(userId: string): Promise<PopulatedUser[]>;
}

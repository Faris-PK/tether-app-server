import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
export declare class GetPeopleSuggestionsUseCase {
    private userRepository;
    constructor(userRepository: UserRepository);
    execute(userId: string): Promise<{
        _id: unknown;
        username: string;
        profile_picture: string | undefined;
        mutualFriends: number;
        isFollowing: boolean;
        createdAt: any;
        premiumStatus: boolean;
    }[]>;
}

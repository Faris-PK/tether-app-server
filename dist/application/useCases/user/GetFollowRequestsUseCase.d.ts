import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
export declare class GetFollowRequestsUseCase {
    private userRepository;
    private notificationRepository;
    constructor(userRepository: UserRepository, notificationRepository: NotificationRepository);
    execute(userId: string): Promise<{
        _id: unknown;
        content: string;
        sender: import("mongoose").Types.ObjectId;
        isFollowing: boolean;
    }[]>;
}

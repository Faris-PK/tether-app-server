import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
export declare class UnfollowUserUseCase {
    private userRepository;
    private notificationRepository;
    constructor(userRepository: UserRepository, notificationRepository: NotificationRepository);
    execute(followerId: string, targetUserId: string): Promise<{
        success: boolean;
    }>;
}

import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IPost } from '../../../domain/entities/Post';
export declare class LikePostNotificationUseCase {
    private postRepository;
    private notificationRepository;
    private userRepository;
    constructor(postRepository: PostRepository, notificationRepository: NotificationRepository, userRepository: UserRepository);
    execute(postId: string, userId: string): Promise<IPost>;
}

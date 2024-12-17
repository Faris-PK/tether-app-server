import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { IComment } from '../../../domain/entities/Comment';
export declare class CreateCommentNotificationUseCase {
    private commentRepository;
    private postRepository;
    private notificationRepository;
    private userRepository;
    constructor(commentRepository: CommentRepository, postRepository: PostRepository, notificationRepository: NotificationRepository, userRepository: UserRepository);
    execute(postId: string, userId: string, content: string, parentCommentId?: string): Promise<IComment>;
}

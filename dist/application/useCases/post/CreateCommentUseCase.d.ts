import { IComment } from '../../../domain/entities/Comment';
import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
export declare class CreateCommentUseCase {
    private commentRepository;
    private postRepository;
    constructor(commentRepository: CommentRepository, postRepository: PostRepository);
    execute(postId: string, userId: string, content: string, parentCommentId?: string): Promise<IComment>;
}

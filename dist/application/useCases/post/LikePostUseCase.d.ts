import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { IPost } from '../../../domain/entities/Post';
export declare class LikePostUseCase {
    private postRepository;
    constructor(postRepository: PostRepository);
    execute(postId: string, userId: string): Promise<IPost>;
}

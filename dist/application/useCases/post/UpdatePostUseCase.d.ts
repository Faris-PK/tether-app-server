import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { IPost } from '../../../domain/entities/Post';
export declare class UpdatePostUseCase {
    private postRepository;
    constructor(postRepository: PostRepository);
    execute(postId: string, userId: string, updateData: {
        caption?: string;
        location?: string;
    }): Promise<IPost>;
}

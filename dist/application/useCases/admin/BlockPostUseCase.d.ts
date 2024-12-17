import { PostRepository } from "../../../infrastructure/repositories/PostRepository";
export declare class BlockPostUseCase {
    private postRepository;
    constructor(postRepository: PostRepository);
    execute(postId: string): Promise<import("../../../domain/entities/Post").IPost>;
}

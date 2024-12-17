import { PostRepository } from "../../../infrastructure/repositories/PostRepository";
export declare class UnblockPostUseCase {
    private postRepository;
    constructor(postRepository: PostRepository);
    execute(postId: string): Promise<import("../../../domain/entities/Post").IPost>;
}

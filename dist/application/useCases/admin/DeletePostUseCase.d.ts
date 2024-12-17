import { PostRepository } from "../../../infrastructure/repositories/PostRepository";
export declare class DeletePostUseCase {
    private postRepository;
    constructor(postRepository: PostRepository);
    execute(postId: string): Promise<void>;
}

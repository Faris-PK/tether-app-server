import { IComment } from "../../../domain/entities/Comment";
import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";
export declare class GetCommentsUseCase {
    private commentRepository;
    constructor(commentRepository: CommentRepository);
    execute(postId: string): Promise<IComment[]>;
}

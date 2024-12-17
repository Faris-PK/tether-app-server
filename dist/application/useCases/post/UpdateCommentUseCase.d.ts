import { IComment } from "../../../domain/entities/Comment";
import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";
export declare class UpdateCommentUseCase {
    private commentRepository;
    constructor(commentRepository: CommentRepository);
    execute(commentId: string, userId: string, content: string): Promise<IComment>;
}

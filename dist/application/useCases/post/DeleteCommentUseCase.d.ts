import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";
export declare class DeleteCommentUseCase {
    private commentRepository;
    constructor(commentRepository: CommentRepository);
    execute(commentId: string, userId: string): Promise<void>;
}

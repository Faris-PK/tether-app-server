import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";

export class DeleteCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}
  
    async execute(commentId: string, userId: string): Promise<void> {
      const isOwner = await this.commentRepository.isCommentOwner(commentId, userId);
      if (!isOwner) {
        throw new Error('Unauthorized to delete this comment');
      }
  
      await this.commentRepository.delete(commentId);
    }
  }
  
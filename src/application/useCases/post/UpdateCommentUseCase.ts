import { IComment } from "../../../domain/entities/Comment";
import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";

export class UpdateCommentUseCase {
    constructor(private commentRepository: CommentRepository) {}
  
    async execute(commentId: string, userId: string, content: string): Promise<IComment> {
      const isOwner = await this.commentRepository.isCommentOwner(commentId, userId);
      if (!isOwner) {
        throw new Error('Unauthorized to edit this comment');
      }
  
      const updatedComment = await this.commentRepository.update(commentId, content);
      if (!updatedComment) {
        throw new Error('Failed to update comment');
      }
  
      return updatedComment;
    }
  }
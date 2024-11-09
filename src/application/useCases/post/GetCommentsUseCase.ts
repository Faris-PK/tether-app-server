import { IComment } from "../../../domain/entities/Comment";
import { CommentRepository } from "../../../infrastructure/repositories/CommentRepository";

export class GetCommentsUseCase {
    constructor(private commentRepository: CommentRepository) {}
  
    async execute(postId: string): Promise<IComment[]> {
      const comments = await this.commentRepository.findByPostId(postId);


      const commentsWithReplies = await Promise.all(
        comments.map(async (comment) => {
          const replies = await this.commentRepository.findRepliesByCommentId(comment._id as string);
          return { ...comment.toObject(), replies };
        })
      );
  
      return commentsWithReplies;
    }
  }
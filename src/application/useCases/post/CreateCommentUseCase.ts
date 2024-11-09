import { Types } from 'mongoose';
import { Comment, IComment } from '../../../domain/entities/Comment';
import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';

export class CreateCommentUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository
  ) {}

  async execute(postId: string, userId: string, content: string, parentCommentId?: string): Promise<IComment> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    if (parentCommentId) {
      const parentComment = await this.commentRepository.findById(parentCommentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }

    return await this.commentRepository.create({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
      content,
      parentCommentId: parentCommentId 
        ? new Types.ObjectId(parentCommentId) 
        : undefined
    });
  }
}
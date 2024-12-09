import { Types } from 'mongoose';
import { CommentRepository } from '../../../infrastructure/repositories/CommentRepository';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { SocketService } from '../../../infrastructure/services/SocketService'; 
import { IComment } from '../../../domain/entities/Comment';

export class CreateCommentNotificationUseCase {
  constructor(
    private commentRepository: CommentRepository,
    private postRepository: PostRepository,
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository
  ) {}

  async execute(
    postId: string, 
    userId: string, 
    content: string, 
    parentCommentId?: string
  ): Promise<IComment> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    let parentComment;
    if (parentCommentId) {
      parentComment = await this.commentRepository.findById(parentCommentId);
      if (!parentComment) {
        throw new Error('Parent comment not found');
      }
    }

    const comment = await this.commentRepository.create({
      postId: new Types.ObjectId(postId),
      userId: new Types.ObjectId(userId),
      content,
      parentCommentId: parentCommentId 
        ? new Types.ObjectId(parentCommentId) 
        : undefined
    });

    const currentUser = await this.userRepository.findById(userId);

    // Only create notification if the comment is not on the user's own post
    if (post.userId.toString() !== userId) {
      const postNotification = await this.notificationRepository.create({
        recipient: post.userId,
        sender: new Types.ObjectId(userId),
        type: 'comment',
        postId: new Types.ObjectId(postId),
        commentId: comment._id as Types.ObjectId,
        content: `${currentUser?.username} commented on your post`
      });

      // Send socket notification for post comment
      SocketService.sendNotificationToUser(post.userId._id.toString(), postNotification);
    }

    // Only create notification for reply if it's not a reply to the user's own comment
    if (parentCommentId && parentComment && parentComment.userId.toString() !== userId) {
      const replyNotification = await this.notificationRepository.create({
        recipient: parentComment.userId,
        sender: new Types.ObjectId(userId),
        type: 'reply_comment',
        postId: new Types.ObjectId(postId),
        commentId: comment._id as Types.ObjectId,
        content: `${currentUser?.username} replied to your comment`
      });

      // Send socket notification for comment reply
      SocketService.sendNotificationToUser(parentComment.userId._id.toString(), replyNotification);
    }

    return comment;
  }
}
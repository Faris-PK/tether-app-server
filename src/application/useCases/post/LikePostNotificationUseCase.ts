import { Types } from 'mongoose';
import { PostRepository } from '../../../infrastructure/repositories/PostRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { SocketService } from '../../../infrastructure/services/SocketService';
import { IPost } from '../../../domain/entities/Post';

export class LikePostNotificationUseCase {
  constructor(
    private postRepository: PostRepository,
    private notificationRepository: NotificationRepository,
    private userRepository: UserRepository
  ) {}

  async execute(postId: string, userId: string): Promise<IPost> {
    const isLiked = await this.postRepository.isLikedByUser(postId, userId);
    
    const updatedPost = isLiked 
      ? await this.postRepository.unlikePost(postId, userId)
      : await this.postRepository.likePost(postId, userId);
    
    if (!updatedPost) {
      throw new Error('Failed to update post like status');
    }

    // Notification logic
    const postOwner = updatedPost.userId.toString();
    if (postOwner !== userId) {
      if (isLiked) {
        // Post was just unliked, so remove the like notification
        await this.notificationRepository.deletePostLikeNotification(postId, userId);
      } else {
        // Post was just liked, so create a like notification
        const currentUser = await this.userRepository.findById(userId);
        const notification = await this.notificationRepository.create({
          recipient: new Types.ObjectId(postOwner),
          sender: new Types.ObjectId(userId),
          type: 'like',
          postId: new Types.ObjectId(postId),
          content: `${currentUser?.username} liked your post`
        });
        SocketService.sendNotificationToUser(postOwner, notification);

      }
    }

    return updatedPost;
  }
}
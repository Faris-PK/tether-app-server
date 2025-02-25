import { Types } from 'mongoose';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';

export class UnfollowUserUseCase {
    constructor(
      private userRepository: UserRepository,
      private notificationRepository: NotificationRepository
    ) {}
  
    async execute(followerId: string, targetUserId: string) {
      const [follower, targetUser] = await Promise.all([
        this.userRepository.findById(followerId),
        this.userRepository.findById(targetUserId)
      ]);
  
      if (!follower || !targetUser) {
        throw new Error('User not found');
      }
  
      const targetObjectId = new Types.ObjectId(targetUserId);
      const followerObjectId = new Types.ObjectId(followerId);
  
      // Remove the follow relationship
      follower.following = follower.following.filter(id => !id.equals(targetObjectId));
      targetUser.followers = targetUser.followers.filter(id => !id.equals(followerObjectId));
  
      // Find and delete the follow notification
      await this.notificationRepository.deleteFollowNotification(
        targetObjectId, 
        followerObjectId
      );
  
      // Save the updated user documents
      await Promise.all([
        this.userRepository.save(follower),
        this.userRepository.save(targetUser)
      ]);
  
      return { success: true };
    }
}
import { Types } from 'mongoose';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { SocketService } from '../../../infrastructure/services/SocketService'; // Import SocketService
import { IUser } from '../../../domain/entities/User';

export class FollowUserUseCase {
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

    if (!follower.following.some(id => id.equals(targetObjectId))) {
      follower.following.push(targetObjectId);
      targetUser.followers.push(followerObjectId);

      // Create follow notification
      const followNotification = await this.notificationRepository.create({
        recipient: targetObjectId,
        sender: followerObjectId,
        type: 'follow_request',
        content: `${follower.username} started following you`
      });

      // Send socket notification for follow
      SocketService.sendNotificationToUser(targetUserId.toString(), followNotification);

      await Promise.all([
        this.userRepository.save(follower),
        this.userRepository.save(targetUser)
      ]);
    }

    return { success: true };
  }
}
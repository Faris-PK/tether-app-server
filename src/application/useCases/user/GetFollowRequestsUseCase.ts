import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';


export class GetFollowRequestsUseCase {
  constructor(
    private userRepository: UserRepository,
    private notificationRepository: NotificationRepository
  ) {}

  async execute(userId: string) {
    const notifications = await this.notificationRepository.findUserNotifications(userId);
    const followRequests = notifications.filter(n => n.type === 'follow_request');
    
    return followRequests.map(request => ({
      _id: request._id,
      content: request.content,
      sender: request.sender,
      isFollowing: false
    }));
  }
}
import { Types } from 'mongoose';
import { Notification, INotification } from '../../domain/entities/Notification';

export class NotificationRepository {
  async create(notificationData: Partial<INotification>): Promise<INotification> {
    const notification = new Notification(notificationData);
    return await notification.save();
  }

  async findUserNotifications(userId: string, limit: number = 10): Promise<INotification[]> {
    const objectId = new Types.ObjectId(userId);
    return await Notification.find({ recipient: objectId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('sender', 'username profile_picture')
      .populate('postId', 'content')
      .populate('commentId', 'content');
  }

  async markAsRead(notificationId: string): Promise<void> {
    const objectId = new Types.ObjectId(notificationId);
    await Notification.findByIdAndUpdate(objectId, { read: true });
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const objectId = new Types.ObjectId(notificationId);
    await Notification.findByIdAndDelete(objectId);
  }

  async deleteCommentNotification(commentId: string): Promise<void> {
    await Notification.deleteMany({ 
      commentId: new Types.ObjectId(commentId) 
    });
  }

  async deletePostLikeNotification(postId: string, userId: string): Promise<void> {
    await Notification.deleteMany({ 
      postId: new Types.ObjectId(postId),
      sender: new Types.ObjectId(userId),
      type: 'like'
    });
  }
  async deleteFollowNotification(recipientId: Types.ObjectId, senderId: Types.ObjectId): Promise<void> {
    await Notification.deleteMany({ 
      recipient: recipientId,
      sender: senderId,
      type: 'follow_request'
    });
  }
   async countUserNotifications(userId: string): Promise<number> {
        const objectId = new Types.ObjectId(userId);
        return await Notification.countDocuments({ recipient: objectId });
    }

    async findUserNotificationsPaginated(
      userId: string, 
      limit: number = 10, 
      skip: number = 0
    ): Promise<INotification[]> {
      const objectId = new Types.ObjectId(userId);
      return await Notification.find({ recipient: objectId })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate({
          path: 'sender',
          select: 'username profile_picture'
        })
        .populate({
          path: 'postId',
          select: 'mediaUrl postType caption',
          populate: {
            path: 'userId',
            select: 'username'
          }
        })
        .populate({
          path: 'commentId',
          select: 'content',
          populate: {
            path: 'postId',
            select: 'mediaUrl postType caption'
          }
        });
    }
}
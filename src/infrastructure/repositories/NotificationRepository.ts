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
      .populate('sender', 'username profile_picture');
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const objectId = new Types.ObjectId(notificationId);
    await Notification.findByIdAndDelete(objectId);
  }
}
import { Types } from 'mongoose';
import { INotification } from '../../domain/entities/Notification';
export declare class NotificationRepository {
    create(notificationData: Partial<INotification>): Promise<INotification>;
    findUserNotifications(userId: string, limit?: number): Promise<INotification[]>;
    markAsRead(notificationId: string): Promise<void>;
    deleteNotification(notificationId: string): Promise<void>;
    deleteCommentNotification(commentId: string): Promise<void>;
    deletePostLikeNotification(postId: string, userId: string): Promise<void>;
    deleteFollowNotification(recipientId: Types.ObjectId, senderId: Types.ObjectId): Promise<void>;
    countUserNotifications(userId: string): Promise<number>;
    findUserNotificationsPaginated(userId: string, limit?: number, skip?: number): Promise<INotification[]>;
}

import { IMessage } from '../../domain/entities/ChatMessage';
import { INotification } from '../../domain/entities/Notification';
export declare class SocketService {
    static sendNotificationToUser(userId: string, notification: INotification): void;
    static sendNotificationToMultipleUsers(userIds: string[], notification: INotification): void;
    static sendLiveMessage(receiverId: string, message: IMessage): void;
    static notifyMessageDeletion(userId: string, messageId: string): void;
    static getOnlineUsers(): string[];
    static isUserOnline(userId: string): boolean;
}

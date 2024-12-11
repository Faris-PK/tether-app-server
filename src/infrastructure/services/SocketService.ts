import SocketManager from '../../shared/utils/socket';
import { IMessage } from '../../domain/entities/ChatMessage';
import { INotification } from '../../domain/entities/Notification';

export class SocketService {
  static sendNotificationToUser(userId: string, notification: INotification) {
    const socketManager = SocketManager.getInstance();
    socketManager.emitToUser(userId, 'new_notification', notification);
  }

  static sendNotificationToMultipleUsers(userIds: string[], notification: INotification) {
    const socketManager = SocketManager.getInstance();
    userIds.forEach(userId => {
      socketManager.emitToUser(userId, 'new_notification', notification);
    });
  }

  static broadcastNotification(notification: INotification) {
    const socketManager = SocketManager.getInstance();
    socketManager.broadcast('new_notification', notification);
  }

  static sendLiveMessage(receiverId: string, message: IMessage) {
    const socketManager = SocketManager.getInstance();
    socketManager.emitToUser(receiverId, 'new_message', message);
  }
}
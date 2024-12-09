import { io, connectedUsers } from '../../app'; // Import from your server file
import { IMessage } from '../../domain/entities/ChatMessage';
import { INotification } from '../../domain/entities/Notification';

export class SocketService {
  // Send a notification to a specific user
  static sendNotificationToUser(userId: string, notification: INotification) {
    const socketId = connectedUsers.get(userId);
    
    if (socketId) {
      io.to(socketId).emit('new_notification', notification);
    }
  }

  // Send a notification to multiple users
  static sendNotificationToMultipleUsers(userIds: string[], notification: INotification) {
    userIds.forEach(userId => {
      const socketId = connectedUsers.get(userId);
      
      if (socketId) {
        io.to(socketId).emit('new_notification', notification);
      }
    });
  }

  // Broadcast a notification to all connected clients
  static broadcastNotification(notification: INotification) {
    io.emit('new_notification', notification);
  }


}
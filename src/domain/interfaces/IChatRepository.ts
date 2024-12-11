import { IMessage, IConversation } from '../../domain/entities/ChatMessage';

export interface IChatRepository {
  createMessage(
    senderId: string, 
    receiverId: string, 
    messageText: string
  ): Promise<IMessage>;
  getConversationsForUser(userId: string): Promise<IConversation[]>;

  getMessagesBetweenUsers(userId: string, contactId: string): Promise<IMessage[]>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
}

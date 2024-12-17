import { IChat, IMessage } from '../../domain/entities/ChatMessage';
export declare class ChatRepository {
    findOrCreateChat(userId: string, contactId: string): Promise<IChat>;
    getContacts(userId: string): Promise<any[]>;
    getMessages(userId: string, contactId: string): Promise<IMessage[]>;
    sendMessage(senderId: string, receiverId: string, messageText: string): Promise<IMessage>;
    markMessagesAsRead(userId: string, contactId: string): Promise<void>;
    searchUsers(userId: string, query: string): Promise<any[]>;
    startNewChat(userId: string, contactId: string): Promise<IChat>;
}

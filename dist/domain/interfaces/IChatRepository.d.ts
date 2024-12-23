import { IChat, IMessage } from "../entities/ChatMessage";
export interface IChatRepository {
    findOrCreateChat(userId: string, contactId: string): Promise<IChat>;
    getContacts(userId: string): Promise<any[]>;
    getMessages(userId: string, contactId: string): Promise<IMessage[]>;
    sendMessage(senderId: string, receiverId: string, messageText?: string, file?: Express.Multer.File, replyToMessageId?: string): Promise<IMessage>;
    markMessagesAsRead(userId: string, contactId: string): Promise<void>;
    searchUsers(userId: string, query: string): Promise<any[]>;
    getMessageInfo(messageId: string): Promise<any>;
    softDeleteMessage(messageId: string): Promise<void>;
}

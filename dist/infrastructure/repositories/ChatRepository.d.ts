import { Types } from 'mongoose';
import { IChat, IMessage } from '../../domain/entities/ChatMessage';
import { IChatRepository } from '../../domain/interfaces/IChatRepository';
export declare class ChatRepository implements IChatRepository {
    private s3Service;
    constructor();
    findOrCreateChat(userId: string, contactId: string): Promise<IChat>;
    getContacts(userId: string): Promise<any[]>;
    getMessages(userId: string, contactId: string): Promise<IMessage[]>;
    sendMessage(senderId: string, receiverId: string, messageText?: string, file?: Express.Multer.File, replyToMessageId?: string): Promise<IMessage>;
    markMessagesAsRead(userId: string, contactId: string): Promise<void>;
    searchUsers(userId: string, query: string): Promise<any[]>;
    startNewChat(userId: string, contactId: string): Promise<IChat>;
    getMessageInfo(messageId: string): Promise<{
        senderId: Types.ObjectId;
        receiverId: Types.ObjectId;
        fileUrl: string | undefined;
    } | null>;
    softDeleteMessage(messageId: string): Promise<void>;
}

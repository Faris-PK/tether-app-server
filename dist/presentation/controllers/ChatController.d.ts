import { Request, Response } from 'express';
import { IChatRepository } from '../../domain/interfaces/IChatRepository';
export declare class ChatController {
    private getContactsUseCase;
    private getMessagesUseCase;
    private sendMessageUseCase;
    private markMessagesAsReadUseCase;
    private searchUsersUseCase;
    private startNewChatUseCase;
    private deleteMessageUseCase;
    constructor(chatRepository: IChatRepository);
    getContacts(req: Request, res: Response): Promise<void>;
    getMessages(req: Request, res: Response): Promise<void>;
    sendMessage(req: Request, res: Response): Promise<void>;
    markMessagesAsRead(req: Request, res: Response): Promise<void>;
    searchUsers(req: Request, res: Response): Promise<void>;
    startNewChat(req: Request, res: Response): Promise<void>;
    deleteMessage(req: Request, res: Response): Promise<void>;
}

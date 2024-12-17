import { Request, Response } from 'express';
import { ChatRepository } from '../../infrastructure/repositories/ChatRepository';
export declare class ChatController {
    private chatRepository;
    constructor(chatRepository: ChatRepository);
    getContacts(req: Request, res: Response): Promise<void>;
    getMessages(req: Request, res: Response): Promise<void>;
    sendMessage(req: Request, res: Response): Promise<void>;
    markMessagesAsRead(req: Request, res: Response): Promise<void>;
    searchUsers(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    startNewChat(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}

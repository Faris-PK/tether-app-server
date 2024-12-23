import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class SendMessageUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(senderId: string, contactId: string, message?: string, file?: Express.Multer.File, replyToMessageId?: string): Promise<import("../../../domain/entities/ChatMessage").IMessage>;
}

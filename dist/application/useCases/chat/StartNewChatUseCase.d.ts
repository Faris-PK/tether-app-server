import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class StartNewChatUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string, contactId: string): Promise<import("../../../domain/entities/ChatMessage").IChat>;
}

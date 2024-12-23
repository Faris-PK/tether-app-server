import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class GetMessagesUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string, contactId: string): Promise<import("../../../domain/entities/ChatMessage").IMessage[]>;
}

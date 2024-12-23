import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class MarkMessagesAsReadUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string, contactId: string): Promise<void>;
}

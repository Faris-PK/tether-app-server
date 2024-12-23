import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class DeleteMessageUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string, messageId: string): Promise<any>;
}

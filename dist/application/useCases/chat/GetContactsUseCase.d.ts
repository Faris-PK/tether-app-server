import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class GetContactsUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string): Promise<any[]>;
}

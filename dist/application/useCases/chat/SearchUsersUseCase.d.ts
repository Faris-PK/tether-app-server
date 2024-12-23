import { IChatRepository } from "../../../domain/interfaces/IChatRepository";
export declare class SearchUsersUseCase {
    private chatRepository;
    constructor(chatRepository: IChatRepository);
    execute(userId: string, query: string): Promise<any[]>;
}

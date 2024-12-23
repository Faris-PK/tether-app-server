import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class SearchUsersUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string, query: string) {
      if (!query?.trim()) {
        throw new Error('Query parameter is required');
      }
      return await this.chatRepository.searchUsers(userId, query);
    }
  }
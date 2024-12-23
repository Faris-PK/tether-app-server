import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class StartNewChatUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string, contactId: string) {
      if (!contactId) {
        throw new Error('Contact ID is required');
      }
      return await this.chatRepository.findOrCreateChat(userId, contactId);
    }
  }
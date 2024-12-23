import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class GetMessagesUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string, contactId: string) {
      return await this.chatRepository.getMessages(userId, contactId);
    }
  }
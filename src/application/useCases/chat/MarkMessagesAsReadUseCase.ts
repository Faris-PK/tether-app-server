import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class MarkMessagesAsReadUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string, contactId: string) {
      await this.chatRepository.markMessagesAsRead(userId, contactId);
    }
  }
import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class GetContactsUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string) {
      return await this.chatRepository.getContacts(userId);
    }
  }
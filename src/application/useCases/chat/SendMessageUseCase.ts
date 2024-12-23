import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class SendMessageUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(
      senderId: string, 
      contactId: string, 
      message?: string, 
      file?: Express.Multer.File,
      replyToMessageId?: string
    ) {
      if (!message && !file) {
        throw new Error('Either message text or file is required');
      }
      return await this.chatRepository.sendMessage(
        senderId, 
        contactId, 
        message, 
        file,
        replyToMessageId
      );
    }
  }
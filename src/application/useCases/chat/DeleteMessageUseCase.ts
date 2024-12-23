import { IChatRepository } from "../../../domain/interfaces/IChatRepository";

export class DeleteMessageUseCase {
    constructor(private chatRepository: IChatRepository) {}
  
    async execute(userId: string, messageId: string) {
      const messageInfo = await this.chatRepository.getMessageInfo(messageId);
      
      if (!messageInfo) {
        throw new Error('Message not found');
      }
  
      if (messageInfo.senderId.toString() !== userId) {
        throw new Error('Unauthorized to delete this message');
      }
  
      await this.chatRepository.softDeleteMessage(messageId);
      return messageInfo;
    }
  }
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteMessageUseCase = void 0;
class DeleteMessageUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId, messageId) {
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
exports.DeleteMessageUseCase = DeleteMessageUseCase;
//# sourceMappingURL=DeleteMessageUseCase.js.map
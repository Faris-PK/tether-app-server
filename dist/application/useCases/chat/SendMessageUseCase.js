"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendMessageUseCase = void 0;
class SendMessageUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(senderId, contactId, message, file, replyToMessageId) {
        if (!message && !file) {
            throw new Error('Either message text or file is required');
        }
        return await this.chatRepository.sendMessage(senderId, contactId, message, file, replyToMessageId);
    }
}
exports.SendMessageUseCase = SendMessageUseCase;
//# sourceMappingURL=SendMessageUseCase.js.map
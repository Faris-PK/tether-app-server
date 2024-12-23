"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarkMessagesAsReadUseCase = void 0;
class MarkMessagesAsReadUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId, contactId) {
        await this.chatRepository.markMessagesAsRead(userId, contactId);
    }
}
exports.MarkMessagesAsReadUseCase = MarkMessagesAsReadUseCase;
//# sourceMappingURL=MarkMessagesAsReadUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartNewChatUseCase = void 0;
class StartNewChatUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId, contactId) {
        if (!contactId) {
            throw new Error('Contact ID is required');
        }
        return await this.chatRepository.findOrCreateChat(userId, contactId);
    }
}
exports.StartNewChatUseCase = StartNewChatUseCase;
//# sourceMappingURL=StartNewChatUseCase.js.map
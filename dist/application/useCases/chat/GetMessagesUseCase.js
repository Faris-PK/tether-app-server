"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetMessagesUseCase = void 0;
class GetMessagesUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId, contactId) {
        return await this.chatRepository.getMessages(userId, contactId);
    }
}
exports.GetMessagesUseCase = GetMessagesUseCase;
//# sourceMappingURL=GetMessagesUseCase.js.map
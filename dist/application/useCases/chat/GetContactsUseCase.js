"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetContactsUseCase = void 0;
class GetContactsUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId) {
        return await this.chatRepository.getContacts(userId);
    }
}
exports.GetContactsUseCase = GetContactsUseCase;
//# sourceMappingURL=GetContactsUseCase.js.map
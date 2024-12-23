"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchUsersUseCase = void 0;
class SearchUsersUseCase {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async execute(userId, query) {
        if (!(query === null || query === void 0 ? void 0 : query.trim())) {
            throw new Error('Query parameter is required');
        }
        return await this.chatRepository.searchUsers(userId, query);
    }
}
exports.SearchUsersUseCase = SearchUsersUseCase;
//# sourceMappingURL=SearchUsersUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowersUseCase = void 0;
class GetFollowersUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        return await this.userRepository.getFollowers(userId);
    }
}
exports.GetFollowersUseCase = GetFollowersUseCase;
//# sourceMappingURL=GetFollowersUseCase.js.map
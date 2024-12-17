"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowingUseCase = void 0;
class GetFollowingUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        return await this.userRepository.getFollowing(userId);
    }
}
exports.GetFollowingUseCase = GetFollowingUseCase;
//# sourceMappingURL=GetFollowingUseCase.js.map
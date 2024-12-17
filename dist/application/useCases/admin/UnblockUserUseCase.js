"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnblockUserUseCase = void 0;
class UnblockUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.isBlocked = false;
        await this.userRepository.save(user);
    }
}
exports.UnblockUserUseCase = UnblockUserUseCase;
//# sourceMappingURL=UnblockUserUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlockUserUseCase = void 0;
class BlockUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        user.isBlocked = true;
        await this.userRepository.save(user);
    }
}
exports.BlockUserUseCase = BlockUserUseCase;
//# sourceMappingURL=BlockUserUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUserProfileUseCase = void 0;
class UpdateUserProfileUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, updateData) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Update user fields
        const updatedUSer = Object.assign(user, updateData);
        //  console.log('updatedUSer : ', updatedUSer);
        await this.userRepository.save(user);
        return user;
    }
}
exports.UpdateUserProfileUseCase = UpdateUserProfileUseCase;
//# sourceMappingURL=UpdateUserProfileUseCase.js.map
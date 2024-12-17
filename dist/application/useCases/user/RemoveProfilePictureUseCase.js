"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveProfilePictureUseCase = void 0;
class RemoveProfilePictureUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, type) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const defaultImage = type === 'profile'
            ? 'https://www.trendycovers.com/default_propic.jpg'
            : 'https://notepd.s3.amazonaws.com/default-cover.png';
        if (type === 'profile') {
            user.profile_picture = defaultImage;
        }
        else {
            user.cover_photo = defaultImage;
        }
        await this.userRepository.save(user);
        return user;
    }
}
exports.RemoveProfilePictureUseCase = RemoveProfilePictureUseCase;
//# sourceMappingURL=RemoveProfilePictureUseCase.js.map
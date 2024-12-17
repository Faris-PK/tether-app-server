"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetOtherUserProfileUseCase = void 0;
const mongoose_1 = require("mongoose");
class GetOtherUserProfileUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(userId, currentUserId) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Check if the user is blocked
        if (user.isBlocked) {
            throw new Error('This user profile is not available');
        }
        const currentUserObjectId = new mongoose_1.Types.ObjectId(currentUserId);
        // Check if the current user is blocked by the requested user
        const isBlocked = user.blocked_users.some(blockedId => blockedId.equals(currentUserObjectId));
        if (isBlocked) {
            throw new Error('You cannot view this profile');
        }
        // Return only the necessary public information
        return {
            _id: user._id,
            username: user.username,
            bio: user.bio,
            profile_picture: user.profile_picture,
            cover_photo: user.cover_photo,
            userLocation: user.userLocation,
            followers: user.followers,
            following: user.following,
            posts: user.posts,
            social_links: user.social_links,
            createdAt: user.createdAt
        };
    }
}
exports.GetOtherUserProfileUseCase = GetOtherUserProfileUseCase;
//# sourceMappingURL=GetOtherUserProfileUseCase.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnfollowUserUseCase = void 0;
const mongoose_1 = require("mongoose");
class UnfollowUserUseCase {
    constructor(userRepository, notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }
    async execute(followerId, targetUserId) {
        const [follower, targetUser] = await Promise.all([
            this.userRepository.findById(followerId),
            this.userRepository.findById(targetUserId)
        ]);
        if (!follower || !targetUser) {
            throw new Error('User not found');
        }
        const targetObjectId = new mongoose_1.Types.ObjectId(targetUserId);
        const followerObjectId = new mongoose_1.Types.ObjectId(followerId);
        // Remove the follow relationship
        follower.following = follower.following.filter(id => !id.equals(targetObjectId));
        targetUser.followers = targetUser.followers.filter(id => !id.equals(followerObjectId));
        // Find and delete the follow notification
        await this.notificationRepository.deleteFollowNotification(targetObjectId, followerObjectId);
        // Save the updated user documents
        await Promise.all([
            this.userRepository.save(follower),
            this.userRepository.save(targetUser)
        ]);
        return { success: true };
    }
}
exports.UnfollowUserUseCase = UnfollowUserUseCase;
//# sourceMappingURL=UnfollowUserUseCase.js.map
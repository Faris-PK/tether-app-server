"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FollowUserUseCase = void 0;
const mongoose_1 = require("mongoose");
const SocketService_1 = require("../../../infrastructure/services/SocketService"); // Import SocketService
class FollowUserUseCase {
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
        if (!follower.following.some(id => id.equals(targetObjectId))) {
            follower.following.push(targetObjectId);
            targetUser.followers.push(followerObjectId);
            // Create follow notification
            const followNotification = await this.notificationRepository.create({
                recipient: targetObjectId,
                sender: followerObjectId,
                type: 'follow_request',
                content: `${follower.username} started following you`
            });
            // Send socket notification for follow
            SocketService_1.SocketService.sendNotificationToUser(targetUserId.toString(), followNotification);
            await Promise.all([
                this.userRepository.save(follower),
                this.userRepository.save(targetUser)
            ]);
        }
        return { success: true };
    }
}
exports.FollowUserUseCase = FollowUserUseCase;
//# sourceMappingURL=FollowUserUseCase.js.map
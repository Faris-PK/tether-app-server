"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LikePostNotificationUseCase = void 0;
const mongoose_1 = require("mongoose");
const SocketService_1 = require("../../../infrastructure/services/SocketService");
class LikePostNotificationUseCase {
    constructor(postRepository, notificationRepository, userRepository) {
        this.postRepository = postRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    async execute(postId, userId) {
        const isLiked = await this.postRepository.isLikedByUser(postId, userId);
        const updatedPost = isLiked
            ? await this.postRepository.unlikePost(postId, userId)
            : await this.postRepository.likePost(postId, userId);
        if (!updatedPost) {
            throw new Error('Failed to update post like status');
        }
        // Notification logic
        const postOwner = updatedPost.userId.toString();
        if (postOwner !== userId) {
            if (isLiked) {
                // Post was just unliked, so remove the like notification
                await this.notificationRepository.deletePostLikeNotification(postId, userId);
            }
            else {
                // Post was just liked, so create a like notification
                const currentUser = await this.userRepository.findById(userId);
                const notification = await this.notificationRepository.create({
                    recipient: new mongoose_1.Types.ObjectId(postOwner),
                    sender: new mongoose_1.Types.ObjectId(userId),
                    type: 'like',
                    postId: new mongoose_1.Types.ObjectId(postId),
                    content: `${currentUser === null || currentUser === void 0 ? void 0 : currentUser.username} liked your post`
                });
                SocketService_1.SocketService.sendNotificationToUser(postOwner, notification);
            }
        }
        return updatedPost;
    }
}
exports.LikePostNotificationUseCase = LikePostNotificationUseCase;
//# sourceMappingURL=LikePostNotificationUseCase.js.map
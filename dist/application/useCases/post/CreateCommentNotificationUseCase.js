"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCommentNotificationUseCase = void 0;
const mongoose_1 = require("mongoose");
const SocketService_1 = require("../../../infrastructure/services/SocketService");
class CreateCommentNotificationUseCase {
    constructor(commentRepository, postRepository, notificationRepository, userRepository) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }
    async execute(postId, userId, content, parentCommentId) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new Error('Post not found');
        }
        let parentComment;
        if (parentCommentId) {
            parentComment = await this.commentRepository.findById(parentCommentId);
            if (!parentComment) {
                throw new Error('Parent comment not found');
            }
        }
        const comment = await this.commentRepository.create({
            postId: new mongoose_1.Types.ObjectId(postId),
            userId: new mongoose_1.Types.ObjectId(userId),
            content,
            parentCommentId: parentCommentId
                ? new mongoose_1.Types.ObjectId(parentCommentId)
                : undefined
        });
        const currentUser = await this.userRepository.findById(userId);
        // Only create notification if the comment is not on the user's own post
        if (post.userId.toString() !== userId) {
            const postNotification = await this.notificationRepository.create({
                recipient: post.userId,
                sender: new mongoose_1.Types.ObjectId(userId),
                type: 'comment',
                postId: new mongoose_1.Types.ObjectId(postId),
                commentId: comment._id,
                content: `${currentUser === null || currentUser === void 0 ? void 0 : currentUser.username} commented on your post`
            });
            // Send socket notification for post comment
            SocketService_1.SocketService.sendNotificationToUser(post.userId._id.toString(), postNotification);
        }
        // Only create notification for reply if it's not a reply to the user's own comment
        if (parentCommentId && parentComment && parentComment.userId.toString() !== userId) {
            const replyNotification = await this.notificationRepository.create({
                recipient: parentComment.userId,
                sender: new mongoose_1.Types.ObjectId(userId),
                type: 'reply_comment',
                postId: new mongoose_1.Types.ObjectId(postId),
                commentId: comment._id,
                content: `${currentUser === null || currentUser === void 0 ? void 0 : currentUser.username} replied to your comment`
            });
            // Send socket notification for comment reply
            SocketService_1.SocketService.sendNotificationToUser(parentComment.userId._id.toString(), replyNotification);
        }
        return comment;
    }
}
exports.CreateCommentNotificationUseCase = CreateCommentNotificationUseCase;
//# sourceMappingURL=CreateCommentNotificationUseCase.js.map
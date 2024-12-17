"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const mongoose_1 = require("mongoose");
const Notification_1 = require("../../domain/entities/Notification");
class NotificationRepository {
    async create(notificationData) {
        const notification = new Notification_1.Notification(notificationData);
        return await notification.save();
    }
    async findUserNotifications(userId, limit = 10) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        return await Notification_1.Notification.find({ recipient: objectId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .populate('sender', 'username profile_picture')
            .populate('postId', 'content')
            .populate('commentId', 'content');
    }
    async markAsRead(notificationId) {
        const objectId = new mongoose_1.Types.ObjectId(notificationId);
        await Notification_1.Notification.findByIdAndUpdate(objectId, { read: true });
    }
    async deleteNotification(notificationId) {
        const objectId = new mongoose_1.Types.ObjectId(notificationId);
        await Notification_1.Notification.findByIdAndDelete(objectId);
    }
    async deleteCommentNotification(commentId) {
        await Notification_1.Notification.deleteMany({
            commentId: new mongoose_1.Types.ObjectId(commentId)
        });
    }
    async deletePostLikeNotification(postId, userId) {
        await Notification_1.Notification.deleteMany({
            postId: new mongoose_1.Types.ObjectId(postId),
            sender: new mongoose_1.Types.ObjectId(userId),
            type: 'like'
        });
    }
    async deleteFollowNotification(recipientId, senderId) {
        await Notification_1.Notification.deleteMany({
            recipient: recipientId,
            sender: senderId,
            type: 'follow_request'
        });
    }
    async countUserNotifications(userId) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        return await Notification_1.Notification.countDocuments({ recipient: objectId });
    }
    async findUserNotificationsPaginated(userId, limit = 10, skip = 0) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        return await Notification_1.Notification.find({ recipient: objectId })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .populate({
            path: 'sender',
            select: 'username profile_picture'
        })
            .populate({
            path: 'postId',
            select: 'mediaUrl postType caption',
            populate: {
                path: 'userId',
                select: 'username'
            }
        })
            .populate({
            path: 'commentId',
            select: 'content',
            populate: {
                path: 'postId',
                select: 'mediaUrl postType caption'
            }
        });
    }
}
exports.NotificationRepository = NotificationRepository;
//# sourceMappingURL=NotificationRepository.js.map
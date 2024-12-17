"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserNotificationsUseCase = void 0;
const mongoose_1 = require("mongoose");
class GetUserNotificationsUseCase {
    constructor(notificationRepository) {
        this.notificationRepository = notificationRepository;
    }
    async execute(userId, page = 1, limit = 10) {
        const objectId = new mongoose_1.Types.ObjectId(userId);
        const skip = (page - 1) * limit;
        // Get total count of notifications
        const totalNotifications = await this.notificationRepository.countUserNotifications(userId);
        const totalPages = Math.ceil(totalNotifications / limit);
        // Fetch paginated notifications
        const notifications = await this.notificationRepository.findUserNotificationsPaginated(userId, limit, skip);
        return {
            notifications,
            totalPages,
            totalNotifications
        };
    }
}
exports.GetUserNotificationsUseCase = GetUserNotificationsUseCase;
//# sourceMappingURL=GetUserNotificationsUseCase.js.map
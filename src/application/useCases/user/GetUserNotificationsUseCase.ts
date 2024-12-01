import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
import { Types } from 'mongoose';

export class GetUserNotificationsUseCase {
    constructor(
        private notificationRepository: NotificationRepository
    ) {}

    async execute(userId: string, page: number = 1, limit: number = 10) {
        const objectId = new Types.ObjectId(userId);
        const skip = (page - 1) * limit;

        // Get total count of notifications
        const totalNotifications = await this.notificationRepository.countUserNotifications(userId);
        const totalPages = Math.ceil(totalNotifications / limit);

        // Fetch paginated notifications
        const notifications = await this.notificationRepository.findUserNotificationsPaginated(
            userId, 
            limit, 
            skip
        );

        return {
            notifications,
            totalPages,
            totalNotifications
        };
    }
}
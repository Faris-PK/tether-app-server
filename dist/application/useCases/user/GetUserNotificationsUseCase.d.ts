import { NotificationRepository } from '../../../infrastructure/repositories/NotificationRepository';
export declare class GetUserNotificationsUseCase {
    private notificationRepository;
    constructor(notificationRepository: NotificationRepository);
    execute(userId: string, page?: number, limit?: number): Promise<{
        notifications: import("../../../domain/entities/Notification").INotification[];
        totalPages: number;
        totalNotifications: number;
    }>;
}

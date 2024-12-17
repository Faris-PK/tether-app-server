"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFollowRequestsUseCase = void 0;
class GetFollowRequestsUseCase {
    constructor(userRepository, notificationRepository) {
        this.userRepository = userRepository;
        this.notificationRepository = notificationRepository;
    }
    async execute(userId) {
        const notifications = await this.notificationRepository.findUserNotifications(userId);
        const followRequests = notifications.filter(n => n.type === 'follow_request');
        return followRequests.map(request => ({
            _id: request._id,
            content: request.content,
            sender: request.sender,
            isFollowing: false
        }));
    }
}
exports.GetFollowRequestsUseCase = GetFollowRequestsUseCase;
//# sourceMappingURL=GetFollowRequestsUseCase.js.map
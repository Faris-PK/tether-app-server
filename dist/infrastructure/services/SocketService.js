"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const socket_1 = __importDefault(require("../../shared/utils/socket"));
class SocketService {
    static sendNotificationToUser(userId, notification) {
        const socketManager = socket_1.default.getInstance();
        socketManager.emitToUser(userId, 'new_notification', notification);
    }
    static sendNotificationToMultipleUsers(userIds, notification) {
        const socketManager = socket_1.default.getInstance();
        userIds.forEach(userId => {
            socketManager.emitToUser(userId, 'new_notification', notification);
        });
    }
    static broadcastNotification(notification) {
        const socketManager = socket_1.default.getInstance();
        socketManager.broadcast('new_notification', notification);
    }
    static sendLiveMessage(receiverId, message) {
        const socketManager = socket_1.default.getInstance();
        socketManager.emitToUser(receiverId, 'new_message', message);
    }
}
exports.SocketService = SocketService;
//# sourceMappingURL=SocketService.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketManager {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map();
        this.rooms = new Map();
        this.lastActivityTimestamp = new Map();
    }
    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.setupSocketEvents();
        this.startUserActivityCheck();
        return this.io;
    }
    startUserActivityCheck() {
        setInterval(() => {
            const currentTime = Date.now();
            const inactivityThreshold = 5 * 60 * 1000; // 5 minutes
            this.connectedUsers.forEach((socketId, userId) => {
                const lastActivity = this.lastActivityTimestamp.get(userId);
                if (lastActivity && currentTime - lastActivity > inactivityThreshold) {
                    this.removeUser(userId);
                }
            });
        }, 60 * 1000);
    }
    removeUser(userId) {
        if (this.connectedUsers.has(userId)) {
            const socketId = this.connectedUsers.get(userId);
            this.connectedUsers.delete(userId);
            this.lastActivityTimestamp.delete(userId);
            this.broadcastUserStatus(userId, false);
            // Clean up user from all rooms
            this.rooms.forEach((users, roomId) => {
                if (users.includes(userId)) {
                    this.rooms.set(roomId, users.filter(id => id !== userId));
                }
            });
        }
    }
    setupSocketEvents() {
        if (!this.io)
            return;
        this.io.on('connection', (socket) => {
            const userId = socket.handshake.query.userId;
            if (!userId)
                return;
            // Store user's socket connection
            this.connectedUsers.set(userId, socket.id);
            this.lastActivityTimestamp.set(userId, Date.now());
            this.broadcastUserStatus(userId, true);
            // Emit current online users to the newly connected client
            socket.emit('getOnlineUsers', Array.from(this.connectedUsers.keys()));
            // User activity tracking
            socket.on('user_activity', () => {
                this.lastActivityTimestamp.set(userId, Date.now());
            });
            // Video Call Events
            this.setupVideoCallEvents(socket, userId);
            // Handle disconnection
            socket.on('disconnect', () => {
                this.removeUser(userId);
            });
        });
    }
    setupVideoCallEvents(socket, userId) {
        socket.on('join_video_room', (roomId) => {
            socket.join(roomId);
            const roomUsers = this.rooms.get(roomId) || [];
            if (!roomUsers.includes(userId)) {
                roomUsers.push(userId);
                this.rooms.set(roomId, roomUsers);
            }
            const otherUsers = roomUsers.filter(user => user !== userId);
            socket.emit('other_users_in_room', otherUsers);
            otherUsers.forEach(otherUser => {
                const otherSocketId = this.getSocketId(otherUser);
                if (otherSocketId) {
                    socket.to(otherSocketId).emit('new_user_joined', userId);
                }
            });
        });
        socket.on('initiate_video_call', (payload) => {
            var _a;
            const targetSocketId = this.getSocketId(payload.target);
            if (targetSocketId) {
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(targetSocketId).emit('incoming_video_call', {
                    roomId: payload.roomId,
                    caller: payload.caller
                });
            }
        });
        socket.on('end_call', (payload) => {
            var _a;
            (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(payload.roomId).emit('call_ended');
            const roomUsers = this.rooms.get(payload.roomId) || [];
            roomUsers.forEach(user => {
                var _a, _b;
                const userSocketId = this.getSocketId(user);
                if (userSocketId) {
                    (_b = (_a = this.io) === null || _a === void 0 ? void 0 : _a.sockets.sockets.get(userSocketId)) === null || _b === void 0 ? void 0 : _b.leave(payload.roomId);
                }
            });
            this.rooms.delete(payload.roomId);
        });
        socket.on('decline_video_call', (payload) => {
            var _a;
            (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(payload.roomId).emit('video_call_declined');
            this.rooms.delete(payload.roomId);
        });
        // WebRTC Signaling
        ['offer', 'answer', 'ice-candidate'].forEach(event => {
            socket.on(event, (payload) => {
                var _a;
                const targetSocketId = this.getSocketId(payload.target);
                if (targetSocketId) {
                    (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(targetSocketId).emit(event, payload);
                }
            });
        });
    }
    broadcastUserStatus(userId, isOnline) {
        if (this.io) {
            this.io.emit('user_status_change', { userId, isOnline });
        }
    }
    getSocketId(userId) {
        return this.connectedUsers.get(userId);
    }
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
    emitToUser(userId, event, data) {
        const socketId = this.getSocketId(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(event, data);
        }
    }
    broadcast(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
    getOnlineUsers() {
        return Array.from(this.connectedUsers.keys());
    }
}
exports.default = SocketManager;
//# sourceMappingURL=socket.js.map
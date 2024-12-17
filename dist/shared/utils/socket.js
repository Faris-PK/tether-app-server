"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
class SocketManager {
    constructor() {
        this.io = null;
        this.connectedUsers = new Map();
        this.rooms = new Map();
    }
    // Singleton pattern
    static getInstance() {
        if (!SocketManager.instance) {
            SocketManager.instance = new SocketManager();
        }
        return SocketManager.instance;
    }
    // Initialize socket server
    initialize(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: process.env.FRONTEND_URL,
                methods: ["GET", "POST"],
                credentials: true,
            },
        });
        this.setupSocketEvents();
        return this.io;
    }
    // Set up socket connection events
    setupSocketEvents() {
        if (!this.io)
            return;
        this.io.on('connection', (socket) => {
            const userId = socket.handshake.query.userId;
            if (userId) {
                // Store user's socket connection
                this.connectedUsers.set(userId, socket.id);
                // Broadcast user online status
                this.broadcastUserStatus(userId, true);
                // Video Call Signaling Events
                this.setupVideoCallEvents(socket, userId);
                // Handle disconnection
                socket.on('disconnect', () => {
                    this.connectedUsers.delete(userId);
                    this.broadcastUserStatus(userId, false);
                });
            }
        });
    }
    setupVideoCallEvents(socket, userId) {
        // Join Video Call Room
        socket.on('join_video_room', (roomId) => {
            socket.join(roomId);
            const roomUsers = this.rooms.get(roomId) || [];
            if (!roomUsers.includes(userId)) {
                roomUsers.push(userId);
                this.rooms.set(roomId, roomUsers);
            }
            const otherUsers = roomUsers.filter(user => user !== userId);
            if (otherUsers.length > 0) {
                socket.emit('other_users_in_room', otherUsers);
                otherUsers.forEach(otherUser => {
                    const otherSocketId = this.getSocketId(otherUser);
                    if (otherSocketId) {
                        socket.to(otherSocketId).emit('new_user_joined', userId);
                    }
                });
            }
        });
        // Initiate Video Call
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
        // Decline Video Call
        socket.on('decline_video_call', (payload) => {
            var _a;
            // Broadcast decline to all participants in the room
            (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(payload.roomId).emit('video_call_declined', payload);
        });
        // WebRTC Signaling Events
        socket.on('offer', (payload) => {
            var _a;
            const targetSocketId = this.getSocketId(payload.target);
            if (targetSocketId) {
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(targetSocketId).emit('offer', payload);
            }
        });
        socket.on('answer', (payload) => {
            var _a;
            const targetSocketId = this.getSocketId(payload.target);
            if (targetSocketId) {
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(targetSocketId).emit('answer', payload);
            }
        });
        socket.on('ice-candidate', (payload) => {
            var _a;
            const targetSocketId = this.getSocketId(payload.target);
            if (targetSocketId) {
                (_a = this.io) === null || _a === void 0 ? void 0 : _a.to(targetSocketId).emit('ice-candidate', payload);
            }
        });
    }
    // Broadcast user online/offline status
    broadcastUserStatus(userId, isOnline) {
        if (this.io) {
            this.io.emit('user_status_change', { userId, isOnline });
        }
    }
    // Get socket ID for a specific user
    getSocketId(userId) {
        return this.connectedUsers.get(userId);
    }
    // Check if user is online
    isUserOnline(userId) {
        return this.connectedUsers.has(userId);
    }
    // Send event to a specific user
    emitToUser(userId, event, data) {
        const socketId = this.getSocketId(userId);
        if (socketId && this.io) {
            this.io.to(socketId).emit(event, data);
        }
    }
    // Broadcast event to all connected users
    broadcast(event, data) {
        if (this.io) {
            this.io.emit(event, data);
        }
    }
}
exports.default = SocketManager;
//# sourceMappingURL=socket.js.map
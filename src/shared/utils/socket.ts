import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

interface VideoCallPayload {
  target: string;
  caller?: string;
  sdp?: any;
  candidate?: any;
}

class SocketManager {
  private static instance: SocketManager;
  public io: Server | null = null;
  private connectedUsers: Map<string, string> = new Map();
  private rooms: Map<string, string[]> = new Map();
  private lastActivityTimestamp: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  initialize(server: HttpServer): Server {
    this.io = new Server(server, {
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

  private startUserActivityCheck() {
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

  private removeUser(userId: string) {
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

  private setupSocketEvents() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;
      if (!userId) return;

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

  private setupVideoCallEvents(socket: Socket, userId: string) {
    socket.on('join_video_room', (roomId: string) => {
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

    socket.on('initiate_video_call', (payload: { target: string, roomId: string, caller: string }) => {
      const targetSocketId = this.getSocketId(payload.target);
      if (targetSocketId) {
        this.io?.to(targetSocketId).emit('incoming_video_call', {
          roomId: payload.roomId,
          caller: payload.caller
        });
      }
    });

    socket.on('end_call', (payload: { roomId: string }) => {
      this.io?.to(payload.roomId).emit('call_ended');
      const roomUsers = this.rooms.get(payload.roomId) || [];
      roomUsers.forEach(user => {
        const userSocketId = this.getSocketId(user);
        if (userSocketId) {
          this.io?.sockets.sockets.get(userSocketId)?.leave(payload.roomId);
        }
      });
      this.rooms.delete(payload.roomId);
    });

    socket.on('decline_video_call', (payload: { roomId: string }) => {
      this.io?.to(payload.roomId).emit('video_call_declined');
      this.rooms.delete(payload.roomId);
    });

    // WebRTC Signaling
    ['offer', 'answer', 'ice-candidate'].forEach(event => {
      socket.on(event, (payload: VideoCallPayload) => {
        const targetSocketId = this.getSocketId(payload.target);
        if (targetSocketId) {
          this.io?.to(targetSocketId).emit(event, payload);
        }
      });
    });
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    if (this.io) {
      this.io.emit('user_status_change', { userId, isOnline });
    }
  }

  getSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }

  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.getSocketId(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }

  broadcast(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default SocketManager;
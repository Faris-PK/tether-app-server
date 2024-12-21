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

  // Singleton pattern
  static getInstance(): SocketManager {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager();
    }
    return SocketManager.instance;
  }

  // Initialize socket server
  initialize(server: HttpServer): Server {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ["GET", "POST"],
        credentials: true,
      },
    });

    this.setupSocketEvents();

    // Periodic cleanup of inactive users
    this.startUserActivityCheck();

    return this.io;
  }

  // Periodic check to remove inactive users
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
    }, 60 * 1000); // Check every minute
  }

  // Remove user from connected users
  private removeUser(userId: string) {
    if (this.connectedUsers.has(userId)) {
      this.connectedUsers.delete(userId);
      this.lastActivityTimestamp.delete(userId);
      this.broadcastUserStatus(userId, false);
    }
  }

  // Set up socket connection events
  private setupSocketEvents() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;

      if (userId) {
        // Store user's socket connection
        this.connectedUsers.set(userId, socket.id);
        this.lastActivityTimestamp.set(userId, Date.now());

        // Broadcast user online status
        this.broadcastUserStatus(userId, true);

        // User activity tracking
        socket.on('user_activity', () => {
          this.lastActivityTimestamp.set(userId, Date.now());
        });

        // Video Call Signaling Events
        this.setupVideoCallEvents(socket, userId);

        // Handle disconnection
        socket.on('disconnect', () => {
          this.removeUser(userId);
        });

        // Emit current online users to the newly connected client
        socket.emit('getOnlineUsers', Array.from(this.connectedUsers.keys()));
      }
    });
  }

  private setupVideoCallEvents(socket: Socket, userId: string) {
    // Join Video Call Room
    socket.on('join_video_room', (roomId: string) => {
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
    socket.on('initiate_video_call', (payload: { 
      target: string, 
      roomId: string, 
      caller: string 
    }) => {
      const targetSocketId = this.getSocketId(payload.target);
      if (targetSocketId) {
        this.io?.to(targetSocketId).emit('incoming_video_call', {
          roomId: payload.roomId,
          caller: payload.caller
        });
      }
    });

    // Handle call ending
    socket.on('end_call', (payload: { roomId: string }) => {
      // Notify all users in the room that the call has ended
      this.io?.to(payload.roomId).emit('call_ended');

      // Get room users
      const roomUsers = this.rooms.get(payload.roomId) || [];

      // Remove all users from the room
      roomUsers.forEach(user => {
        const userSocketId = this.getSocketId(user);
        if (userSocketId) {
          this.io?.sockets.sockets.get(userSocketId)?.leave(payload.roomId);
        }
      });

      // Clear the room
      this.rooms.delete(payload.roomId);
    });

    // Handle call declining
    socket.on('decline_video_call', (payload: { roomId: string }) => {
      // Notify all users in the room that the call was declined
      this.io?.to(payload.roomId).emit('video_call_declined');

      // Clean up room similar to end_call
      const roomUsers = this.rooms.get(payload.roomId) || [];
      roomUsers.forEach(user => {
        const userSocketId = this.getSocketId(user);
        if (userSocketId) {
          this.io?.sockets.sockets.get(userSocketId)?.leave(payload.roomId);
        }
      });

      this.rooms.delete(payload.roomId);
    });

    // WebRTC Signaling Events
    socket.on('offer', (payload: VideoCallPayload) => {
      const targetSocketId = this.getSocketId(payload.target);
      if (targetSocketId) {
        this.io?.to(targetSocketId).emit('offer', payload);
      }
    });

    socket.on('answer', (payload: VideoCallPayload) => {
      const targetSocketId = this.getSocketId(payload.target);
      if (targetSocketId) {
        this.io?.to(targetSocketId).emit('answer', payload);
      }
    });

    socket.on('ice-candidate', (payload: VideoCallPayload) => {
      const targetSocketId = this.getSocketId(payload.target);
      if (targetSocketId) {
        this.io?.to(targetSocketId).emit('ice-candidate', payload);
      }
    });
  }

  // Broadcast user online/offline status
  private broadcastUserStatus(userId: string, isOnline: boolean) {
    if (this.io) {
      this.io.emit('user_status_change', { userId, isOnline });
    }
  }

  // Get socket ID for a specific user
  getSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId);
  }

  // Check if user is online
  isUserOnline(userId: string): boolean {
    return this.connectedUsers.has(userId);
  }

  // Send event to a specific user
  emitToUser(userId: string, event: string, data: any) {
    const socketId = this.getSocketId(userId);
    if (socketId && this.io) {
      this.io.to(socketId).emit(event, data);
    }
  }

  // Broadcast event to all connected users
  broadcast(event: string, data: any) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Get all online users
  getOnlineUsers(): string[] {
    return Array.from(this.connectedUsers.keys());
  }
}

export default SocketManager;

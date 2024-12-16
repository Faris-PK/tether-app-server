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
    return this.io;
  }

  // Set up socket connection events
  private setupSocketEvents() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.handshake.query.userId as string;

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

  // Decline Video Call
  socket.on('decline_video_call', (payload: { roomId: string }) => {
    // Broadcast decline to all participants in the room
    this.io?.to(payload.roomId).emit('video_call_declined', payload);
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
}

export default SocketManager;

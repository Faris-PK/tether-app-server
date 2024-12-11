// SocketManager.ts
import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';

class SocketManager {
  private static instance: SocketManager;
  public io: Server | null = null;
  private connectedUsers: Map<string, { socketId: string, lastActive: number }> = new Map();

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
    return this.io;
  }

  private setupSocketEvents() {
    if (!this.io) return;

    this.io.on('connection', (socket: Socket) => {
      console.log('New client connected');

      socket.on('authenticate', (userId: string) => {
        if (userId) {
          this.connectedUsers.set(userId, { 
            socketId: socket.id, 
            lastActive: Date.now() 
          });
          
          // Broadcast user online status
          this.broadcastUserStatus(userId, true);
        }
      });

      socket.on('disconnect', () => {
        this.handleUserDisconnect(socket.id);
      });

      // Heartbeat to track active status
      socket.on('user_activity', (userId: string) => {
        if (this.connectedUsers.has(userId)) {
          const userConnection = this.connectedUsers.get(userId)!;
          userConnection.lastActive = Date.now();
        }
      });
    });
  }

  private handleUserDisconnect(socketId: string) {
    for (const [userId, connection] of this.connectedUsers.entries()) {
      if (connection.socketId === socketId) {
        this.connectedUsers.delete(userId);
        this.broadcastUserStatus(userId, false);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  private broadcastUserStatus(userId: string, isOnline: boolean) {
    if (this.io) {
      this.io.emit('user_status_change', { userId, isOnline });
    }
  }

  getSocketId(userId: string): string | undefined {
    return this.connectedUsers.get(userId)?.socketId;
  }

  isUserOnline(userId: string): boolean {
    const userConnection = this.connectedUsers.get(userId);
    if (!userConnection) return false;

    // Consider user offline if no activity for more than 5 minutes
    return (Date.now() - userConnection.lastActive) < 5 * 60 * 1000;
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
}

export default SocketManager;
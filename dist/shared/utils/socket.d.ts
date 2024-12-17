import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
declare class SocketManager {
    private static instance;
    io: Server | null;
    private connectedUsers;
    private rooms;
    private constructor();
    static getInstance(): SocketManager;
    initialize(server: HttpServer): Server;
    private setupSocketEvents;
    private setupVideoCallEvents;
    private broadcastUserStatus;
    getSocketId(userId: string): string | undefined;
    isUserOnline(userId: string): boolean;
    emitToUser(userId: string, event: string, data: any): void;
    broadcast(event: string, data: any): void;
}
export default SocketManager;

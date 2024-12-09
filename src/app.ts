import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import connectDB from '../src/infrastructure/db/mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

// Import all your existing routes
import authRoutes from '../src/presentation/routes/AuthRoutes';
import adminRoutes from './presentation/routes/AdminRoute';
import userRouter from './presentation/routes/UserRoute';
import postRoutes from './presentation/routes/PostRoutes';
import productRouter from './presentation/routes/productRoutes';
import storyRouter from './presentation/routes/storyRoutes';
import liveStreamRouter from './presentation/routes/LiveStreamRoutes';
import chatRoutes from './presentation/routes/ChatRoutes';
import { ChatRepository } from './infrastructure/repositories/ChatRepository';
import { SocketService } from './infrastructure/services/SocketService';

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);
app.use('/user', userRouter);
app.use('/posts', postRoutes);
app.use('/market', productRouter);
app.use('/story', storyRouter);
app.use('/livestream', liveStreamRouter);
app.use('/chat', chatRoutes);

// Socket.IO connection management
const connectedUsers: Map<string, string> = new Map(); // userId to socketId mapping

io.on('connection', (socket) => {
  console.log('New client connected');

  // User authentication and socket mapping
  socket.on('authenticate', (userId: string) => {
    connectedUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    // Remove user from connected users
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Export the socket instance for use in other files
export { io, connectedUsers };

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
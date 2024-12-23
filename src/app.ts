import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from '../src/infrastructure/db/mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from '../src/presentation/routes/AuthRoutes';
import adminRoutes from '../src/presentation/routes/AdminRoute';
import userRouter from '../src/presentation/routes/UserRoute';
import postRoutes from '../src/presentation/routes/PostRoutes';
import productRouter from '../src/presentation/routes/productRoutes';
import storyRouter from '../src/presentation/routes/storyRoutes';
import liveStreamRouter from '../src/presentation/routes/LiveStreamRoutes';
import chatRoutes from '../src/presentation/routes/ChatRoutes';

import SocketManager from './shared/utils/socket';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket
const socketManager = SocketManager.getInstance();
socketManager.initialize(server);

// Middleware
app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true 
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

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});

export { socketManager };
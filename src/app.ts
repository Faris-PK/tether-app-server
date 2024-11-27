import express from 'express';
import dotenv from 'dotenv';
import connectDB from '../src/infrastructure/db/mongoose';
import authRoutes from '../src/presentation/routes/AuthRoutes';
import { MailService } from '../src/infrastructure/mail/MailService';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan'
import adminRoutes from './presentation/routes/AdminRoute';
import userRouter from './presentation/routes/UserRoute';
import postRoutes from './presentation/routes/PostRoutes';
import productRouter from './presentation/routes/productRoutes';
import storyRouter from './presentation/routes/storyRoutes';
import liveStreamRouter from './presentation/routes/LiveStreamRoutes'; 
dotenv.config();

const app = express();

app.use(cors({ 
  origin: process.env.FRONTEND_URL, 
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'))


app.use('/auth', authRoutes);
app.use('/admin', adminRoutes );
app.use('/user',userRouter);
app.use('/posts', postRoutes);
app.use('/market', productRouter);
app.use('/story', storyRouter);
app.use('/livestream', liveStreamRouter);

const PORT = process.env.PORT || 5000;

// Initialize MailService
//const mailService = new MailService();

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
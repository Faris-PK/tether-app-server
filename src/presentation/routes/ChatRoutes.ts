import express from 'express';
import { ChatController } from '../controllers/ChatController';
import { authMiddleware } from '../middleware/authMiddleware';

const chatRouter = express.Router();
const chatController = new ChatController();

// Get user's chat list
chatRouter.get('/chats', authMiddleware, (req, res) => chatController.getUserChats(req, res));

// Get messages for a specific chat
chatRouter.get('/messages/:chatId', authMiddleware, (req, res) => chatController.getChatMessages(req, res));
chatRouter.post('/send-message', authMiddleware, (req, res) => chatController.sendMessage(req, res));

export default chatRouter;
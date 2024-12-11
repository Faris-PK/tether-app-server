import express from 'express';
import { ChatController } from '../../presentation/controllers/ChatController';
import { ChatRepository } from '../../infrastructure/repositories/ChatRepository';
import { authMiddleware } from '../../presentation/middleware/authMiddleware';

const chatRouter = express.Router();
const chatRepository = new ChatRepository();
const chatController = new ChatController(chatRepository);

chatRouter.use(authMiddleware);

chatRouter.get('/contacts', (req, res) => chatController.getContacts(req, res));
chatRouter.get('/messages/:contactId', (req, res) => chatController.getMessages(req, res));
chatRouter.post('/send', (req, res) => chatController.sendMessage(req, res));
chatRouter.post('/read', (req, res) => chatController.markMessagesAsRead(req, res));

chatRouter.get('/search', (req, res) => chatController.searchUsers(req, res));
chatRouter.post('/start-chat', (req, res) => chatController.startNewChat(req, res));


export default chatRouter;
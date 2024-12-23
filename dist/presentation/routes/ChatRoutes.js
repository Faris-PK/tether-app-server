"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ChatController_1 = require("../../presentation/controllers/ChatController");
const ChatRepository_1 = require("../../infrastructure/repositories/ChatRepository");
const authMiddleware_1 = require("../../presentation/middleware/authMiddleware");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const chatRouter = express_1.default.Router();
const chatRepository = new ChatRepository_1.ChatRepository();
const chatController = new ChatController_1.ChatController(chatRepository);
chatRouter.use(authMiddleware_1.authMiddleware);
chatRouter.get('/contacts', (req, res) => chatController.getContacts(req, res));
chatRouter.get('/messages/:contactId', (req, res) => chatController.getMessages(req, res));
chatRouter.post('/send', upload.single('file'), (req, res) => chatController.sendMessage(req, res));
chatRouter.post('/read', (req, res) => chatController.markMessagesAsRead(req, res));
chatRouter.get('/search', (req, res) => chatController.searchUsers(req, res));
chatRouter.post('/start-chat', (req, res) => chatController.startNewChat(req, res));
chatRouter.patch('/message/delete/:messageId', (req, res) => chatController.deleteMessage(req, res));
exports.default = chatRouter;
//# sourceMappingURL=ChatRoutes.js.map
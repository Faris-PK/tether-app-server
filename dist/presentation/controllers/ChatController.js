"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const SocketService_1 = require("../../infrastructure/services/SocketService");
class ChatController {
    constructor(chatRepository) {
        this.chatRepository = chatRepository;
    }
    async getContacts(req, res) {
        try {
            const userId = req.userId;
            const contacts = await this.chatRepository.getContacts(userId !== null && userId !== void 0 ? userId : '');
            res.json(contacts);
        }
        catch (error) {
            console.error('Error fetching contacts:', error);
            res.status(500).json({ message: 'Failed to fetch contacts' });
        }
    }
    async getMessages(req, res) {
        try {
            const userId = req.userId;
            const contactId = req.params.contactId;
            const messages = await this.chatRepository.getMessages(userId !== null && userId !== void 0 ? userId : '', contactId);
            res.json(messages);
        }
        catch (error) {
            console.error('Error fetching messages:', error);
            res.status(500).json({ message: 'Failed to fetch messages' });
        }
    }
    async sendMessage(req, res) {
        try {
            const senderId = req.userId;
            const { contactId, message } = req.body;
            // Send message using repository
            const newMessage = await this.chatRepository.sendMessage(senderId !== null && senderId !== void 0 ? senderId : '', contactId, message);
            // Use SocketService to send live message
            SocketService_1.SocketService.sendLiveMessage(contactId, newMessage);
            res.json(newMessage);
        }
        catch (error) {
            console.error('Error sending message:', error);
            res.status(500).json({ message: 'Failed to send message' });
        }
    }
    async markMessagesAsRead(req, res) {
        try {
            const userId = req.userId;
            const { contactId } = req.body;
            // Mark messages as read in the repository
            await this.chatRepository.markMessagesAsRead(userId !== null && userId !== void 0 ? userId : '', contactId);
            res.status(200).json({ message: 'Messages marked as read' });
        }
        catch (error) {
            console.error('Error marking messages as read:', error);
            res.status(500).json({ message: 'Failed to mark messages as read' });
        }
    }
    async searchUsers(req, res) {
        var _a;
        try {
            const userId = req.userId;
            const query = (_a = req.query.query) === null || _a === void 0 ? void 0 : _a.toString();
            if (!query) {
                return res.status(400).json({ message: 'Query parameter is required' });
            }
            const users = await this.chatRepository.searchUsers(userId !== null && userId !== void 0 ? userId : '', query);
            res.json(users);
        }
        catch (error) {
            console.error('Error searching users:', error);
            res.status(500).json({ message: 'Failed to search users' });
        }
    }
    async startNewChat(req, res) {
        try {
            const userId = req.userId;
            const { userId: contactId } = req.body;
            if (!contactId) {
                return res.status(400).json({ message: 'Contact ID is required' });
            }
            const newChat = await this.chatRepository.startNewChat(userId !== null && userId !== void 0 ? userId : '', contactId);
            res.json(newChat);
        }
        catch (error) {
            console.error('Error starting new chat:', error);
            res.status(500).json({ message: 'Failed to start new chat' });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map
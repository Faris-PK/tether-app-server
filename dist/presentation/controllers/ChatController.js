"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const GetContactsUseCase_1 = require("../../application/useCases/chat/GetContactsUseCase");
const GetMessagesUseCase_1 = require("../../application/useCases/chat/GetMessagesUseCase");
const SendMessageUseCase_1 = require("../../application/useCases/chat/SendMessageUseCase");
const MarkMessagesAsReadUseCase_1 = require("../../application/useCases/chat/MarkMessagesAsReadUseCase");
const SearchUsersUseCase_1 = require("../../application/useCases/chat/SearchUsersUseCase");
const StartNewChatUseCase_1 = require("../../application/useCases/chat/StartNewChatUseCase");
const DeleteMessageUseCase_1 = require("../../application/useCases/chat/DeleteMessageUseCase");
const SocketService_1 = require("../../infrastructure/services/SocketService");
class ChatController {
    constructor(chatRepository) {
        this.getContactsUseCase = new GetContactsUseCase_1.GetContactsUseCase(chatRepository);
        this.getMessagesUseCase = new GetMessagesUseCase_1.GetMessagesUseCase(chatRepository);
        this.sendMessageUseCase = new SendMessageUseCase_1.SendMessageUseCase(chatRepository);
        this.markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase_1.MarkMessagesAsReadUseCase(chatRepository);
        this.searchUsersUseCase = new SearchUsersUseCase_1.SearchUsersUseCase(chatRepository);
        this.startNewChatUseCase = new StartNewChatUseCase_1.StartNewChatUseCase(chatRepository);
        this.deleteMessageUseCase = new DeleteMessageUseCase_1.DeleteMessageUseCase(chatRepository);
    }
    async getContacts(req, res) {
        try {
            const userId = req.userId;
            const contacts = await this.getContactsUseCase.execute(userId !== null && userId !== void 0 ? userId : '');
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
            const messages = await this.getMessagesUseCase.execute(userId !== null && userId !== void 0 ? userId : '', contactId);
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
            const { contactId, message, replyToMessageId } = req.body;
            const file = req.file;
            const newMessage = await this.sendMessageUseCase.execute(senderId !== null && senderId !== void 0 ? senderId : '', contactId, message, file, replyToMessageId);
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
            await this.markMessagesAsReadUseCase.execute(userId !== null && userId !== void 0 ? userId : '', contactId);
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
            const users = await this.searchUsersUseCase.execute(userId !== null && userId !== void 0 ? userId : '', query !== null && query !== void 0 ? query : '');
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
            const newChat = await this.startNewChatUseCase.execute(userId !== null && userId !== void 0 ? userId : '', contactId);
            res.json(newChat);
        }
        catch (error) {
            console.error('Error starting new chat:', error);
            res.status(500).json({ message: 'Failed to start new chat' });
        }
    }
    async deleteMessage(req, res) {
        try {
            const userId = req.userId;
            const messageId = req.params.messageId;
            const messageInfo = await this.deleteMessageUseCase.execute(userId !== null && userId !== void 0 ? userId : '', messageId);
            SocketService_1.SocketService.notifyMessageDeletion(messageInfo.receiverId.toString(), messageId);
            SocketService_1.SocketService.notifyMessageDeletion(messageInfo.senderId.toString(), messageId);
            res.status(200).json({ message: 'Message deleted successfully' });
        }
        catch (error) {
            console.error('Error deleting message:', error);
            res.status(500).json({ message: 'Failed to delete message' });
        }
    }
}
exports.ChatController = ChatController;
//# sourceMappingURL=ChatController.js.map
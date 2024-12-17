"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const mongoose_1 = require("mongoose");
const ChatMessage_1 = require("../../domain/entities/ChatMessage");
const User_1 = require("../../domain/entities/User");
class ChatRepository {
    async findOrCreateChat(userId, contactId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const contactObjectId = new mongoose_1.Types.ObjectId(contactId);
        let chat = await ChatMessage_1.Chat.findOne({
            participants: { $all: [userObjectId, contactObjectId] }
        });
        if (!chat) {
            chat = new ChatMessage_1.Chat({
                participants: [userObjectId, contactObjectId],
                messages: []
            });
            await chat.save();
        }
        return chat;
    }
    async getContacts(userId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const chats = await ChatMessage_1.Chat.find({
            participants: userObjectId
        }).populate({
            path: 'participants',
            match: { _id: { $ne: userObjectId } },
            select: 'username profile_picture bio'
        });
        const contacts = await Promise.all(chats.map(async (chat) => {
            const contact = chat.participants[0];
            if (!contact)
                return null;
            const lastMessage = await ChatMessage_1.Message.findOne({
                _id: { $in: chat.messages }
            })
                .sort({ createdAt: -1 })
                .limit(1);
            return {
                id: contact._id,
                username: contact.username,
                profile_picture: contact.profile_picture,
                bio: contact.bio,
                lastMessage: lastMessage ? lastMessage.text : null
            };
        }));
        return contacts.filter(contact => contact !== null);
    }
    async getMessages(userId, contactId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const contactObjectId = new mongoose_1.Types.ObjectId(contactId);
        const chat = await ChatMessage_1.Chat.findOne({
            participants: { $all: [userObjectId, contactObjectId] }
        });
        if (!chat)
            return [];
        const messages = await ChatMessage_1.Message.find({
            _id: { $in: chat.messages }
        }).populate('sender', 'username profile_picture');
        return messages;
    }
    async sendMessage(senderId, receiverId, messageText) {
        const senderObjectId = new mongoose_1.Types.ObjectId(senderId);
        const receiverObjectId = new mongoose_1.Types.ObjectId(receiverId);
        // Find or create chat
        let chat = await this.findOrCreateChat(senderId, receiverId);
        // Create new message
        const newMessage = new ChatMessage_1.Message({
            sender: senderObjectId,
            receiver: receiverObjectId,
            text: messageText,
            read: false
        });
        await newMessage.save();
        // Add message to chat
        chat.messages.push(newMessage.id);
        await chat.save();
        // Populate sender details
        await newMessage.populate('sender', 'username profile_picture');
        return newMessage;
    }
    async markMessagesAsRead(userId, contactId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const contactObjectId = new mongoose_1.Types.ObjectId(contactId);
        await ChatMessage_1.Message.updateMany({
            sender: contactObjectId,
            receiver: userObjectId,
            read: false
        }, { read: true });
    }
    async searchUsers(userId, query) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        if (!query || query.trim() === "") {
            throw new Error("Search query cannot be empty");
        }
        const regexQuery = new RegExp(query, "i"); // Case-insensitive regex
        // Ensure the search fields (e.g., `username` and `name`) exist in the schema
        const users = await User_1.User.find({
            $or: [
                { username: { $regex: regexQuery } },
                { email: { $regex: regexQuery } } // Replace with `name` if required
            ],
            _id: { $ne: userObjectId } // Exclude the current user
        }).select("username profile_picture bio");
        // Return mapped results
        return users.map(user => ({
            id: user._id,
            username: user.username,
            profile_picture: user.profile_picture,
            bio: user.bio
        }));
    }
    async startNewChat(userId, contactId) {
        const userObjectId = new mongoose_1.Types.ObjectId(userId);
        const contactObjectId = new mongoose_1.Types.ObjectId(contactId);
        let chat = await ChatMessage_1.Chat.findOne({
            participants: { $all: [userObjectId, contactObjectId] }
        });
        if (!chat) {
            chat = new ChatMessage_1.Chat({
                participants: [userObjectId, contactObjectId],
                messages: []
            });
            await chat.save();
        }
        return chat;
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=ChatRepository.js.map
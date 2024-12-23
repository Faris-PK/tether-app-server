"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const mongoose_1 = require("mongoose");
const ChatMessage_1 = require("../../domain/entities/ChatMessage");
const User_1 = require("../../domain/entities/User");
const S3Service_1 = require("../services/S3Service");
class ChatRepository {
    constructor() {
        this.s3Service = new S3Service_1.S3Service();
    }
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
    async sendMessage(senderId, receiverId, messageText, file, replyToMessageId) {
        const senderObjectId = new mongoose_1.Types.ObjectId(senderId);
        const receiverObjectId = new mongoose_1.Types.ObjectId(receiverId);
        let chat = await this.findOrCreateChat(senderId, receiverId);
        let fileUrl;
        let fileType;
        if (file) {
            const fileUpload = await this.s3Service.uploadFile(file, 'chat-files');
            fileUrl = fileUpload.Location;
            fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
        }
        const messageData = {
            sender: senderObjectId,
            receiver: receiverObjectId,
            text: messageText,
            fileUrl,
            fileType,
            read: false
        };
        if (replyToMessageId) {
            messageData.replyTo = new mongoose_1.Types.ObjectId(replyToMessageId);
        }
        const newMessage = new ChatMessage_1.Message(messageData);
        await newMessage.save();
        chat.messages.push(newMessage.id);
        await chat.save();
        await newMessage.populate([
            { path: 'sender', select: 'username profile_picture' },
            { path: 'replyTo', populate: { path: 'sender', select: 'username' } }
        ]);
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
        const regexQuery = new RegExp(query, "i");
        const users = await User_1.User.find({
            $or: [
                { username: { $regex: regexQuery } },
                { email: { $regex: regexQuery } }
            ],
            _id: { $ne: userObjectId }
        }).select("username profile_picture bio");
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
    async getMessageInfo(messageId) {
        const message = await ChatMessage_1.Message.findById(messageId)
            .select('sender receiver fileUrl')
            .lean();
        if (!message)
            return null;
        return {
            senderId: message.sender,
            receiverId: message.receiver,
            fileUrl: message.fileUrl
        };
    }
    async softDeleteMessage(messageId) {
        const message = await ChatMessage_1.Message.findById(messageId);
        if (!message)
            return;
        // If message has a file, delete it from S3
        if (message.fileUrl) {
            await this.s3Service.deleteFile(message.fileUrl);
        }
        // Mark message as deleted
        message.isDeleted = true;
        await message.save();
    }
}
exports.ChatRepository = ChatRepository;
//# sourceMappingURL=ChatRepository.js.map
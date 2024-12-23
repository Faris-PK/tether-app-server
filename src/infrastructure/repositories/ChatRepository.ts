import { Types } from 'mongoose';
import { Chat, Message, IChat, IMessage } from '../../domain/entities/ChatMessage';
import { User } from '../../domain/entities/User';
import { S3Service } from '../services/S3Service';
import { IChatRepository } from '../../domain/interfaces/IChatRepository';

export class ChatRepository implements IChatRepository {
  private s3Service: S3Service;

  constructor() {
    this.s3Service = new S3Service();
  }

  async findOrCreateChat(userId: string, contactId: string): Promise<IChat> {
    const userObjectId = new Types.ObjectId(userId);
    const contactObjectId = new Types.ObjectId(contactId);

    let chat = await Chat.findOne({
      participants: { $all: [userObjectId, contactObjectId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [userObjectId, contactObjectId],
        messages: []
      });
      await chat.save();
    }

    return chat;
  }

  async getContacts(userId: string): Promise<any[]> {
    const userObjectId = new Types.ObjectId(userId);

    const chats = await Chat.find({ 
      participants: userObjectId 
    }).populate({
      path: 'participants',
      match: { _id: { $ne: userObjectId } },
      select: 'username profile_picture bio'
    });

    const contacts = await Promise.all(chats.map(async (chat: any) => {
      const contact = chat.participants[0];
      
      if (!contact) return null;

      const lastMessage = await Message.findOne({
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

  async getMessages(userId: string, contactId: string): Promise<IMessage[]> {
    const userObjectId = new Types.ObjectId(userId);
    const contactObjectId = new Types.ObjectId(contactId);

    const chat = await Chat.findOne({
      participants: { $all: [userObjectId, contactObjectId] }
    });

    if (!chat) return [];

    const messages = await Message.find({
      _id: { $in: chat.messages }
    }).populate('sender', 'username profile_picture');

    return messages;
  }

  async sendMessage(
    senderId: string, 
    receiverId: string, 
    messageText?: string,
    file?: Express.Multer.File,
    replyToMessageId?: string
  ): Promise<IMessage> {
    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    let chat = await this.findOrCreateChat(senderId, receiverId);

    let fileUrl: string | undefined;
    let fileType: 'image' | 'video' | undefined;

    if (file) {
      const fileUpload = await this.s3Service.uploadFile(file, 'chat-files');
      fileUrl = fileUpload.Location;
      fileType = file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    const messageData: any = {
      sender: senderObjectId,
      receiver: receiverObjectId,
      text: messageText,
      fileUrl,
      fileType,
      read: false
    };

    if (replyToMessageId) {
      messageData.replyTo = new Types.ObjectId(replyToMessageId);
    }

    const newMessage = new Message(messageData);
    await newMessage.save();

    chat.messages.push(newMessage.id);
    await chat.save();

    await newMessage.populate([
      { path: 'sender', select: 'username profile_picture' },
      { path: 'replyTo', populate: { path: 'sender', select: 'username' } }
    ]);

    return newMessage;
  }

  async markMessagesAsRead(
    userId: string, 
    contactId: string
  ): Promise<void> {
    const userObjectId = new Types.ObjectId(userId);
    const contactObjectId = new Types.ObjectId(contactId);

    await Message.updateMany(
      { 
        sender: contactObjectId, 
        receiver: userObjectId, 
        read: false 
      }, 
      { read: true }
    );
  }

  async searchUsers(userId: string, query: string): Promise<any[]> {
    const userObjectId = new Types.ObjectId(userId);

    if (!query || query.trim() === "") {
        throw new Error("Search query cannot be empty");
    }

    const regexQuery = new RegExp(query, "i"); 

    const users = await User.find({
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

  async startNewChat(userId: string, contactId: string): Promise<IChat> {
    const userObjectId = new Types.ObjectId(userId);
    const contactObjectId = new Types.ObjectId(contactId);

    let chat = await Chat.findOne({
      participants: { $all: [userObjectId, contactObjectId] }
    });

    if (!chat) {
      chat = new Chat({
        participants: [userObjectId, contactObjectId],
        messages: []
      });
      await chat.save();
    }

    return chat;
  }

  async getMessageInfo(messageId: string) {
    const message = await Message.findById(messageId)
      .select('sender receiver fileUrl')
      .lean();
    
    if (!message) return null;
    
    return {
      senderId: message.sender,
      receiverId: message.receiver,
      fileUrl: message.fileUrl
    };
  }

  async softDeleteMessage(messageId: string) {
    const message = await Message.findById(messageId);
    if (!message) return;

    // If message has a file, delete it from S3
    if (message.fileUrl) {
      await this.s3Service.deleteFile(message.fileUrl);
    }

    // Mark message as deleted
    message.isDeleted = true;
    await message.save();
  }
}

import { Types } from 'mongoose';
import { Chat, Message, IChat, IMessage } from '../../domain/entities/ChatMessage';
import { UserRepository } from './UserRepository';

export class ChatRepository {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createChat(senderId: string, receiverId: string): Promise<IChat> {
    const existingChat = await this.findChatByParticipants(senderId, receiverId);
    
    if (existingChat) {
      return existingChat;
    }

    const newChat = new Chat({
      participants: [
        new Types.ObjectId(senderId), 
        new Types.ObjectId(receiverId)
      ],
      isGroupChat: false
    });

    return await newChat.save();
  }

  async findChatByParticipants(senderId: string, receiverId: string): Promise<IChat | null> {
    return await Chat.findOne({
      participants: { $all: [
        new Types.ObjectId(senderId), 
        new Types.ObjectId(receiverId)
      ]},
      isGroupChat: false
    });
  }

  async sendMessage(
    senderId: string, 
    receiverId: string, 
    content: string, 
    messageType: 'text' | 'image' | 'video' = 'text'
  ): Promise<IMessage> {
    const chat = await this.createChat(senderId, receiverId);

    const message = new Message({
      sender: new Types.ObjectId(senderId),
      receiver: new Types.ObjectId(receiverId),
      content,
      chatId: chat._id,
      messageType
    });

    await message.save();

    // Update last message in chat
    if (message._id) {
      chat.lastMessage = message._id as Types.ObjectId;
      await chat.save();
    }

    return message;
  }

  async getUserChats(userId: string): Promise<IChat[]> {
    return await Chat.find({
      participants: new Types.ObjectId(userId)
    })
    .populate({
      path: 'participants',
      select: 'username profile_picture'
    })
    .populate({
      path: 'lastMessage',
      populate: {
        path: 'sender',
        select: 'username'
      }
    })
    .sort({ updatedAt: -1 });
  }

  async getChatMessages(
    chatId: string, 
    page: number = 1, 
    limit: number = 50
  ): Promise<{
    messages: IMessage[],
    totalMessages: number,
    totalPages: number
  }> {
    const skip = (page - 1) * limit;

    const messages = await Message.find({ chatId: new Types.ObjectId(chatId) })
      .populate('sender', 'username profile_picture')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit);

    const totalMessages = await Message.countDocuments({ chatId: new Types.ObjectId(chatId) });
    const totalPages = Math.ceil(totalMessages / limit);

    return {
      messages,
      totalMessages,
      totalPages
    };
  }

  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    await Message.updateMany(
      { 
        chatId: new Types.ObjectId(chatId), 
        receiver: new Types.ObjectId(userId),
        isRead: false 
      },
      { $set: { isRead: true } }
    );
  }
}
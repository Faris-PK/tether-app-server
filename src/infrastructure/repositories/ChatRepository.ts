import { Types } from 'mongoose';
import { Chat, Message, IChat, IMessage } from '../../domain/entities/ChatMessage';
import { User } from '../../domain/entities/User';

export class ChatRepository {
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
    messageText: string
  ): Promise<IMessage> {
    const senderObjectId = new Types.ObjectId(senderId);
    const receiverObjectId = new Types.ObjectId(receiverId);

    // Find or create chat
    let chat = await this.findOrCreateChat(senderId, receiverId);

    // Create new message
    const newMessage = new Message({
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

    const regexQuery = new RegExp(query, "i"); // Case-insensitive regex

    // Ensure the search fields (e.g., `username` and `name`) exist in the schema
    const users = await User.find({
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
      .select('sender receiver')
      .lean();
    
    if (!message) return null;
    
    return {
      senderId: message.sender,
      receiverId: message.receiver
    };
  }

  async softDeleteMessage(messageId: string) {
    // Update the message to mark it as deleted
    await Message.findByIdAndUpdate(messageId, { isDeleted: true });
  }
  
}
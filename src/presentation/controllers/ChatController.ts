import { Request, Response } from 'express';
import { ChatRepository } from '../../infrastructure/repositories/ChatRepository';
import { SocketService } from '../../infrastructure/services/SocketService';

export class ChatController {
  private chatRepository: ChatRepository;

  constructor(chatRepository: ChatRepository) {
    this.chatRepository = chatRepository;
  }

  async getContacts(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const contacts = await this.chatRepository.getContacts(userId??'');
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ message: 'Failed to fetch contacts' });
    }
  }

  async getMessages(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const contactId = req.params.contactId;
      const messages = await this.chatRepository.getMessages(userId??'', contactId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.userId;
      const { contactId, message } = req.body;
      
      // Send message using repository
      const newMessage = await this.chatRepository.sendMessage(
        senderId??'', 
        contactId, 
        message
      );

      // Use SocketService to send live message
      SocketService.sendLiveMessage(contactId, newMessage);

      res.json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ message: 'Failed to send message' });
    }
  }

  async markMessagesAsRead(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { contactId } = req.body;
      
      // Mark messages as read in the repository
      await this.chatRepository.markMessagesAsRead(userId??'', contactId);

      res.status(200).json({ message: 'Messages marked as read' });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      res.status(500).json({ message: 'Failed to mark messages as read' });
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const query = req.query.query?.toString();

      if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
      }
      
      const users = await this.chatRepository.searchUsers(userId??'', query);
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Failed to search users' });
    }
  }

  async startNewChat(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { userId: contactId } = req.body;
      if (!contactId) {
        return res.status(400).json({ message: 'Contact ID is required' });
      }
      
      const newChat = await this.chatRepository.startNewChat(userId??'', contactId);
      res.json(newChat);
    } catch (error) {
      console.error('Error starting new chat:', error);
      res.status(500).json({ message: 'Failed to start new chat' });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const messageId = req.params.messageId;
      
      // Get message info
      const messageInfo = await this.chatRepository.getMessageInfo(messageId);
      
      if (!messageInfo) {
        return res.status(404).json({ message: 'Message not found' });
      }
  
      // Verify the user is the sender
      if (messageInfo.senderId.toString() !== userId) {
        return res.status(403).json({ message: 'Unauthorized to delete this message' });
      }
  
      // Soft delete the message
      await this.chatRepository.softDeleteMessage(messageId);
      
      // Notify both users about the deleted message
      SocketService.notifyMessageDeletion(messageInfo.receiverId.toString(), messageId);
      SocketService.notifyMessageDeletion(messageInfo.senderId.toString(), messageId);
  
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Failed to delete message' });
    }
  }
}
import { Request, Response } from 'express';
import { ChatRepository } from '../../infrastructure/repositories/ChatRepository';

export class ChatController {
  private chatRepository: ChatRepository;

  constructor() {
    this.chatRepository = new ChatRepository();
  }

  async getUserChats(req: Request, res: Response) {
    try {
      const userId = req.userId;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }

      const chats = await this.chatRepository.getUserChats(userId);

      return res.status(200).json({
        success: true,
        data: chats
      });
    } catch (error) {
      console.error('Error getting user chats:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async getChatMessages(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const { chatId } = req.params;
      const { page = 1, limit = 50 } = req.query;

      if (!userId) {
        return res.status(400).json({ 
          success: false, 
          message: 'User ID is required' 
        });
      }

      const { 
        messages, 
        totalMessages, 
        totalPages 
      } = await this.chatRepository.getChatMessages(
        chatId, 
        Number(page), 
        Number(limit)
      );

      return res.status(200).json({
        success: true,
        data: {
          messages,
          pagination: {
            totalMessages,
            totalPages,
            currentPage: Number(page)
          }
        }
      });
    } catch (error) {
      console.error('Error getting chat messages:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error' 
      });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.userId;
      const { receiverId, content, messageType = 'text' } = req.body;

      if (!senderId || !receiverId || !content) {
        return res.status(400).json({ 
          success: false, 
          message: 'Sender, receiver, and content are required' 
        });
      }

      const message = await this.chatRepository.sendMessage(
        senderId, 
        receiverId, 
        content, 
        messageType
      );

      return res.status(201).json({
        success: true,
        data: message
      });
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500)

    }
}
}
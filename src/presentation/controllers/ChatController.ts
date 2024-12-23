import { Request, Response } from 'express';
import { GetContactsUseCase } from '../../application/useCases/chat/GetContactsUseCase';
import { GetMessagesUseCase } from '../../application/useCases/chat/GetMessagesUseCase';
import { SendMessageUseCase } from '../../application/useCases/chat/SendMessageUseCase';
import { MarkMessagesAsReadUseCase } from '../../application/useCases/chat/MarkMessagesAsReadUseCase';
import { SearchUsersUseCase } from '../../application/useCases/chat/SearchUsersUseCase';
import { StartNewChatUseCase } from '../../application/useCases/chat/StartNewChatUseCase';
import { DeleteMessageUseCase } from '../../application/useCases/chat/DeleteMessageUseCase';
import { IChatRepository } from '../../domain/interfaces/IChatRepository';
import { SocketService } from '../../infrastructure/services/SocketService';

export class ChatController {
  private getContactsUseCase: GetContactsUseCase;
  private getMessagesUseCase: GetMessagesUseCase;
  private sendMessageUseCase: SendMessageUseCase;
  private markMessagesAsReadUseCase: MarkMessagesAsReadUseCase;
  private searchUsersUseCase: SearchUsersUseCase;
  private startNewChatUseCase: StartNewChatUseCase;
  private deleteMessageUseCase: DeleteMessageUseCase;

  constructor(chatRepository: IChatRepository) {
    this.getContactsUseCase = new GetContactsUseCase(chatRepository);
    this.getMessagesUseCase = new GetMessagesUseCase(chatRepository);
    this.sendMessageUseCase = new SendMessageUseCase(chatRepository);
    this.markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(chatRepository);
    this.searchUsersUseCase = new SearchUsersUseCase(chatRepository);
    this.startNewChatUseCase = new StartNewChatUseCase(chatRepository);
    this.deleteMessageUseCase = new DeleteMessageUseCase(chatRepository);
  }

  async getContacts(req: Request, res: Response) {
    try {
      const userId = req.userId;
      const contacts = await this.getContactsUseCase.execute(userId ?? '');
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
      const messages = await this.getMessagesUseCase.execute(userId ?? '', contactId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ message: 'Failed to fetch messages' });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const senderId = req.userId;
      const { contactId, message, replyToMessageId } = req.body;
      const file = req.file;
  
      const newMessage = await this.sendMessageUseCase.execute(
        senderId ?? '',
        contactId,
        message,
        file,
        replyToMessageId
      );
  
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
      
      await this.markMessagesAsReadUseCase.execute(userId ?? '', contactId);
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
      
      const users = await this.searchUsersUseCase.execute(userId ?? '', query ?? '');
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
      
      const newChat = await this.startNewChatUseCase.execute(userId ?? '', contactId);
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
      
      const messageInfo = await this.deleteMessageUseCase.execute(userId ?? '', messageId);
      
      SocketService.notifyMessageDeletion(messageInfo.receiverId.toString(), messageId);
      SocketService.notifyMessageDeletion(messageInfo.senderId.toString(), messageId);
      
      res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
      console.error('Error deleting message:', error);
      res.status(500).json({ message: 'Failed to delete message' });
    }
  }
}

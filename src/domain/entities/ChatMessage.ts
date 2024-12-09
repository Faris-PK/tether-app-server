import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  content: string;
  chatId: Types.ObjectId;
  isRead: boolean;
  messageType: 'text' | 'image' | 'video';
  createdAt: Date;
}

export interface IChat extends Document {
  participants: Types.ObjectId[];
  lastMessage?: Types.ObjectId;
  isGroupChat: boolean;
  groupName?: string;
  groupAdmins?: Types.ObjectId[];
}

const MessageSchema: Schema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  chatId: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  isRead: { type: Boolean, default: false },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'video'], 
    default: 'text' 
  }
}, { timestamps: true });

const ChatSchema: Schema = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  isGroupChat: { type: Boolean, default: false },
  groupName: { type: String },
  groupAdmins: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
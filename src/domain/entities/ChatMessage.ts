import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IMessage extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  text?: string;
  fileUrl?: string;
  fileType?: 'image' | 'video';
  read: boolean;
  isDeleted: boolean;
  replyTo: Types.ObjectId;
}

export interface IChat extends Document {
  participants: Types.ObjectId[];
  messages: Types.ObjectId[];
}

const MessageSchema: Schema = new Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String },
  fileUrl: { type: String },
  fileType: { type: String, enum: ['image', 'video'] },
  read: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' }

}, { timestamps: true });

const ChatSchema: Schema = new Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }]
}, { timestamps: true });

export const Message = mongoose.model<IMessage>('Message', MessageSchema);
export const Chat = mongoose.model<IChat>('Chat', ChatSchema);
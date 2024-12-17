import mongoose, { Document, Types } from 'mongoose';
export interface IMessage extends Document {
    sender: Types.ObjectId;
    receiver: Types.ObjectId;
    text: string;
    read: boolean;
}
export interface IChat extends Document {
    participants: Types.ObjectId[];
    messages: Types.ObjectId[];
}
export declare const Message: mongoose.Model<IMessage, {}, {}, {}, mongoose.Document<unknown, {}, IMessage> & IMessage & Required<{
    _id: unknown;
}>, any>;
export declare const Chat: mongoose.Model<IChat, {}, {}, {}, mongoose.Document<unknown, {}, IChat> & IChat & Required<{
    _id: unknown;
}>, any>;

import mongoose, { Document, Types } from 'mongoose';
export interface INotification extends Document {
    recipient: Types.ObjectId;
    sender: Types.ObjectId;
    type: 'follow_request' | 'follow_accept' | 'like' | 'comment' | 'reply_comment';
    postId?: Types.ObjectId;
    commentId?: Types.ObjectId;
    content: string;
    read: boolean;
    createdAt: Date;
}
export declare const Notification: mongoose.Model<INotification, {}, {}, {}, mongoose.Document<unknown, {}, INotification> & INotification & Required<{
    _id: unknown;
}>, any>;

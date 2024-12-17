import mongoose, { Document, Types } from 'mongoose';
export interface IPost extends Document {
    userId: Types.ObjectId;
    caption?: string;
    mediaUrl?: string;
    postType: 'image' | 'video' | 'note';
    location?: string;
    likes: Types.ObjectId[];
    isBlocked: boolean;
    commentCount?: number;
}
export declare const Post: mongoose.Model<IPost, {}, {}, {}, mongoose.Document<unknown, {}, IPost> & IPost & Required<{
    _id: unknown;
}>, any>;

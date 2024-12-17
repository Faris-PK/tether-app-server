import mongoose, { Document, Types } from 'mongoose';
export interface IComment extends Document {
    postId: Types.ObjectId;
    userId: Types.ObjectId;
    content: string;
    isDeleted: boolean;
    parentCommentId?: Types.ObjectId;
}
export declare const Comment: mongoose.Model<IComment, {}, {}, {}, mongoose.Document<unknown, {}, IComment> & IComment & Required<{
    _id: unknown;
}>, any>;

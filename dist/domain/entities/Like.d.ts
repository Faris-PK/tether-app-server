import mongoose, { Document, Types } from 'mongoose';
export interface ILike extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
}
export declare const Like: mongoose.Model<ILike, {}, {}, {}, mongoose.Document<unknown, {}, ILike> & ILike & Required<{
    _id: unknown;
}>, any>;

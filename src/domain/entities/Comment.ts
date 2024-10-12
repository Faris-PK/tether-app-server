import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  text: string;
  likes: Types.ObjectId[];
}

const CommentSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  text: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  postId: Types.ObjectId;
  userId: Types.ObjectId;
  content: string;
  isDeleted: boolean;
  parentCommentId?: Types.ObjectId;
}

const CommentSchema: Schema = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  parentCommentId: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);

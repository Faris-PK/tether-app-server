import mongoose, { Schema, Document, Types } from 'mongoose';

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

const PostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String },
  mediaUrl: { type: String },
  postType: { type: String, enum: ['image', 'video', 'note'], required: true },
  location: { type: String },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isBlocked: { type: Boolean, default: false }, 
}, { timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
 });


PostSchema.virtual('commentCount', {
  ref: 'Comment',
  localField: '_id',
  foreignField: 'postId',
  count: true, 
  match: { isDeleted: false }
});

export const Post = mongoose.model<IPost>('Post', PostSchema);

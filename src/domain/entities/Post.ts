import { Type } from '@aws-sdk/client-s3';
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPost extends Document {
  userId: Types.ObjectId;
  caption?: string;
  mediaUrl?: string;
  postType: 'image' | 'video' | 'note';
  location?: string;
  likes:Types.ObjectId[];
  
}

const PostSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String },
  mediaUrl: { type: String },
  postType: { type: String, enum: ['image', 'video', 'note'], required: true },
  location: { type: String },
  likes:[{ type: Schema.Types.ObjectId, ref: 'User'}],
},  { timestamps: true });

export const Post = mongoose.model<IPost>('Post', PostSchema);
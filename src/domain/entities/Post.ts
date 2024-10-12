import mongoose, { Schema, Document, Types} from "mongoose";

export interface IPost extends Document {
    userId: Types.ObjectId;
    contentType: 'image' | 'video' | 'note';
    contentUrl: string;
    caption: string;
    likes: Types.ObjectId[];
    comments: Types.ObjectId[];
    location:string
}

const PostSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    contentType: { type: String, enum: ['image', 'video', 'note'], required: true },
    contentUrl: { type: String, required: true },
    caption: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    location:{ type: String},
  }, { timestamps: true });
  
  export const Post = mongoose.model<IPost>('Post', PostSchema);
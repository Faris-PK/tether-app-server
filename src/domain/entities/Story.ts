import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IStory extends Document {
  userId: Types.ObjectId;
  mediaUrl: string;
  musicTrackId?: string;
  musicPreviewUrl?: string;
  musicName?:string;
  caption?: string;
  duration: number; 
  viewedUsers: Types.ObjectId[];
  likedUsers: Types.ObjectId[];

}

const StorySchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    mediaUrl: { type: String, required: true },
    musicTrackId: { type: String },
    musicPreviewUrl: { type: String },
    caption: { type: String },
    musicName:{type: String},
    duration: { type: Number, default: 24 * 60 * 60 },
    viewedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    likedUsers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, expires: "24h", default: Date.now },
  },
  { timestamps: true }
);

StorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

export const Story: Model<IStory> = mongoose.model<IStory>("Story", StorySchema);

import { Document, Model, Types } from "mongoose";
export interface IStory extends Document {
    userId: Types.ObjectId;
    mediaUrl: string;
    musicTrackId?: string;
    musicPreviewUrl?: string;
    musicName?: string;
    caption?: string;
    duration: number;
    viewedUsers: Types.ObjectId[];
    likedUsers: Types.ObjectId[];
}
export declare const Story: Model<IStory>;

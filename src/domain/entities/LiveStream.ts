import mongoose, { Model, Schema, Types } from 'mongoose';
import { User } from './User';

export interface ILiveStream extends Document {
  _id: Types.ObjectId;
  host: Types.ObjectId ;
  roomId: string;
  viewers: Types.ObjectId[];
  isActive: boolean;
  startedAt: Date;
  endedAt?: Date;
}

const LiveStreamSchema: Schema = new Schema(
  {
    host: { type: Schema.Types.ObjectId, ref: "User", required: true },
    roomId: { type: String, required: true, unique: true },
    viewers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    isActive: { type: Boolean, default: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date }
  },
  { timestamps: true }
);

export const LiveStream: Model<ILiveStream> = mongoose.model<ILiveStream>("LiveStream", LiveStreamSchema);
import { Model, Types } from 'mongoose';
export interface ILiveStream extends Document {
    _id: Types.ObjectId;
    host: Types.ObjectId;
    roomId: string;
    viewers: Types.ObjectId[];
    isActive: boolean;
    startedAt: Date;
    endedAt?: Date;
}
export declare const LiveStream: Model<ILiveStream>;

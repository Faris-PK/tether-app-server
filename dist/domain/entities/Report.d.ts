import mongoose, { Document } from 'mongoose';
export interface IReport extends Document {
    postId: mongoose.Types.ObjectId;
    reportedBy: mongoose.Types.ObjectId;
    reason: string;
    status: 'pending' | 'reviewed' | 'resolved';
    createdAt: Date;
    updatedAt: Date;
}
export declare const Report: mongoose.Model<IReport, {}, {}, {}, mongoose.Document<unknown, {}, IReport> & IReport & Required<{
    _id: unknown;
}>, any>;

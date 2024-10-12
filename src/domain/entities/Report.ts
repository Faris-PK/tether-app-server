import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  reason: string;
  createdAt: Date;
}

const ReportSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  reason: { type: String, required: true },
}, { timestamps: true });

export const Report = mongoose.model<IReport>('Report', ReportSchema);
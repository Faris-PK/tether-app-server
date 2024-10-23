import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IReport extends Document {
    user: Types.ObjectId;
    post: Types.ObjectId;
    reason: string;
  }
  
  const ReportSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    reason: { type: String, required: true },
  }, { timestamps: true });
  
  export const Report = mongoose.model<IReport>('Report', ReportSchema);
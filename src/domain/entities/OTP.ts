import mongoose, { Schema, Document } from 'mongoose';

export interface IOTP extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const OTPSchema: Schema = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1m' },
});

export const OTP = mongoose.model<IOTP>('OTP', OTPSchema);

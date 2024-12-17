import mongoose, { Document } from 'mongoose';
export interface IOTP extends Document {
    email: string;
    otp: string;
    createdAt: Date;
}
export declare const OTP: mongoose.Model<IOTP, {}, {}, {}, mongoose.Document<unknown, {}, IOTP> & IOTP & Required<{
    _id: unknown;
}>, any>;

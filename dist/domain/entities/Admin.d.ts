import mongoose, { Document } from 'mongoose';
export interface IAdmin extends Document {
    email: string;
    password: string;
}
export declare const Admin: mongoose.Model<IAdmin, {}, {}, {}, mongoose.Document<unknown, {}, IAdmin> & IAdmin & Required<{
    _id: unknown;
}>, any>;

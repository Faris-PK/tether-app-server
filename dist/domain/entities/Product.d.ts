import mongoose, { Document, Types } from 'mongoose';
export interface IProduct extends Document {
    userId: Types.ObjectId;
    title: string;
    price: number;
    category: string;
    location: {
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    description: string;
    images: string[];
    isBlocked: boolean;
    isPromoted: boolean;
    promotionExpiry: Date | null;
    isApproved: boolean;
}
export declare const Product: mongoose.Model<IProduct, {}, {}, {}, mongoose.Document<unknown, {}, IProduct> & IProduct & Required<{
    _id: unknown;
}>, any>;

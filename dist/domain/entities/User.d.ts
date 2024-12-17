import mongoose, { Document, Types } from 'mongoose';
export interface IUser extends Document {
    stripeCustomerId: string;
    createdAt: any;
    username: string;
    email: string;
    password: string;
    mobile: string;
    googleId?: string;
    isBlocked: boolean;
    bio?: string;
    profile_picture?: string;
    cover_photo?: string;
    premium_status: boolean;
    userLocation: {
        name: string;
        coordinates: {
            latitude: number;
            longitude: number;
        };
    };
    premium_expiration?: Date;
    dob?: Date;
    followers: Types.ObjectId[];
    following: Types.ObjectId[];
    posts: Types.ObjectId[];
    social_links?: string[];
    blocked_users: Types.ObjectId[];
}
export declare const User: mongoose.Model<IUser, {}, {}, {}, mongoose.Document<unknown, {}, IUser> & IUser & Required<{
    _id: unknown;
}>, any>;

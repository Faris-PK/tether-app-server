import { Types } from 'mongoose';
export interface PopulatedUser {
    _id: Types.ObjectId;
    username: string;
    profile_picture: string;
    bio?: string;
}
export interface UserWithPopulatedConnections {
    _id: Types.ObjectId;
    username: string;
    email: string;
    profile_picture: string;
    bio?: string;
    followers: PopulatedUser[];
    following: PopulatedUser[];
}

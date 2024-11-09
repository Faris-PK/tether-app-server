import { Types } from 'mongoose';
import { IUser } from '../entities/User';

export interface PopulatedUser {
  _id: Types.ObjectId;
  username: string;
  profile_picture: string;
  bio?: string;
}

export interface UserWithPopulatedConnections extends IUser {
  followers: PopulatedUser[];
  following: PopulatedUser[];
}
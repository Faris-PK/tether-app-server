import { Types } from 'mongoose';
import { IUser } from '../entities/User';
import { PopulatedUser } from '../types/PopulatedUser';

export interface IUserRepository {
  save(user: IUser): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  findByGoogleId(googleId: string): Promise<IUser | null>;
  findAll(): Promise<IUser[]>;
  update(id: string | Types.ObjectId, updateData: Partial<IUser>): Promise<IUser | null>;
  findPotentialConnections(userId: string, following: Types.ObjectId[], limit: number): Promise<IUser[]>;
  getFollowers(userId: string): Promise<PopulatedUser[]>;
  getFollowing(userId: string): Promise<PopulatedUser[]>;
}
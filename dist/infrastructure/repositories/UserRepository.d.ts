import { Types } from 'mongoose';
import { IUser } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { PopulatedUser } from '../../domain/types/PopulatedUser';
export declare class UserRepository implements IUserRepository {
    save(user: IUser): Promise<IUser>;
    findByEmail(email: string): Promise<IUser | null>;
    findByUsername(username: string): Promise<IUser | null>;
    findById(id: string): Promise<IUser | null>;
    findByGoogleId(googleId: string): Promise<IUser | null>;
    findAll(): Promise<IUser[]>;
    update(id: string | Types.ObjectId, updateData: Partial<IUser>): Promise<IUser>;
    findPotentialConnections(userId: string, following: Types.ObjectId[], limit: number): Promise<IUser[]>;
    getFollowers(userId: string): Promise<PopulatedUser[]>;
    getFollowing(userId: string): Promise<PopulatedUser[]>;
    searchUsers({ page, limit, searchTerm }?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
    }): Promise<{
        users: IUser[];
        totalUsers: number;
        totalPages: number;
    }>;
}

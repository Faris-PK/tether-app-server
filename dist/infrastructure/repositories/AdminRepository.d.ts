import { IAdmin } from '../../domain/entities/Admin';
import { IUser } from '../../domain/entities/User';
import { IAdminRepository } from '../../domain/interfaces/IAdminRepository';
import { IPost } from '../../domain/entities/Post';
import { IProduct } from '../../domain/entities/Product';
export declare class AdminRepository implements IAdminRepository {
    findByEmail(email: string): Promise<IAdmin | null>;
    findAllUsers({ page, limit, searchTerm, sortField, sortOrder }?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        users: IUser[];
        totalUsers: number;
        totalPages: number;
    }>;
    toggleUserBlockStatus(userId: string, blockStatus: boolean): Promise<IUser>;
    findAllPosts({ page, limit, searchTerm, sortField, sortOrder }?: {
        page?: number;
        limit?: number;
        searchTerm?: string;
        sortField?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        posts: IPost[];
        totalPosts: number;
        totalPages: number;
    }>;
    togglePostBlockStatus(postId: string, blockStatus: boolean): Promise<IPost>;
    findAllProducts({ page, limit, search, sortOrder, category, minPrice, maxPrice }?: {
        page?: number;
        limit?: number;
        search?: string;
        sortOrder?: 'asc' | 'desc';
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        products: IProduct[];
        totalProducts: number;
        totalPages: number;
    }>;
}

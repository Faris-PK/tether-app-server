import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { IPost } from '../../../domain/entities/Post';
export declare class GetPostsUseCase {
    private adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(params?: {
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
}

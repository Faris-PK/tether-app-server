import { AdminRepository } from '../../../infrastructure/repositories/AdminRepository';
import { IUser } from '../../../domain/entities/User';
export declare class GetUsersUseCase {
    private adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(params?: {
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
}

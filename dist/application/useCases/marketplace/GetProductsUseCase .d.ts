import { AdminRepository } from "../../../infrastructure/repositories/AdminRepository";
export declare class GetProductsUseCase {
    private adminRepository;
    constructor(adminRepository: AdminRepository);
    execute(params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortOrder?: 'asc' | 'desc';
        category?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<{
        products: any[];
        totalPages: number;
        totalProducts: number;
    }>;
}

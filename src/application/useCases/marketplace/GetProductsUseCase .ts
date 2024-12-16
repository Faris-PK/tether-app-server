import { IProductRepository } from "../../../domain/interfaces/IProductRepository";
import { AdminRepository } from "../../../infrastructure/repositories/AdminRepository";

export class GetProductsUseCase {
  constructor(private adminRepository: AdminRepository) {}

  async execute(params?: {
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
  }> {
    try {
      return await this.adminRepository.findAllProducts(params);
    } catch (error) {
      throw error;
    }
  }
}
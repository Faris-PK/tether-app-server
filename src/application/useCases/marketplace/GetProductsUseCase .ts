import { IProductRepository } from "../../../domain/interfaces/IProductRepository";
import { ProductRepository } from "../../../infrastructure/repositories/ProductRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}
  
    async execute(filters?: any): Promise<any> {
      try {
        return await this.productRepository.findAll(filters);
      } catch (error) {
        throw error;
      }
    }
  }
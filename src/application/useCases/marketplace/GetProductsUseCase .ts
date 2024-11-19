import { IProductRepository } from "../../../domain/interfaces/IProductRepository";
import { ProductRepository } from "../../../infrastructure/repositories/ProductRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}
  
    async execute(): Promise<any> {
      try {
        return await this.productRepository.findAllProducts();
      } catch (error) {
        throw error;
      }
    }
  }
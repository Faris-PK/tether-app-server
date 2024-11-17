import { IProductRepository } from "../../../domain/interfaces/IProductRepository";
import { S3Service } from "../../../infrastructure/services/S3Service";

export class DeleteProductUseCase {
    constructor(
      private productRepository: IProductRepository,
      private s3Service: S3Service
    ) {}
  
    async execute(productId: string, userId: string): Promise<void> {
      const product = await this.productRepository.findById(productId);
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (product.userId._id.toString() !== userId) {
        throw new Error('Unauthorized to delete this product');
      }
  
      try {
        const deletePromises = product.images.map(imageUrl => 
          this.s3Service.deleteFile(imageUrl)
        );
        await Promise.all(deletePromises);
  
        await this.productRepository.delete(productId);
      } catch (error) {
        throw new Error('Failed to delete product: ' + error);
      }
    }
  }
  
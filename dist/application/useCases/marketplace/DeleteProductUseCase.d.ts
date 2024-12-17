import { IProductRepository } from "../../../domain/interfaces/IProductRepository";
import { S3Service } from "../../../infrastructure/services/S3Service";
export declare class DeleteProductUseCase {
    private productRepository;
    private s3Service;
    constructor(productRepository: IProductRepository, s3Service: S3Service);
    execute(productId: string, userId: string): Promise<void>;
}

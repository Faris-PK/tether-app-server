import { IProductRepository } from '../../../domain/interfaces/IProductRepository';
import { S3Service } from '../../../infrastructure/services/S3Service';
import { UpdateProductDTO } from '../../dto/UpdateProductDTO ';
export declare class UpdateProductUseCase {
    private productRepository;
    private s3Service;
    constructor(productRepository: IProductRepository, s3Service: S3Service);
    execute(productId: string, userId: string, productData: UpdateProductDTO, files?: Express.Multer.File[]): Promise<any>;
}
